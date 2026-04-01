import { i18n } from '../i18n';
import type { BattleStats } from '../game/BattleManager';

export class ResultScreen {
  private screen: HTMLElement;
  private title: HTMLElement;
  private subtitle: HTMLElement;
  private line: HTMLElement;
  private restartBtn: HTMLElement;
  private homeBtn: HTMLElement;
  private particles: HTMLElement;
  private statsEl: HTMLElement;
  private mossEye: HTMLElement;

  constructor() {
    this.screen = document.getElementById('result-screen')!;
    this.title = document.getElementById('result-title')!;
    this.subtitle = document.getElementById('result-subtitle')!;
    this.line = document.getElementById('result-line')!;
    this.restartBtn = document.getElementById('result-restart')!;
    this.homeBtn = document.getElementById('result-home')!;
    this.particles = document.getElementById('result-particles')!;
    this.statsEl = document.getElementById('result-stats')!;
    this.mossEye = document.getElementById('result-moss-eye')!;
  }

  showVictory(onRestart: () => void, stats?: BattleStats, onHome?: () => void) {
    this.screen.className = 'victory';
    this.screen.id = 'result-screen';
    this.mossEye.classList.add('hidden');

    this.title.textContent = i18n.t('result.victory');
    this.title.style.color = '#4ade80';
    this.subtitle.textContent = i18n.t('result.victory.sub');
    this.line.textContent = i18n.t('result.victory.line');
    this.restartBtn.textContent = i18n.t('result.restart');
    this.restartBtn.onclick = () => { this.hide(); onRestart(); };
    this.homeBtn.textContent = i18n.t('result.home') || 'HOME';
    this.homeBtn.onclick = () => { this.hide(); onHome?.(); };

    // Stats summary
    if (stats) {
      this.showStats(stats, '#4ade80');
    }

    this.screen.classList.remove('hidden');

    // Green particle burst
    this.emitParticles('#4ade80', 40);
  }

  showDefeat(onRestart: () => void, stats?: BattleStats, onHome?: () => void) {
    this.screen.className = 'defeat';
    this.screen.id = 'result-screen';
    this.mossEye.classList.remove('hidden');

    this.title.textContent = i18n.t('result.defeat');
    this.title.style.color = '#f87171';
    this.subtitle.textContent = i18n.t('result.defeat.sub');
    this.line.textContent = i18n.t('result.defeat.line');
    this.restartBtn.textContent = i18n.t('result.restart');
    this.restartBtn.onclick = () => { this.hide(); onRestart(); };
    this.homeBtn.textContent = i18n.t('result.home') || 'HOME';
    this.homeBtn.onclick = () => { this.hide(); onHome?.(); };

    // Stats summary
    if (stats) {
      this.showStats(stats, '#f87171');
    }

    this.screen.classList.remove('hidden');
  }

  private showStats(stats: BattleStats, accentColor: string) {
    this.statsEl.classList.remove('hidden');
    this.statsEl.innerHTML = `
      <div class="result-stat">
        <span class="result-stat-value" style="color:${accentColor}">${stats.rounds}</span>
        <span class="result-stat-label">ROUNDS</span>
      </div>
      <div class="result-stat">
        <span class="result-stat-value" style="color:#fbbf24">${stats.totalPlayerDamageTaken}</span>
        <span class="result-stat-label">DMG TAKEN</span>
      </div>
      <div class="result-stat">
        <span class="result-stat-value" style="color:#60a5fa">${stats.totalBossDamageTaken}</span>
        <span class="result-stat-label">DMG DEALT</span>
      </div>
    `;
  }

  private emitParticles(color: string, count: number) {
    this.particles.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'result-particle';
      p.style.background = color;
      p.style.left = '50%';
      p.style.top = '40%';

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 100 + Math.random() * 200;
      p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      p.style.animationDelay = `${Math.random() * 0.3}s`;

      this.particles.appendChild(p);
    }
    // Cleanup after animation
    setTimeout(() => { this.particles.innerHTML = ''; }, 2000);
  }

  hide() {
    this.screen.classList.add('hidden');
    this.statsEl.classList.add('hidden');
    this.mossEye.classList.add('hidden');
    this.particles.innerHTML = '';
  }
}
