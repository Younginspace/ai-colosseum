import * as THREE from 'three';

/**
 * Creates jagged electric arcs / lightning bolts on an object's surface.
 * Used to show MOSS glitching from player's verbal attack.
 */
export class ElectricArc {
  private arcs: THREE.Line[] = [];
  private scene: THREE.Object3D;

  constructor(scene: THREE.Object3D) {
    this.scene = scene;
  }

  /**
   * Spawn electric arcs around a position for a duration.
   * @param center World-space center of the effect
   * @param spread How far arcs extend from center
   * @param tier   1/2/3 — controls arc count, brightness, refresh rate
   */
  spawn(center: THREE.Vector3, spread: number, tier: number, durationMs: number) {
    const arcCount = tier === 3 ? 6 : tier === 2 ? 4 : 2;
    const refreshRate = tier === 3 ? 50 : tier === 2 ? 80 : 120; // ms between regenerations
    const color = tier === 3 ? 0x88ccff : tier === 2 ? 0x6699dd : 0x4477aa;

    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create initial arcs
    for (let i = 0; i < arcCount; i++) {
      const line = this.createArc(center, spread, material);
      this.arcs.push(line);
      this.scene.add(line);
    }

    // Regenerate arcs periodically for jittery lightning look
    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      if (elapsed > durationMs) {
        clearInterval(interval);
        this.dispose();
        return;
      }

      // Fade out near end
      const remaining = 1 - elapsed / durationMs;
      material.opacity = remaining * 0.9;

      // Regenerate arc paths
      for (const arc of this.arcs) {
        const points = this.generateLightningPath(center, spread);
        arc.geometry.dispose();
        arc.geometry = new THREE.BufferGeometry().setFromPoints(points);
      }
    }, refreshRate);
  }

  private createArc(center: THREE.Vector3, spread: number, material: THREE.LineBasicMaterial): THREE.Line {
    const points = this.generateLightningPath(center, spread);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Line(geometry, material);
  }

  private generateLightningPath(center: THREE.Vector3, spread: number): THREE.Vector3[] {
    const segments = 6 + Math.floor(Math.random() * 4);
    const points: THREE.Vector3[] = [];

    // Random start and end on the surface
    const startOffset = new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 1.5,
      (Math.random() - 0.5) * spread,
    );
    const endOffset = new THREE.Vector3(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 1.5,
      (Math.random() - 0.5) * spread,
    );

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const base = new THREE.Vector3().lerpVectors(startOffset, endOffset, t);

      // Add jagged offset (more in the middle, less at endpoints)
      const jitter = Math.sin(t * Math.PI) * spread * 0.3;
      base.x += (Math.random() - 0.5) * jitter;
      base.y += (Math.random() - 0.5) * jitter;
      base.z += (Math.random() - 0.5) * jitter;

      points.push(center.clone().add(base));
    }

    return points;
  }

  dispose() {
    for (const arc of this.arcs) {
      this.scene.remove(arc);
      arc.geometry.dispose();
      (arc.material as THREE.Material).dispose();
    }
    this.arcs = [];
  }
}
