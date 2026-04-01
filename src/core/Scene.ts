import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Texture URLs (CDN, CORS-friendly)
const EARTH_TEXTURE = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg';
const EARTH_BUMP = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png';

export class SceneManager {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  controls: OrbitControls;

  // Dynamic lights
  private rimLight!: THREE.PointLight;
  private fillLight!: THREE.PointLight;
  private flashLight!: THREE.PointLight;

  // Ambient particles (space dust)
  private ambientParticles!: THREE.Points;
  private particleVelocities: Float32Array = new Float32Array(0);

  // Earth
  private earth!: THREE.Mesh;
  private earthAtmo!: THREE.Mesh;
  private thrusterParticles!: THREE.Points;
  private thrusterVelocities: Float32Array = new Float32Array(0);

  // Moon ground ring
  private groundRingMat!: THREE.MeshBasicMaterial;

  private elapsed = 0;

  constructor(container: HTMLElement) {
    // Scene — deep space black
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020208);
    // Very distant fog to fade far objects gently
    this.scene.fog = new THREE.FogExp2(0x020208, 0.008);

    // Camera — offset left, low angle, looking up-right at MOSS (Pokémon style)
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    this.camera.position.set(-2.8, 1.2, 5.4);
    this.camera.lookAt(0.5, 3.5, -3);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // Orbit controls — drag to rotate, scroll to zoom
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0.5, 3.5, -3); // look at battle center — angled up at MOSS
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 25;
    this.controls.maxPolarAngle = Math.PI * 0.85; // don't go below ground
    this.controls.update();

    // Post-processing
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloomSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
    this.bloomPass = new UnrealBloomPass(bloomSize, 0.4, 0.4, 0.85);
    this.composer.addPass(this.bloomPass);

    this.composer.addPass(new OutputPass());

    // Build scene
    this.setupLights();
    this.buildStarfield();
    this.buildMoonSurface();
    this.buildEarth();
    this.setupAmbientParticles();

    // Resize
    window.addEventListener('resize', () => this.onResize());
  }

  private setupLights() {
    // Space ambient — very dim cold blue
    const ambient = new THREE.AmbientLight(0x223344, 0.5);
    this.scene.add(ambient);

    // Main sun light — harsh directional from upper-left (space sunlight)
    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    sunLight.position.set(8, 12, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    this.scene.add(sunLight);

    // Rim light — red behind MOSS
    this.rimLight = new THREE.PointLight(0xff2200, 1.0, 20);
    this.rimLight.position.set(0, 4, -8);
    this.scene.add(this.rimLight);

    // Blue fill from Earth direction (reflected light)
    this.fillLight = new THREE.PointLight(0x3366aa, 0.6, 25);
    this.fillLight.position.set(5, 8, -15);
    this.scene.add(this.fillLight);

    // Flash light (off by default)
    this.flashLight = new THREE.PointLight(0xffffff, 0, 20);
    this.flashLight.position.set(0, 3, 0);
    this.scene.add(this.flashLight);
  }

  // === Starfield ===
  private buildStarfield() {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 150 + Math.random() * 50;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 0.3 + Math.random() * 1.0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.4,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const stars = new THREE.Points(geo, mat);
    this.scene.add(stars);
  }

  // === Moon Surface ===
  private buildMoonSurface() {
    // Main ground — large gray plane
    const groundGeo = new THREE.PlaneGeometry(40, 40, 64, 64);

    // Procedural displacement for craters/bumps
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      // Multi-octave noise approximation using sin combinations
      let h = 0;
      h += Math.sin(x * 0.5) * Math.cos(y * 0.7) * 0.15;
      h += Math.sin(x * 1.3 + 1.5) * Math.cos(y * 1.1 + 0.8) * 0.08;
      h += Math.sin(x * 3.0 + 0.3) * Math.cos(y * 2.7 + 2.1) * 0.04;
      // A few craters
      const cx1 = -3, cy1 = -5, cr1 = 2;
      const d1 = Math.sqrt((x - cx1) ** 2 + (y - cy1) ** 2);
      if (d1 < cr1) h -= (cr1 - d1) * 0.15;

      const cx2 = 4, cy2 = 2, cr2 = 1.2;
      const d2 = Math.sqrt((x - cx2) ** 2 + (y - cy2) ** 2);
      if (d2 < cr2) h -= (cr2 - d2) * 0.12;

      posAttr.setZ(i, h);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x8a8a8a,
      metalness: 0.05,
      roughness: 0.95,
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Subtle boundary circle
    const ringGeo = new THREE.RingGeometry(6, 6.1, 64);
    this.groundRingMat = new THREE.MeshBasicMaterial({
      color: 0x6688aa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring = new THREE.Mesh(ringGeo, this.groundRingMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    this.scene.add(ring);
  }

  // === Earth with Atmosphere + Thrusters ===
  private buildEarth() {
    const loader = new THREE.TextureLoader();

    // Earth sphere — massive, right behind MOSS for dramatic backdrop
    const earthGeo = new THREE.SphereGeometry(35, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.7,
    });

    this.earth = new THREE.Mesh(earthGeo, earthMat);
    this.earth.position.set(8, 20, -50);
    this.earth.rotation.y = Math.PI * 0.3;
    this.scene.add(this.earth);

    // Load textures asynchronously
    loader.load(EARTH_TEXTURE, (tex) => {
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    });
    loader.load(EARTH_BUMP, (tex) => {
      earthMat.bumpMap = tex;
      earthMat.bumpScale = 0.5;
      earthMat.needsUpdate = true;
    });

    // Atmosphere glow — slightly larger sphere with Fresnel-like effect
    const atmoGeo = new THREE.SphereGeometry(36.5, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        glowColor: { value: new THREE.Color(0x4488ff) },
        coeff: { value: 0.3 },
        power: { value: 6.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float coeff;
        uniform float power;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() {
          float intensity = pow(coeff + dot(vNormal, vPositionNormal), power);
          gl_FragColor = vec4(glowColor, intensity * 0.3);
        }
      `,
    });
    this.earthAtmo = new THREE.Mesh(atmoGeo, atmoMat);
    this.earthAtmo.position.copy(this.earth.position);
    this.scene.add(this.earthAtmo);

    // Earth point light — blue light emanating from Earth
    const earthLight = new THREE.PointLight(0x3355aa, 0.8, 150);
    earthLight.position.copy(this.earth.position);
    this.scene.add(earthLight);

    // Thruster engines — particles streaming from bottom of Earth
    this.buildThrusters();
  }

  private buildThrusters() {
    const count = 150;
    const positions = new Float32Array(count * 3);
    this.thrusterVelocities = new Float32Array(count * 3);

    const earthPos = this.earth.position;

    for (let i = 0; i < count; i++) {
      // Spread thrusters along bottom hemisphere
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.random() * 4;
      positions[i * 3] = earthPos.x + Math.cos(angle) * spread;
      positions[i * 3 + 1] = earthPos.y - 12 - Math.random() * 15;
      positions[i * 3 + 2] = earthPos.z + Math.sin(angle) * spread;

      // Velocity: downward + slight outward
      this.thrusterVelocities[i * 3] = (Math.random() - 0.5) * 0.5;
      this.thrusterVelocities[i * 3 + 1] = -(1.0 + Math.random() * 2.0);
      this.thrusterVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x66aaff,
      size: 0.8,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.thrusterParticles = new THREE.Points(geo, mat);
    this.scene.add(this.thrusterParticles);

    // Thruster glow light
    const thrusterLight = new THREE.PointLight(0x4488ff, 1.5, 40);
    thrusterLight.position.set(earthPos.x, earthPos.y - 14, earthPos.z);
    this.scene.add(thrusterLight);
  }

  // === Ambient floating dust ===
  private setupAmbientParticles() {
    const count = 60;
    const positions = new Float32Array(count * 3);
    this.particleVelocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      this.particleVelocities[i * 3] = (Math.random() - 0.5) * 0.15;
      this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      this.particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x889999,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.ambientParticles = new THREE.Points(geo, mat);
    this.scene.add(this.ambientParticles);
  }

  // === Public effect methods ===

  triggerFlash(color: number = 0xffffff, intensity: number = 1.5, duration: number = 200) {
    this.flashLight.color.set(color);
    this.flashLight.intensity = intensity;
    const startTime = performance.now();
    const decay = () => {
      const t = (performance.now() - startTime) / duration;
      if (t >= 1) { this.flashLight.intensity = 0; return; }
      this.flashLight.intensity = intensity * (1 - t);
      requestAnimationFrame(decay);
    };
    requestAnimationFrame(decay);
  }

  pulseBloom(tier: number) {
    const targetStrength = tier === 3 ? 0.9 : tier === 2 ? 0.65 : 0.5;
    const originalStrength = 0.4;
    const duration = tier === 3 ? 350 : tier === 2 ? 250 : 150;
    const startTime = performance.now();
    const pulse = () => {
      const t = (performance.now() - startTime) / duration;
      if (t >= 1) { this.bloomPass.strength = originalStrength; return; }
      const curve = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
      this.bloomPass.strength = originalStrength + (targetStrength - originalStrength) * curve;
      requestAnimationFrame(pulse);
    };
    requestAnimationFrame(pulse);
  }

  private onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }

  render() {
    this.elapsed += 1 / 60;

    // Rotate Earth slowly
    if (this.earth) {
      this.earth.rotation.y += 0.0005;
    }

    // Atmosphere follows Earth
    if (this.earthAtmo && this.earth) {
      this.earthAtmo.rotation.copy(this.earth.rotation);
    }

    // Thruster particles animation
    if (this.thrusterParticles) {
      const pos = this.thrusterParticles.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const earthY = this.earth.position.y;

      for (let i = 0; i < arr.length / 3; i++) {
        arr[i * 3] += this.thrusterVelocities[i * 3] * 0.016;
        arr[i * 3 + 1] += this.thrusterVelocities[i * 3 + 1] * 0.016;
        arr[i * 3 + 2] += this.thrusterVelocities[i * 3 + 2] * 0.016;

        // Reset particles that drift too far
        if (arr[i * 3 + 1] < earthY - 30) {
          const angle = Math.random() * Math.PI * 2;
          const spread = Math.random() * 4;
          arr[i * 3] = this.earth.position.x + Math.cos(angle) * spread;
          arr[i * 3 + 1] = earthY - 12 - Math.random() * 3;
          arr[i * 3 + 2] = this.earth.position.z + Math.sin(angle) * spread;
        }
      }
      pos.needsUpdate = true;
    }

    // Ambient dust
    if (this.ambientParticles) {
      const pos = this.ambientParticles.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < arr.length / 3; i++) {
        arr[i * 3] += this.particleVelocities[i * 3] * 0.016;
        arr[i * 3 + 1] += this.particleVelocities[i * 3 + 1] * 0.016;
        arr[i * 3 + 2] += this.particleVelocities[i * 3 + 2] * 0.016;
        if (arr[i * 3] > 8) arr[i * 3] = -8;
        if (arr[i * 3] < -8) arr[i * 3] = 8;
        if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = 0;
        if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 5;
        if (arr[i * 3 + 2] > 8) arr[i * 3 + 2] = -8;
        if (arr[i * 3 + 2] < -8) arr[i * 3 + 2] = 8;
      }
      pos.needsUpdate = true;
    }

    // Ground ring pulse
    if (this.groundRingMat) {
      this.groundRingMat.opacity = 0.2 + Math.sin(this.elapsed * 1.5) * 0.1;
    }

    this.controls.update();
    this.composer.render();
  }
}
