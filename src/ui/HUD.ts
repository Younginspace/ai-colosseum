export class HUD {
  private hudEl: HTMLElement;
  private playerSegments: HTMLElement;
  private bossSegments: HTMLElement;
  private playerHpText: HTMLElement;
  private bossHpText: HTMLElement;
  private bossNameEl: HTMLElement;
  private playerContainer: HTMLElement;
  private bossContainer: HTMLElement;
  private roundIndicator: HTMLElement;
  private roundText: HTMLElement;
  private prevPlayerHp = -1;
  private prevBossHp = -1;

  constructor() {
    this.hudEl = document.getElementById('hud')!;
    this.playerSegments = document.getElementById('player-hp-segments')!;
    this.bossSegments = document.getElementById('boss-hp-segments')!;
    this.playerHpText = document.getElementById('player-hp-text')!;
    this.bossHpText = document.getElementById('boss-hp-text')!;
    this.bossNameEl = document.getElementById('boss-name')!;
    this.playerContainer = this.playerSegments.closest('.hp-bar-container')!;
    this.bossContainer = this.bossSegments.closest('.hp-bar-container')!;
    this.roundIndicator = document.getElementById('round-indicator')!;
    this.roundText = document.getElementById('round-text')!;
  }

  show() {
    this.hudEl.classList.add('visible');
  }

  hide() {
    this.hudEl.classList.remove('visible');
  }

  setBossName(name: string) {
    this.bossNameEl.textContent = name;
  }

  initSegments(maxHp: number) {
    this.playerSegments.innerHTML = '';
    this.bossSegments.innerHTML = '';
    this.prevPlayerHp = maxHp;
    this.prevBossHp = maxHp;
    for (let i = 0; i < maxHp; i++) {
      const pSeg = document.createElement('div');
      pSeg.className = 'hp-seg';
      this.playerSegments.appendChild(pSeg);

      const bSeg = document.createElement('div');
      bSeg.className = 'hp-seg';
      this.bossSegments.appendChild(bSeg);
    }
  }

  updateHP(playerHp: number, playerMax: number, bossHp: number, bossMax: number) {
    this.playerHpText.textContent = `${playerHp} / ${playerMax}`;
    this.bossHpText.textContent = `${bossHp} / ${bossMax}`;

    // Animate newly lost segments with white flash
    if (this.prevPlayerHp > 0 && playerHp < this.prevPlayerHp) {
      this.animateDamage(this.playerSegments, playerHp, this.prevPlayerHp);
    }
    if (this.prevBossHp > 0 && bossHp < this.prevBossHp) {
      this.animateDamage(this.bossSegments, bossHp, this.prevBossHp);
    }

    // Update segments
    const pSegs = this.playerSegments.children;
    for (let i = 0; i < pSegs.length; i++) {
      const seg = pSegs[i] as HTMLElement;
      if (!seg.classList.contains('flash-lost')) {
        seg.className = 'hp-seg';
        if (i >= playerHp) {
          seg.classList.add('lost');
        } else if (playerHp <= 3) {
          seg.classList.add('critical');
        }
      }
    }

    const bSegs = this.bossSegments.children;
    for (let i = 0; i < bSegs.length; i++) {
      const seg = bSegs[i] as HTMLElement;
      if (!seg.classList.contains('flash-lost')) {
        seg.className = 'hp-seg';
        if (i >= bossHp) {
          seg.classList.add('lost');
        } else if (bossHp <= 3) {
          seg.classList.add('critical');
        }
      }
    }

    // Critical pulse on container
    this.playerContainer.classList.toggle('pulse-critical', playerHp > 0 && playerHp <= 3);
    this.bossContainer.classList.toggle('pulse-critical', bossHp > 0 && bossHp <= 3);

    this.prevPlayerHp = playerHp;
    this.prevBossHp = bossHp;
  }

  private animateDamage(container: HTMLElement, newHp: number, oldHp: number) {
    const segs = container.children;
    for (let i = newHp; i < oldHp && i < segs.length; i++) {
      const seg = segs[i] as HTMLElement;
      seg.classList.add('flash-lost');
      setTimeout(() => {
        seg.classList.remove('flash-lost');
        seg.className = 'hp-seg lost';
      }, 500);
    }
  }

  setRound(round: number) {
    this.roundIndicator.classList.remove('hidden');
    this.roundText.textContent = `ROUND ${round}`;
  }
}
