import * as THREE from 'three';
import { tweenAsync, Easing, wait } from '../animation/Tween';
import { ParticleSystem } from '../animation/ParticleSystem';

export abstract class Character {
  group: THREE.Group;
  hp: number;
  maxHp: number;
  basePosition: THREE.Vector3;
  particles: ParticleSystem;
  protected bodyParts: THREE.Mesh[] = [];

  constructor(maxHp: number, position: THREE.Vector3, particleColor: number) {
    this.group = new THREE.Group();
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.basePosition = position.clone();
    this.group.position.copy(position);
    this.particles = new ParticleSystem(300, particleColor, 0.12);
    this.group.add(this.particles.mesh);
  }

  abstract buildModel(): void;

  updateIdle(dt: number, elapsed: number) {
    this.group.position.y = this.basePosition.y + Math.sin(elapsed * 2) * 0.05;
  }

  // 3-tier attack animation
  async playAttack(targetPos: THREE.Vector3, tier: number) {
    const startZ = this.basePosition.z;
    const targetZ = targetPos.z + (startZ > targetPos.z ? 1.5 : -1.5);

    // Tier affects speed and intensity
    const rushDuration = tier === 3 ? 0.15 : tier === 2 ? 0.22 : 0.3;

    // Wind-up for tier 3
    if (tier === 3) {
      await tweenAsync({
        from: 0,
        to: 1,
        duration: 0.2,
        easing: Easing.easeInQuad,
        onUpdate: t => {
          this.group.scale.setScalar(1 + t * 0.15);
        },
      });
    }

    // Rush forward
    await tweenAsync({
      from: startZ,
      to: targetZ,
      duration: rushDuration,
      easing: Easing.easeInOutCubic,
      onUpdate: v => { this.group.position.z = v; },
    });

    // Particles at impact point
    const particleCount = tier === 3 ? 60 : tier === 2 ? 35 : 15;
    const particleSpeed = tier === 3 ? 5 : tier === 2 ? 3 : 1.5;
    this.particles.emit(
      new THREE.Vector3(0, 1.5, targetZ - startZ),
      particleCount, particleSpeed, tier === 3 ? 1.0 : 0.6,
    );

    if (tier === 3) {
      // Ring burst for tier 3
      this.particles.emitRing(
        new THREE.Vector3(0, 1.5, targetZ - startZ),
        1.0, 30, 0.8,
      );
    }

    await wait(tier === 3 ? 150 : 100);

    // Return
    await tweenAsync({
      from: targetZ,
      to: startZ,
      duration: 0.35,
      easing: Easing.easeOutCubic,
      onUpdate: v => { this.group.position.z = v; },
    });

    // Reset scale
    if (tier === 3) {
      await tweenAsync({
        from: this.group.scale.x,
        to: 1,
        duration: 0.2,
        onUpdate: v => { this.group.scale.setScalar(v); },
      });
    }
  }

  // 3-tier hit reaction
  async playHit(tier: number) {
    // Clone materials so shared materials don't permanently change
    const originals: { mesh: THREE.Mesh; origMat: THREE.MeshStandardMaterial; emissive: THREE.Color }[] = [];
    for (const mesh of this.bodyParts) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat.emissive) {
        const cloned = mat.clone();
        mesh.material = cloned;
        originals.push({ mesh, origMat: mat, emissive: mat.emissive.clone() });
        cloned.emissive.set(0xffffff);
      }
    }

    const recoilDir = this.basePosition.z > 0 ? 1 : -1;
    const recoilDist = tier === 3 ? 0.8 : tier === 2 ? 0.5 : 0.2;
    const startZ = this.group.position.z;

    // Screen shake based on tier
    const app = document.getElementById('app')!;
    const shakeClass = tier === 3 ? 'screen-shake-heavy' : 'screen-shake';
    if (tier >= 2) {
      app.classList.add(shakeClass);
      setTimeout(() => app.classList.remove(shakeClass), tier === 3 ? 600 : 400);
    }

    const flashCount = tier === 3 ? 8 : tier === 2 ? 5 : 3;
    const duration = tier === 3 ? 0.5 : tier === 2 ? 0.35 : 0.2;

    await tweenAsync({
      from: 0,
      to: 1,
      duration,
      onUpdate: t => {
        this.group.position.z = startZ + recoilDist * recoilDir * Math.sin(t * Math.PI);
        const flash = Math.sin(t * Math.PI * flashCount) > 0;
        for (const { mesh, emissive } of originals) {
          (mesh.material as THREE.MeshStandardMaterial).emissive.copy(
            flash ? new THREE.Color(0xffffff) : emissive
          );
        }
      },
    });

    // Restore original materials (not the clones)
    for (const { mesh, origMat } of originals) {
      mesh.material = origMat;
    }
    this.group.position.z = startZ;
  }

  async playExecution() {
    await tweenAsync({
      from: 1,
      to: 1.5,
      duration: 0.5,
      easing: Easing.easeOutBack,
      onUpdate: v => { this.group.scale.setScalar(v); },
    });

    this.particles.emitRing(new THREE.Vector3(0, 1.5, 0), 1.5, 80, 2);

    await wait(800);

    await tweenAsync({
      from: 1.5,
      to: 1,
      duration: 0.4,
      easing: Easing.easeOutQuad,
      onUpdate: v => { this.group.scale.setScalar(v); },
    });
  }

  async playDeath() {
    const startY = this.group.position.y;
    await tweenAsync({
      from: 0,
      to: 1,
      duration: 1.2,
      easing: Easing.easeInQuad,
      onUpdate: t => {
        this.group.position.y = startY - t * 0.5;
        for (const mesh of this.bodyParts) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 1 - t * 0.6;
        }
      },
    });
  }

  takeDamage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);
  }

  resetState() {
    this.hp = this.maxHp;
    this.group.position.copy(this.basePosition);
    this.group.scale.setScalar(1);
    for (const mesh of this.bodyParts) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.transparent = false;
      mat.opacity = 1;
    }
  }

  get isAlive() {
    return this.hp > 0;
  }
}
