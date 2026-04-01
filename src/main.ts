import { SceneManager } from './core/Scene';
import { GameLoop } from './core/GameLoop';
import { TweenManager } from './animation/Tween';
import { Player } from './characters/Player';
import { MOSS } from './characters/bosses/MOSS';
import { BattleManager } from './game/BattleManager';
import { i18n, Lang } from './i18n';
import type { UserProfile } from './game/LLMService';

const container = document.getElementById('app')!;
const sceneManager = new SceneManager(container);
const loop = new GameLoop();

const player = new Player();
const moss = new MOSS();
sceneManager.scene.add(player.group);
sceneManager.scene.add(moss.group);

// 2.1 Hide 3D characters until battle starts
player.group.visible = false;
moss.group.visible = false;

const battle = new BattleManager(player, moss, sceneManager);

// ===== Loading screen: wait for all models =====
const loadingBar = document.getElementById('loading-bar')!;
const loadingHint = document.getElementById('loading-hint')!;
const loadingScreen = document.getElementById('loading-screen')!;
const startScreenEl = document.getElementById('start-screen')!;

// Hide start screen until loading finishes
startScreenEl.style.display = 'none';

loadingBar.style.width = '30%';
loadingHint.textContent = 'Loading astronaut...';

Promise.all([player.modelReady, moss.modelReady]).then(() => {
  loadingBar.style.width = '100%';
  loadingHint.textContent = 'Ready';
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    startScreenEl.style.display = '';
    setTimeout(() => loadingScreen.classList.add('hidden'), 800);
  }, 300);
});

// Update loading bar when individual models finish
player.modelReady.then(() => {
  loadingBar.style.width = '60%';
  loadingHint.textContent = 'Loading MOSS...';
});
moss.modelReady.then(() => {
  loadingBar.style.width = '80%';
  loadingHint.textContent = 'Preparing scene...';
});

// Home button: return to start screen
function goHome() {
  player.group.visible = false;
  moss.group.visible = false;
  player.resetState();
  moss.resetState();
  const startScreen = document.getElementById('start-screen')!;
  startScreen.classList.remove('hidden');
  startScreen.classList.remove('fade-out');
  // Re-trigger stagger animations
  const content = startScreen.querySelector('.start-content');
  if (content) {
    content.getAnimations().forEach(a => a.cancel());
    (content as HTMLElement).style.animation = 'none';
    (content as HTMLElement).offsetHeight;
    (content as HTMLElement).style.animation = '';
    Array.from(content.children).forEach(child => {
      (child as HTMLElement).style.animation = 'none';
      (child as HTMLElement).offsetHeight;
      (child as HTMLElement).style.animation = '';
    });
  }
  applyLanguage();
}
battle.setOnHome(goHome);

loop.onUpdate((dt, elapsed) => {
  TweenManager.update(dt);
  player.updateIdle(dt, elapsed);
  moss.updateIdle(dt, elapsed);
  player.particles.update(dt);
  moss.particles.update(dt);
  sceneManager.render();
});
loop.start();

// ===== i18n =====
i18n.init();

const AGE_OPTIONS = ['student', '25-30', '31-40', '40+'] as const;
const PROF_OPTIONS = ['programmer', 'designer', 'pm', 'student', 'creator', 'finance', 'other'] as const;
const REGION_OPTIONS = ['east-asia', 'south-asia', 'north-america', 'europe', 'latin-america', 'middle-east', 'other'] as const;

function applyLanguage() {
  const t = (k: string) => i18n.t(k);

  // Start screen
  document.getElementById('start-title')!.textContent = t('start.title');
  document.getElementById('start-subtitle')!.textContent = t('start.subtitle');
  document.getElementById('boss-subtitle-text')!.textContent = t('start.boss.subtitle');
  document.getElementById('boss-quote-text')!.textContent = t('start.boss.quote');
  document.getElementById('form-hint-text')!.textContent = t('start.form.hint');
  document.getElementById('label-age')!.textContent = t('start.form.age');
  document.getElementById('label-prof')!.textContent = t('start.form.profession');
  document.getElementById('label-region')!.textContent = t('start.form.region');
  document.getElementById('start-btn')!.textContent = t('start.btn');

  // HUD
  document.getElementById('player-name')!.textContent = t('hud.you');

  // Populate selects
  const ageEl = document.getElementById('profile-age') as HTMLSelectElement;
  const profEl = document.getElementById('profile-profession') as HTMLSelectElement;
  const regionEl = document.getElementById('profile-region') as HTMLSelectElement;

  const ageVal = ageEl.value || '25-30';
  const profVal = profEl.value || 'programmer';
  const regionVal = regionEl.value || 'east-asia';

  ageEl.innerHTML = AGE_OPTIONS.map(v =>
    `<option value="${v}"${v === ageVal ? ' selected' : ''}>${t('age.' + v)}</option>`
  ).join('');

  profEl.innerHTML = PROF_OPTIONS.map(v =>
    `<option value="${v}"${v === profVal ? ' selected' : ''}>${t('prof.' + v)}</option>`
  ).join('');

  regionEl.innerHTML = REGION_OPTIONS.map(v =>
    `<option value="${v}"${v === regionVal ? ' selected' : ''}>${t('region.' + v)}</option>`
  ).join('');

  // Result screen
  document.getElementById('result-restart')!.textContent = t('result.restart');

  // Lang buttons active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.lang === i18n.lang);
  });
}

// Language buttons
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = (btn as HTMLElement).dataset.lang as Lang;
    i18n.setLang(lang);
    applyLanguage();
  });
});

// Apply initial language
applyLanguage();

// Start
const startScreen = document.getElementById('start-screen')!;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;

startBtn.addEventListener('click', () => {
  const ageGroup = (document.getElementById('profile-age') as HTMLSelectElement).value;
  const profession = (document.getElementById('profile-profession') as HTMLSelectElement).value;
  const region = (document.getElementById('profile-region') as HTMLSelectElement).value;

  const profile: UserProfile = {
    ageGroup: ageGroup as UserProfile['ageGroup'],
    profession: profession as UserProfile['profession'],
    region: region as UserProfile['region'],
  };

  battle.setProfile(profile);

  // 2.2 Fade-out start screen instead of instant hide
  startScreen.classList.add('fade-out');
  setTimeout(() => {
    startScreen.classList.add('hidden');
    startScreen.classList.remove('fade-out');
  }, 800);

  // 2.1 Show 3D characters
  player.group.visible = true;
  moss.group.visible = true;

  battle.startBattle();
});
