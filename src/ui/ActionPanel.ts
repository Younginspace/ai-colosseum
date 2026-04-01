import { i18n } from '../i18n';

export type DamageChoice = 1 | 2 | 3;

interface QuickReply {
  label: string;
  text: string;
}

export class ActionPanel {
  private panel: HTMLElement;
  private msgBox: HTMLElement;
  private msgSpeaker: HTMLElement;
  private msgContent: HTMLElement;
  private damageChoice: HTMLElement;
  private damagePrompt: HTMLElement;
  private damageButtons: HTMLElement;
  private damageTip: HTMLElement;
  private attackMenu: HTMLElement;
  private attackLabel: HTMLElement;
  private attackGrid: HTMLElement;
  private customInput: HTMLInputElement;
  private customSend: HTMLButtonElement;
  private judgeResult: HTMLElement;
  private judgeReaction: HTMLElement;
  private judgeDamage: HTMLElement;

  constructor() {
    this.panel = document.getElementById('action-panel')!;
    this.msgBox = document.getElementById('msg-box')!;
    this.msgSpeaker = document.getElementById('msg-speaker')!;
    this.msgContent = document.getElementById('msg-content')!;
    this.damageChoice = document.getElementById('damage-choice')!;
    this.damagePrompt = document.getElementById('damage-prompt')!;
    this.damageButtons = document.getElementById('damage-buttons')!;
    this.damageTip = document.getElementById('damage-tip')!;
    this.attackMenu = document.getElementById('attack-menu')!;
    this.attackLabel = document.getElementById('attack-label')!;
    this.attackGrid = document.getElementById('attack-grid')!;
    this.customInput = document.getElementById('custom-input') as HTMLInputElement;
    this.customSend = document.getElementById('custom-send') as HTMLButtonElement;
    this.judgeResult = document.getElementById('judge-result')!;
    this.judgeReaction = document.getElementById('judge-reaction')!;
    this.judgeDamage = document.getElementById('judge-damage')!;
  }

  show() { this.panel.classList.remove('hidden'); }
  hide() { this.panel.classList.add('hidden'); }

  private hideAllSections() {
    this.msgBox.classList.add('hidden');
    this.damageChoice.classList.add('hidden');
    this.attackMenu.classList.add('hidden');
    this.judgeResult.classList.add('hidden');
  }

  private showSection(el: HTMLElement) {
    this.hideAllSections();
    el.classList.remove('hidden');
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  }

  // === MOSS attack with typewriter + click to continue ===
  async showBossMessage(text: string): Promise<void> {
    this.showSection(this.msgBox);
    this.msgSpeaker.textContent = 'MOSS';
    this.msgSpeaker.style.color = '';
    this.msgContent.innerHTML = '<span class="typing-cursor"></span>';

    const cursor = this.msgContent.querySelector('.typing-cursor')!;
    const textNode = document.createTextNode('');
    this.msgContent.insertBefore(textNode, cursor);

    let done = false;
    await new Promise<void>(resolve => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          textNode.textContent += text[i];
          i++;
        } else {
          clearInterval(interval);
          cursor.remove();
          done = true;
          resolve();
        }
      }, 35);

      const skip = () => {
        if (!done) {
          clearInterval(interval);
          textNode.textContent = text;
          cursor.remove();
          done = true;
          resolve();
        }
        this.msgBox.removeEventListener('click', skip);
      };
      this.msgBox.addEventListener('click', skip);
    });

    await this.waitForContinue(this.msgBox);
  }

  // === Thinking indicator ===
  showThinking(speaker: string) {
    this.showSection(this.msgBox);
    this.msgSpeaker.textContent = speaker;
    this.msgSpeaker.style.color = '';
    this.msgContent.innerHTML = `<span style="color:#666;font-style:italic">${i18n.t('action.thinking')}<span class="typing-cursor"></span></span>`;
  }

  // === Damage choice ===
  showDamageChoice(): Promise<DamageChoice> {
    return new Promise(resolve => {
      this.showSection(this.damageChoice);
      this.damagePrompt.textContent = i18n.t('action.damage_prompt');

      const tips = i18n.tips();
      this.damageTip.textContent = tips[Math.floor(Math.random() * tips.length)];

      const labels = [i18n.t('action.dmg1'), i18n.t('action.dmg2'), i18n.t('action.dmg3')];
      this.damageButtons.innerHTML = '';
      ([1, 2, 3] as const).forEach((dmg, idx) => {
        const btn = document.createElement('button');
        btn.textContent = labels[idx];
        btn.addEventListener('click', () => resolve(dmg));
        this.damageButtons.appendChild(btn);
      });
    });
  }

  // === Attack menu ===
  showAttackMenu(quickReplies: QuickReply[]): Promise<string> {
    return new Promise(resolve => {
      this.showSection(this.attackMenu);
      this.attackLabel.textContent = i18n.t('action.your_turn');
      this.customInput.placeholder = i18n.t('action.free_input');
      this.customSend.textContent = i18n.t('action.send');
      this.attackGrid.innerHTML = '';

      quickReplies.forEach(qr => {
        const btn = document.createElement('button');
        btn.textContent = qr.label;
        btn.addEventListener('click', () => { cleanup(); resolve(qr.text); });
        this.attackGrid.appendChild(btn);
      });

      this.customInput.value = '';
      this.customSend.disabled = false;

      const submit = () => {
        const text = this.customInput.value.trim();
        if (!text) return;
        cleanup();
        resolve(text);
      };

      const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } };
      const onClick = () => submit();
      this.customInput.addEventListener('keydown', onKey);
      this.customSend.addEventListener('click', onClick);

      const cleanup = () => {
        this.customInput.removeEventListener('keydown', onKey);
        this.customSend.removeEventListener('click', onClick);
      };

      setTimeout(() => this.customInput.focus(), 100);
    });
  }

  // === Player message + click to continue ===
  async showPlayerMessage(text: string): Promise<void> {
    this.showSection(this.msgBox);
    this.msgSpeaker.textContent = i18n.t('hud.you');
    this.msgSpeaker.style.color = '#60a5fa';
    this.msgContent.textContent = text;
    await this.waitForContinue(this.msgBox);
  }

  // === Judge result + click to continue ===
  async showJudgeResult(reaction: string, damage: number): Promise<void> {
    this.showSection(this.judgeResult);
    this.judgeReaction.textContent = `"${reaction}"`;
    this.judgeDamage.textContent = i18n.t('action.dealt', { n: damage });
    this.judgeDamage.className = `tier${damage}`;
    this.msgSpeaker.style.color = '';

    await this.waitForContinue(this.judgeResult);
  }

  // === Generic click-to-continue ===
  private waitForContinue(parent: HTMLElement): Promise<void> {
    const cont = document.createElement('div');
    cont.className = 'continue-prompt';
    cont.innerHTML = i18n.t('action.continue');
    parent.appendChild(cont);

    return new Promise(resolve => {
      const handler = () => {
        cont.remove();
        parent.removeEventListener('click', handler);
        resolve();
      };
      parent.addEventListener('click', handler);
    });
  }
}
