import * as THREE from 'three';
import { tweenAsync, Easing } from './Tween';

/**
 * A glowing energy sphere that travels from origin to target along an arc.
 * Used for verbal-battle ranged attacks.
 */
export class EnergyProjectile {
  private core: THREE.Mesh;
  private glow: THREE.Mesh;
  private light: THREE.PointLight;
  private scene: THREE.Object3D;

  constructor(scene: THREE.Object3D, color: number, size: number) {
    this.scene = scene;

    // Core sphere
    const coreGeo = new THREE.SphereGeometry(size, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 3,
      metalness: 0,
      roughness: 0.2,
    });
    this.core = new THREE.Mesh(coreGeo, coreMat);

    // Glow halo
    const glowGeo = new THREE.SphereGeometry(size * 2.5, 16, 16);
    const glowMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    this.glow = new THREE.Mesh(glowGeo, glowMat);

    // Point light
    this.light = new THREE.PointLight(color, 3, 10);

    this.core.add(this.glow);
    this.core.add(this.light);
  }

  /**
   * Fire from origin to target along a parabolic arc.
   */
  async fire(
    from: THREE.Vector3,
    to: THREE.Vector3,
    duration: number,
    arcHeight: number,
  ): Promise<void> {
    this.core.position.copy(from);
    this.scene.add(this.core);

    await tweenAsync({
      from: 0,
      to: 1,
      duration,
      easing: Easing.easeInOutQuad,
      onUpdate: (t) => {
        // Linear interpolation for X/Z
        this.core.position.x = from.x + (to.x - from.x) * t;
        this.core.position.z = from.z + (to.z - from.z) * t;
        // Y: linear lerp + parabolic arc
        const baseY = from.y + (to.y - from.y) * t;
        this.core.position.y = baseY + arcHeight * 4 * t * (1 - t);

        // Pulse glow during travel
        const glowMat = this.glow.material as THREE.MeshStandardMaterial;
        glowMat.opacity = 0.2 + Math.sin(t * Math.PI * 6) * 0.1;

        // Fade light near end
        this.light.intensity = 3 * (1 - t * 0.5);
      },
    });

    this.dispose();
  }

  dispose() {
    this.scene.remove(this.core);
    this.core.geometry.dispose();
    (this.core.material as THREE.Material).dispose();
    this.glow.geometry.dispose();
    (this.glow.material as THREE.Material).dispose();
  }
}
