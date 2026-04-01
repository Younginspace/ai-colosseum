import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { AIBoss } from './AIBoss';
import { tweenAsync, Easing, wait } from '../../animation/Tween';
import { LaserBeam } from '../../animation/LaserBeam';
import { ElectricArc } from '../../animation/ElectricArc';

/**
 * MOSS Terminal — loaded from STL model (The Wandering Earth style)
 * Front + back shells combined, with red glowing eye overlay
 */
export class MOSS extends AIBoss {
  private coreEye!: THREE.Mesh;
  private glowSphere!: THREE.Mesh;
  private eyeLight!: THREE.PointLight;
  private modelParts: THREE.Mesh[] = [];
  public modelReady: Promise<void>;

  constructor() {
    super(
      { name: 'MOSS', subtitle: '全数字智能体 · 领航员号', hp: 10 },
      // Upper-right position (Pokémon boss side)
      new THREE.Vector3(3, 4.5, -5),
      0xff3333,
    );
    this.modelReady = this.buildModelAsync();
  }

  buildModel() {}

  private buildModelAsync(): Promise<void> {
    return new Promise((resolve) => {
    const loader = new STLLoader();
    let loaded = 0;
    const checkDone = () => { if (++loaded >= 2) resolve(); };

    // Material for the MOSS body — light gray metallic (matching the reference image)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.5,
      roughness: 0.4,
    });

    // Helper: apply rotation + scale + center to STL geometry directly
    const prepareGeometry = (geometry: THREE.BufferGeometry) => {
      geometry.computeVertexNormals();
      // STL Z-up → Y-up
      geometry.rotateX(-Math.PI / 2);
      // Rotate front panel (with eye) toward camera/player
      geometry.rotateY(1.22);
      // Slight forward tilt for menacing surveillance angle
      geometry.rotateX(0.1);
      geometry.center();
      geometry.computeBoundingBox();
      const size = new THREE.Vector3();
      geometry.boundingBox!.getSize(size);
      return Math.max(size.x, size.y, size.z);
    };

    // Load front shell (the face with the red eye lens)
    loader.load('/models/moss-front.stl', (geometry) => {
      const maxDim = prepareGeometry(geometry);
      const scale = 7.5 / maxDim;

      const mesh = new THREE.Mesh(geometry, bodyMat);
      mesh.scale.setScalar(scale);
      mesh.castShadow = true;
      this.group.add(mesh);
      this.bodyParts.push(mesh);
      this.modelParts.push(mesh);

      const scaledBox = new THREE.Box3().setFromObject(mesh);
      const center = new THREE.Vector3();
      scaledBox.getCenter(center);
      const size = new THREE.Vector3();
      scaledBox.getSize(size);
      const localCenter = new THREE.Vector3();
      scaledBox.getCenter(localCenter);
      localCenter.sub(this.group.position);
      this.coreEye.position.set(
        localCenter.x - size.x * 0.08,
        localCenter.y + size.y * 0.22,
        localCenter.z + size.z * 0.4,
      );
      this.glowSphere.position.copy(this.coreEye.position);
      this.eyeLight.position.copy(this.coreEye.position);
      checkDone();
    });

    // Load back shell with same transform
    loader.load('/models/moss-back.stl', (geometry) => {
      const maxDim = prepareGeometry(geometry);
      const scale = 7.5 / maxDim;
      const mesh = new THREE.Mesh(geometry, bodyMat);
      mesh.scale.setScalar(scale);
      mesh.castShadow = true;
      this.group.add(mesh);
      this.bodyParts.push(mesh);
      this.modelParts.push(mesh);
      checkDone();
    });

    // Red eye core — sized to fit in the model's circular lens socket
    const eyeGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xff1111,
      emissive: 0xff0000,
      emissiveIntensity: 2.5,
      metalness: 0.0,
      roughness: 0.3,
    });
    this.coreEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.coreEye.position.set(0, 0.1, 0.3);
    this.group.add(this.coreEye);
    this.bodyParts.push(this.coreEye);

    // Glow around eye
    const glowGeo = new THREE.SphereGeometry(0.22, 32, 32);
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0xff2200,
      emissive: 0xff2200,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.2,
    });
    this.glowSphere = new THREE.Mesh(glowGeo, glowMat);
    this.glowSphere.position.copy(this.coreEye.position);
    this.group.add(this.glowSphere);

    // Eye point light
    this.eyeLight = new THREE.PointLight(0xff2200, 2.0, 8);
    this.eyeLight.position.copy(this.coreEye.position);
    this.group.add(this.eyeLight);
    });
  }

  // ========== ATTACK: Eye charge-up → energy pulse ==========
  async playAttack(targetPos: THREE.Vector3, tier: number) {
    if (!this.coreEye) return;

    const eyeMat = this.coreEye.material as THREE.MeshStandardMaterial;
    const glowMat = this.glowSphere.material as THREE.MeshStandardMaterial;

    const targetIntensity = tier === 3 ? 8 : tier === 2 ? 5 : 3.5;
    const targetGlowScale = tier === 3 ? 3.0 : tier === 2 ? 2.0 : 1.5;
    const chargeDuration = tier === 3 ? 0.5 : tier === 2 ? 0.35 : 0.25;

    // --- Charge-up: eye intensifies ---
    const chargePromises: Promise<void>[] = [];

    chargePromises.push(tweenAsync({
      from: eyeMat.emissiveIntensity,
      to: targetIntensity,
      duration: chargeDuration,
      easing: Easing.easeInQuad,
      onUpdate: v => { eyeMat.emissiveIntensity = v; },
    }));

    chargePromises.push(tweenAsync({
      from: 1,
      to: targetGlowScale,
      duration: chargeDuration,
      easing: Easing.easeInQuad,
      onUpdate: v => { this.glowSphere.scale.setScalar(v); },
    }));

    chargePromises.push(tweenAsync({
      from: glowMat.opacity,
      to: 0.5,
      duration: chargeDuration,
      onUpdate: v => { glowMat.opacity = v; },
    }));

    chargePromises.push(tweenAsync({
      from: this.eyeLight.intensity,
      to: tier === 3 ? 6 : tier === 2 ? 4 : 2.5,
      duration: chargeDuration,
      onUpdate: v => { this.eyeLight.intensity = v; },
    }));

    // Tier 3: lean forward menacingly
    if (tier === 3) {
      chargePromises.push(tweenAsync({
        from: 0,
        to: 0.12,
        duration: chargeDuration,
        easing: Easing.easeInQuad,
        onUpdate: v => { this.group.rotation.x = v; },
      }));
    }

    await Promise.all(chargePromises);

    // --- Fire laser beam ---
    const eyeWorldPos = new THREE.Vector3();
    this.coreEye.getWorldPosition(eyeWorldPos);

    const scene = this.group.parent!;
    const laser = new LaserBeam(scene, 0xff2200);

    // Tier 3: screen shake on fire
    if (tier >= 2) {
      const app = document.getElementById('app')!;
      const cls = tier === 3 ? 'screen-shake-heavy' : 'screen-shake';
      app.classList.add(cls);
      setTimeout(() => app.classList.remove(cls), tier === 3 ? 500 : 300);
    }

    // Emit particles from eye on fire
    this.particles.emit(
      new THREE.Vector3(0, this.coreEye.position.y, this.coreEye.position.z),
      tier === 3 ? 30 : 15,
      tier === 3 ? 3 : 1.5,
      0.5,
    );

    const targetWorld = targetPos.clone();
    targetWorld.y += 0.9; // aim at heart

    await laser.fire(eyeWorldPos, targetWorld, tier);

    // --- Settle back to idle ---
    const settlePromises: Promise<void>[] = [];

    settlePromises.push(tweenAsync({
      from: eyeMat.emissiveIntensity,
      to: 2.5,
      duration: 0.25,
      onUpdate: v => { eyeMat.emissiveIntensity = v; },
    }));

    settlePromises.push(tweenAsync({
      from: this.glowSphere.scale.x,
      to: 1,
      duration: 0.25,
      onUpdate: v => { this.glowSphere.scale.setScalar(v); },
    }));

    settlePromises.push(tweenAsync({
      from: glowMat.opacity,
      to: 0.2,
      duration: 0.25,
      onUpdate: v => { glowMat.opacity = v; },
    }));

    settlePromises.push(tweenAsync({
      from: this.eyeLight.intensity,
      to: 2.0,
      duration: 0.25,
      onUpdate: v => { this.eyeLight.intensity = v; },
    }));

    if (tier === 3) {
      settlePromises.push(tweenAsync({
        from: this.group.rotation.x,
        to: 0,
        duration: 0.3,
        easing: Easing.easeOutCubic,
        onUpdate: v => { this.group.rotation.x = v; },
      }));
    }

    await Promise.all(settlePromises);
  }

  // ========== HIT: Electric arc glitch + eye flicker + body shake ==========
  async playHit(tier: number) {
    if (!this.coreEye) return;

    const eyeMat = this.coreEye.material as THREE.MeshStandardMaterial;
    const flickerCount = tier === 3 ? 8 : tier === 2 ? 5 : 3;
    const duration = tier === 3 ? 0.8 : tier === 2 ? 0.5 : 0.3;
    const shakeAmp = tier === 3 ? 0.3 : tier === 2 ? 0.15 : 0.06;
    const startX = this.group.position.x;

    // Screen shake for tier >= 2
    if (tier >= 2) {
      const app = document.getElementById('app')!;
      const cls = tier === 3 ? 'screen-shake-heavy' : 'screen-shake';
      app.classList.add(cls);
      setTimeout(() => app.classList.remove(cls), tier === 3 ? 600 : 400);
    }

    // Spawn electric arcs on MOSS body (non-blocking)
    const scene = this.group.parent;
    if (scene) {
      const mossWorldPos = new THREE.Vector3();
      this.group.getWorldPosition(mossWorldPos);
      mossWorldPos.y += 2; // center of body
      const arcSpread = tier === 3 ? 2.5 : tier === 2 ? 1.8 : 1.2;
      const arcDuration = duration * 1000 + 200; // slightly longer than shake
      const arcs = new ElectricArc(scene);
      arcs.spawn(mossWorldPos, arcSpread, tier, arcDuration);
    }

    // Tier 3: eye goes dark briefly
    if (tier === 3) {
      eyeMat.emissiveIntensity = 0;
      this.eyeLight.intensity = 0;
      const glowMat = this.glowSphere.material as THREE.MeshStandardMaterial;
      glowMat.opacity = 0;
      await wait(250);
    }

    // Eye flicker + body shake
    await tweenAsync({
      from: 0,
      to: 1,
      duration,
      onUpdate: t => {
        // Eye flicker — rapid on/off
        const flicker = Math.sin(t * Math.PI * flickerCount * 2) > 0;
        eyeMat.emissiveIntensity = flicker ? 2.5 : 0.2;
        this.eyeLight.intensity = flicker ? 2.0 : 0.1;

        // Body shake — X axis with decay
        this.group.position.x = startX + Math.sin(t * Math.PI * flickerCount * 2) * shakeAmp * (1 - t * 0.5);

        // Slight Y jitter for glitch feel
        this.group.position.y = this.basePosition.y + (Math.random() - 0.5) * shakeAmp * 0.3 * (1 - t);
      },
    });

    // Reset to idle
    eyeMat.emissiveIntensity = 2.5;
    this.eyeLight.intensity = 2.0;
    const glowMat = this.glowSphere.material as THREE.MeshStandardMaterial;
    glowMat.opacity = 0.2;
    this.group.position.x = startX;
    this.group.position.y = this.basePosition.y;
  }

  updateIdle(dt: number, elapsed: number) {
    // Gentle float
    this.group.position.y = this.basePosition.y + Math.sin(elapsed * 1.2) * 0.06;
    // Subtle rotation
    this.group.rotation.y = Math.sin(elapsed * 0.3) * 0.05;

    // Eye pulse
    if (this.coreEye) {
      const eyeMat = this.coreEye.material as THREE.MeshStandardMaterial;
      eyeMat.emissiveIntensity = 1.8 + Math.sin(elapsed * 3) * 0.7;
    }

    // Glow pulse
    if (this.glowSphere) {
      const glowMat = this.glowSphere.material as THREE.MeshStandardMaterial;
      glowMat.opacity = 0.15 + Math.sin(elapsed * 3) * 0.08;
      this.glowSphere.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.08);
    }

    // Eye light pulse
    if (this.eyeLight) {
      this.eyeLight.intensity = 1.5 + Math.sin(elapsed * 3) * 0.5;
    }
  }
}
