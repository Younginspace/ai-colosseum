export class BattleStatus {
  private container: HTMLElement;
  private textEl: HTMLElement;
  private hideTimer: number | null = null;

  constructor() {
    this.container = document.getElementById('battle-status')!;
    this.textEl = document.getElementById('status-text')!;
  }

  show(text: string, color = '#fff', duration = 1500) {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.textEl.textContent = text;
    this.textEl.style.color = color;
    this.container.classList.remove('hidden');
    this.container.classList.remove('banner-mode');
    // Re-trigger animation
    this.container.style.animation = 'none';
    this.container.offsetHeight;
    this.container.style.animation = '';

    if (duration > 0) {
      this.hideTimer = window.setTimeout(() => this.hide(), duration);
    }
  }

  showBanner(text: string, color = '#fff', duration = 1500) {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.textEl.textContent = text;
    this.textEl.style.color = color;
    this.container.classList.remove('hidden');
    this.container.classList.add('banner-mode');
    // Re-trigger animation
    this.container.style.animation = 'none';
    this.container.offsetHeight;
    this.container.style.animation = '';

    if (duration > 0) {
      this.hideTimer = window.setTimeout(() => this.hide(), duration);
    }
  }

  hide() {
    this.container.classList.add('hidden');
    this.container.classList.remove('banner-mode');
  }
}
