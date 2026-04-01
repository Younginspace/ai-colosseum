// Easing functions
export const Easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutBack: (t: number) => {
    const c = 1.70158;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  },
  easeOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
  },
};

export type EasingFn = (t: number) => number;

export interface TweenConfig {
  from: number;
  to: number;
  duration: number;
  easing?: EasingFn;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
  delay?: number;
}

export class Tween {
  private elapsed = 0;
  private config: Required<TweenConfig>;
  done = false;

  constructor(config: TweenConfig) {
    this.config = {
      easing: Easing.easeOutQuad,
      onComplete: () => {},
      delay: 0,
      ...config,
    };
  }

  update(dt: number) {
    if (this.done) return;
    this.elapsed += dt;

    const delayedElapsed = this.elapsed - this.config.delay;
    if (delayedElapsed < 0) return;

    const t = Math.min(delayedElapsed / this.config.duration, 1);
    const eased = this.config.easing(t);
    const value = this.config.from + (this.config.to - this.config.from) * eased;
    this.config.onUpdate(value);

    if (t >= 1) {
      this.done = true;
      this.config.onComplete();
    }
  }
}

// Global tween manager
class TweenManagerClass {
  private tweens: Tween[] = [];

  add(config: TweenConfig): Tween {
    const tween = new Tween(config);
    this.tweens.push(tween);
    return tween;
  }

  update(dt: number) {
    for (const t of this.tweens) {
      t.update(dt);
    }
    this.tweens = this.tweens.filter(t => !t.done);
  }

  clear() {
    this.tweens = [];
  }
}

export const TweenManager = new TweenManagerClass();

// Helper: return a promise that resolves when tween completes
export function tweenAsync(config: Omit<TweenConfig, 'onComplete'>): Promise<void> {
  return new Promise(resolve => {
    TweenManager.add({ ...config, onComplete: resolve });
  });
}

// Helper: wait ms
export function wait(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
