import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { Character } from './Character';
import { tweenAsync, Easing, wait } from '../animation/Tween';

export class Player extends Character {
  private helmetMesh: THREE.Mesh | null = null;
  public modelReady: Promise<void>;

  constructor() {
    super(10, new THREE.Vector3(-2.5, 0.75, 3), 0x4488ff);
    this.modelReady = this.buildModelAsync();
  }

  buildModel() {}

  private buildModelAsync(): Promise<void> {
    return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load('/models/astronaut.glb', (gltf) => {
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.0 / maxDim;
      model.scale.setScalar(scale);

      const scaledBox = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      scaledBox.getCenter(center);
      model.position.sub(center);
      model.position.y -= scaledBox.min.y;

      model.castShadow = true;

      let highestY = -Infinity;
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          this.bodyParts.push(mesh);

          const meshBox = new THREE.Box3().setFromObject(mesh);
          const meshCenter = new THREE.Vector3();
          meshBox.getCenter(meshCenter);
          if (meshCenter.y > highestY) {
            highestY = meshCenter.y;
            this.helmetMesh = mesh;
          }
        }
      });

      this.group.add(model);
      resolve();
    }, undefined, () => resolve());

    this.group.rotation.y = Math.PI * 0.85;
    this.group.scale.setScalar(0.85);
    });
  }

  updateIdle(dt: number, elapsed: number) {
    this.group.position.y = this.basePosition.y + Math.sin(elapsed * 1.5) * 0.008;
  }

  // ========== ATTACK: Lean forward (speaking), no projectile ==========
  // The "damage" is expressed as MOSS glitching — handled in MOSS.playHit
  async playAttack(_targetPos: THREE.Vector3, tier: number) {
    const leanAngle = tier === 3 ? 0.15 : tier === 2 ? 0.1 : 0.06;
    const holdDuration = tier === 3 ? 0.4 : tier === 2 ? 0.3 : 0.2;

    // Lean forward — speaking posture
    await tweenAsync({
      from: 0,
      to: leanAngle,
      duration: 0.2,
      easing: Easing.easeInQuad,
      onUpdate: v => { this.group.rotation.x = v; },
    });

    // Hold the lean (words hitting MOSS)
    await wait(holdDuration * 1000);

    // Lean back
    await tweenAsync({
      from: this.group.rotation.x,
      to: 0,
      duration: 0.25,
      easing: Easing.easeOutCubic,
      onUpdate: v => { this.group.rotation.x = v; },
    });
  }

  // ========== HIT: Lean back + helmet glow red ==========
  async playHit(tier: number) {
    const leanBack = tier === 3 ? -0.12 : tier === 2 ? -0.08 : -0.04;
    const duration = tier === 3 ? 0.5 : tier === 2 ? 0.35 : 0.2;

    if (tier >= 2) {
      const app = document.getElementById('app')!;
      const cls = tier === 3 ? 'screen-shake-heavy' : 'screen-shake';
      app.classList.add(cls);
      setTimeout(() => app.classList.remove(cls), tier === 3 ? 600 : 400);
    }

    const promises: Promise<void>[] = [];

    // Lean back then return
    promises.push((async () => {
      await tweenAsync({
        from: 0,
        to: leanBack,
        duration: duration * 0.4,
        easing: Easing.easeOutQuad,
        onUpdate: v => { this.group.rotation.x = v; },
      });
      await tweenAsync({
        from: leanBack,
        to: 0,
        duration: duration * 0.6,
        easing: Easing.easeOutCubic,
        onUpdate: v => { this.group.rotation.x = v; },
      });
    })());

    // Helmet glow red
    if (this.helmetMesh) {
      const origMat = this.helmetMesh.material as THREE.MeshStandardMaterial;
      const cloned = origMat.clone();
      cloned.emissive = new THREE.Color(0xff2200);
      this.helmetMesh.material = cloned;
      const peakIntensity = tier === 3 ? 2.0 : tier === 2 ? 1.2 : 0.6;

      promises.push((async () => {
        await tweenAsync({
          from: 0, to: peakIntensity,
          duration: duration * 0.3,
          easing: Easing.easeOutQuad,
          onUpdate: v => { cloned.emissiveIntensity = v; },
        });
        await tweenAsync({
          from: peakIntensity, to: 0,
          duration: duration * 0.7,
          easing: Easing.easeOutCubic,
          onUpdate: v => { cloned.emissiveIntensity = v; },
        });
        this.helmetMesh!.material = origMat;
      })());
    }

    await Promise.all(promises);
  }
}
