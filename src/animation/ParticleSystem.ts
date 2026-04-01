import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  mesh: THREE.Points;
  private maxParticles: number;

  constructor(maxParticles: number, color: number, size = 0.15) {
    this.maxParticles = maxParticles;
    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
  }

  emit(origin: THREE.Vector3, count: number, speed = 2, life = 1) {
    for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed,
      );
      this.particles.push({
        position: origin.clone(),
        velocity,
        life,
        maxLife: life,
        size: 0.1 + Math.random() * 0.15,
      });
    }
  }

  // Emit in a ring pattern
  emitRing(center: THREE.Vector3, radius: number, count: number, life = 1.5) {
    for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
      const angle = (i / count) * Math.PI * 2;
      const pos = center.clone().add(
        new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      );
      const velocity = new THREE.Vector3(
        Math.cos(angle) * 0.5,
        Math.random() * 1.5,
        Math.sin(angle) * 0.5,
      );
      this.particles.push({
        position: pos,
        velocity,
        life,
        maxLife: life,
        size: 0.08 + Math.random() * 0.1,
      });
    }
  }

  update(dt: number) {
    const positions = this.geometry.attributes.position.array as Float32Array;
    const sizes = this.geometry.attributes.size.array as Float32Array;

    // Update existing
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.position.add(p.velocity.clone().multiplyScalar(dt));
      p.velocity.y -= dt * 1.5; // gravity
      p.velocity.multiplyScalar(0.98); // drag
    }

    // Write to buffer
    for (let i = 0; i < this.maxParticles; i++) {
      if (i < this.particles.length) {
        const p = this.particles[i];
        positions[i * 3] = p.position.x;
        positions[i * 3 + 1] = p.position.y;
        positions[i * 3 + 2] = p.position.z;
        sizes[i] = p.size * (p.life / p.maxLife);
      } else {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = -100; // hide unused
        positions[i * 3 + 2] = 0;
        sizes[i] = 0;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.material.opacity = 0.8;
  }

  clear() {
    this.particles = [];
  }
}
