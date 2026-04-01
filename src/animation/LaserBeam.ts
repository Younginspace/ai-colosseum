import * as THREE from 'three';
import { tweenAsync, Easing } from './Tween';

/**
 * A red laser beam that shoots between two world-space points.
 * Thickness and duration scale with damage tier.
 */
export class LaserBeam {
  private beam: THREE.Mesh;
  private glow: THREE.Mesh;
  private impactLight: THREE.PointLight;
  private originLight: THREE.PointLight;
  private scene: THREE.Object3D;

  constructor(scene: THREE.Object3D, color: number = 0xff1111) {
    this.scene = scene;

    // Derive glow color (slightly shifted)
    const glowColor = color;

    // Core beam — bright cylinder
    const beamGeo = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.beam = new THREE.Mesh(beamGeo, beamMat);

    // Outer glow — softer, wider, more transparent
    const glowGeo = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true);
    const glowMat = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.glow = new THREE.Mesh(glowGeo, glowMat);

    // Impact light at target
    this.impactLight = new THREE.PointLight(color, 0, 8);
    // Origin light at source
    this.originLight = new THREE.PointLight(color, 0, 6);
  }

  /**
   * Fire laser from origin to target.
   * @param from  World-space start point (MOSS eye)
   * @param to    World-space end point (player)
   * @param tier  1/2/3 — controls thickness and duration
   */
  async fire(from: THREE.Vector3, to: THREE.Vector3, tier: number): Promise<void> {
    // Beam parameters based on tier
    const coreRadius = tier === 3 ? 0.12 : tier === 2 ? 0.06 : 0.03;
    const glowRadius = coreRadius * 3;
    const holdDuration = tier === 3 ? 0.6 : tier === 2 ? 0.35 : 0.2;
    const fadeDuration = 0.15;

    // Compute beam orientation
    const direction = new THREE.Vector3().subVectors(to, from);
    const length = direction.length();
    const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);

    // Orient cylinder from origin to target
    // Default cylinder is along Y axis, we need to rotate it
    const orientation = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);
    const axis = new THREE.Vector3().crossVectors(up, direction.clone().normalize()).normalize();
    const angle = Math.acos(up.dot(direction.clone().normalize()));

    const quaternion = new THREE.Quaternion();
    if (axis.length() > 0.001) {
      quaternion.setFromAxisAngle(axis, angle);
    }

    // Setup beam transform
    const setupMesh = (mesh: THREE.Mesh, radius: number) => {
      mesh.position.copy(midpoint);
      mesh.quaternion.copy(quaternion);
      mesh.scale.set(radius, length, radius);
    };

    setupMesh(this.beam, 0.001); // start invisible
    setupMesh(this.glow, 0.001);

    // Lights
    this.impactLight.position.copy(to);
    this.originLight.position.copy(from);

    this.scene.add(this.beam);
    this.scene.add(this.glow);
    this.scene.add(this.impactLight);
    this.scene.add(this.originLight);

    // === Phase 1: Beam appears (thin → full thickness) ===
    await tweenAsync({
      from: 0,
      to: 1,
      duration: 0.08,
      easing: Easing.easeOutQuad,
      onUpdate: t => {
        const r = coreRadius * t;
        const gr = glowRadius * t;
        this.beam.scale.set(r, length, r);
        this.glow.scale.set(gr, length, gr);
        this.impactLight.intensity = 4 * t * (tier === 3 ? 2 : 1);
        this.originLight.intensity = 3 * t;
      },
    });

    // Continuous sparks during hold
    let lastSparkTime = 0;
    const sparkInterval = tier === 3 ? 0.08 : 0.15;

    // === Phase 2: Hold — beam pulses slightly ===
    await tweenAsync({
      from: 0,
      to: 1,
      duration: holdDuration,
      onUpdate: t => {
        // Emit sparks at impact point periodically
        lastSparkTime += 1 / 60;
        if (lastSparkTime > sparkInterval) {
          lastSparkTime = 0;
          this.emitSparks(to, Math.max(1, tier - 1));
        }
        // Subtle pulse
        const pulse = 1 + Math.sin(t * Math.PI * 8) * 0.15;
        this.beam.scale.set(coreRadius * pulse, length, coreRadius * pulse);
        this.glow.scale.set(glowRadius * pulse, length, glowRadius * pulse);

        // Flicker opacity
        const beamMat = this.beam.material as THREE.MeshBasicMaterial;
        beamMat.opacity = 0.8 + Math.sin(t * Math.PI * 12) * 0.15;
        const glowMat = this.glow.material as THREE.MeshBasicMaterial;
        glowMat.opacity = 0.25 + Math.sin(t * Math.PI * 8) * 0.1;

        // Impact light flicker
        this.impactLight.intensity = (tier === 3 ? 6 : 3) + Math.sin(t * Math.PI * 10) * 1.5;
      },
    });

    // === Phase 3: Beam fades (full → thin) ===
    await tweenAsync({
      from: 1,
      to: 0,
      duration: fadeDuration,
      easing: Easing.easeInQuad,
      onUpdate: t => {
        const r = coreRadius * t;
        const gr = glowRadius * t;
        this.beam.scale.set(Math.max(r, 0.001), length, Math.max(r, 0.001));
        this.glow.scale.set(Math.max(gr, 0.001), length, Math.max(gr, 0.001));
        this.impactLight.intensity = 4 * t;
        this.originLight.intensity = 3 * t;
        const beamMat = this.beam.material as THREE.MeshBasicMaterial;
        beamMat.opacity = 0.9 * t;
      },
    });

    // === Impact sparks at target ===
    this.emitSparks(to, tier);

    this.dispose();
  }

  /**
   * Emit sparks/embers at the impact point
   */
  private emitSparks(pos: THREE.Vector3, tier: number) {
    const count = tier === 3 ? 40 : tier === 2 ? 20 : 10;
    const sparkGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 4,
      ));
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const sparkMat = new THREE.PointsMaterial({
      color: this.impactLight.color,
      size: tier === 3 ? 0.08 : 0.05,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sparks = new THREE.Points(sparkGeo, sparkMat);
    this.scene.add(sparks);

    // Animate sparks with gravity
    const duration = 0.6;
    const startTime = performance.now();
    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      if (elapsed > duration) {
        this.scene.remove(sparks);
        sparkGeo.dispose();
        sparkMat.dispose();
        return;
      }
      const t = elapsed / duration;
      const arr = sparkGeo.attributes.position.array as Float32Array;
      const dt = 0.016;
      for (let i = 0; i < count; i++) {
        const v = velocities[i];
        arr[i * 3] += v.x * dt;
        arr[i * 3 + 1] += v.y * dt;
        arr[i * 3 + 2] += v.z * dt;
        v.y -= 9.8 * dt; // gravity
        v.multiplyScalar(0.97); // drag
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparkMat.opacity = 1 - t;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  dispose() {
    this.scene.remove(this.beam);
    this.scene.remove(this.glow);
    this.scene.remove(this.impactLight);
    this.scene.remove(this.originLight);
    this.beam.geometry.dispose();
    (this.beam.material as THREE.Material).dispose();
    this.glow.geometry.dispose();
    (this.glow.material as THREE.Material).dispose();
  }
}
