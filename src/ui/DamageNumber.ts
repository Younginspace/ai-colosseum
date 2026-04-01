export class DamageNumber {
  private container: HTMLElement;

  constructor() {
    this.container = document.getElementById('damage-numbers')!;
  }

  // Show floating damage number at a screen position
  show(damage: number, side: 'player' | 'boss') {
    const el = document.createElement('div');
    el.className = `damage-num tier${damage}`;
    el.textContent = `-${damage}`;

    // Position based on which side is hit
    if (side === 'player') {
      el.style.left = '40%';
      el.style.top = '55%';
    } else {
      el.style.left = '55%';
      el.style.top = '40%';
    }

    this.container.appendChild(el);

    // Remove after animation
    setTimeout(() => el.remove(), 1200);
  }
}
