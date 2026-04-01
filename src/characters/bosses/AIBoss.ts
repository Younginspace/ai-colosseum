import { Character } from '../Character';
import * as THREE from 'three';

export interface BossConfig {
  name: string;
  subtitle: string;
  hp: number;
}

export abstract class AIBoss extends Character {
  config: BossConfig;

  constructor(config: BossConfig, position: THREE.Vector3, particleColor: number) {
    super(config.hp, position, particleColor);
    this.config = config;
  }
}
