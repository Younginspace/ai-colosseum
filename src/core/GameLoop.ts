type UpdateCallback = (dt: number, elapsed: number) => void;

export class GameLoop {
  private callbacks: UpdateCallback[] = [];
  private lastTime = 0;
  private elapsed = 0;
  private running = false;

  onUpdate(cb: UpdateCallback) {
    this.callbacks.push(cb);
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.tick();
  }

  stop() {
    this.running = false;
  }

  private tick = () => {
    if (!this.running) return;
    requestAnimationFrame(this.tick);

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1); // cap at 100ms
    this.lastTime = now;
    this.elapsed += dt;

    for (const cb of this.callbacks) {
      cb(dt, this.elapsed);
    }
  };
}
