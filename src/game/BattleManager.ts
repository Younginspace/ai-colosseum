import { Player } from '../characters/Player';
import { AIBoss } from '../characters/bosses/AIBoss';
import { LLMService, UserProfile } from './LLMService';
import { GameState, BattlePhase } from './GameState';
import { HUD } from '../ui/HUD';
import { ActionPanel } from '../ui/ActionPanel';
import { BattleStatus } from '../ui/BattleStatus';
import { DamageNumber } from '../ui/DamageNumber';
import { ResultScreen } from '../ui/ResultScreen';
import { SceneManager } from '../core/Scene';
import { tweenAsync, Easing, wait } from '../animation/Tween';
import { i18n } from '../i18n';

export interface BattleStats {
  rounds: number;
  playerHpRemaining: number;
  bossHpRemaining: number;
  totalPlayerDamageTaken: number;
  totalBossDamageTaken: number;
}

export class BattleManager {
  player: Player;
  boss: AIBoss;
  private scene: SceneManager;
  private llm: LLMService;
  private hud: HUD;
  private action: ActionPanel;
  private status: BattleStatus;
  private damageNum: DamageNumber;
  private result: ResultScreen;
  private onHome: (() => void) | null = null;
  private round = 0;
  private stats: BattleStats = {
    rounds: 0,
    playerHpRemaining: 0,
    bossHpRemaining: 0,
    totalPlayerDamageTaken: 0,
    totalBossDamageTaken: 0,
  };

  constructor(player: Player, boss: AIBoss, scene: SceneManager) {
    this.player = player;
    this.boss = boss;
    this.scene = scene;
    this.llm = new LLMService();
    this.hud = new HUD();
    this.action = new ActionPanel();
    this.status = new BattleStatus();
    this.damageNum = new DamageNumber();
    this.result = new ResultScreen();
    this.hud.setBossName(boss.config.name);
    this.hud.initSegments(10);
  }

  setProfile(profile: UserProfile) {
    this.llm.setProfile(profile);
  }

  setOnHome(cb: () => void) {
    this.onHome = cb;
  }

  async startBattle() {
    this.round = 0;
    this.stats = {
      rounds: 0, playerHpRemaining: 0, bossHpRemaining: 0,
      totalPlayerDamageTaken: 0, totalBossDamageTaken: 0,
    };
    this.player.resetState();
    this.boss.resetState();
    this.llm.reset();
    this.action.show();
    this.updateHUD();
    this.result.hide();

    // 1.2 Show HUD when battle starts
    this.hud.show();

    // 2.3 Battle intro sequence — bloom flash + characters fade in
    GameState.setPhase(BattlePhase.INTRO);
    this.scene.pulseBloom(2);

    // Brief FOV squeeze for drama
    const origFov = this.scene.camera.fov;
    await tweenAsync({
      from: origFov,
      to: origFov - 5,
      duration: 0.4,
      easing: Easing.easeOutQuad,
      onUpdate: v => {
        this.scene.camera.fov = v;
        this.scene.camera.updateProjectionMatrix();
      },
    });
    await tweenAsync({
      from: origFov - 5,
      to: origFov,
      duration: 0.6,
      easing: Easing.easeOutCubic,
      onUpdate: v => {
        this.scene.camera.fov = v;
        this.scene.camera.updateProjectionMatrix();
      },
    });

    this.status.showBanner(`${i18n.t('hud.round')} 1`, '#fff', 1200);
    await wait(1500);

    this.nextRound();
  }

  private async nextRound() {
    this.round++;
    this.hud.setRound(this.round);

    // ====== AI's turn ======
    GameState.setPhase(BattlePhase.AI_ATTACKING);
    this.action.show();
    this.action.showThinking('MOSS');
    const aiResult = await this.llm.getAIAttack(this.round, this.boss.hp, this.player.hp);

    // Typewriter display + wait for click
    await this.action.showBossMessage(aiResult.line);

    // ====== Player chooses how hurt they are ======
    GameState.setPhase(BattlePhase.PLAYER_REACT);
    const playerDamage = await this.action.showDamageChoice();

    // Animation
    GameState.setPhase(BattlePhase.PLAYER_HIT_ANIM);
    this.action.hide();

    // 4.2 Flash light on attack (subtle)
    const flashColor = playerDamage === 3 ? 0xff2200 : playerDamage === 2 ? 0xff8800 : 0xffffff;
    this.scene.triggerFlash(flashColor, 0.5 + playerDamage * 0.4, 150 + playerDamage * 50);

    await this.boss.playAttack(this.player.group.position, playerDamage);
    this.player.takeDamage(playerDamage);
    await this.player.playHit(playerDamage);

    // 3.1 Bloom pulse on hit
    this.scene.pulseBloom(playerDamage);

    this.damageNum.show(playerDamage, 'player');
    this.updateHUD();
    this.stats.totalPlayerDamageTaken += playerDamage;

    await wait(600);

    // Check death
    if (!this.player.isAlive) {
      GameState.setPhase(BattlePhase.DEFEAT);
      await this.boss.playExecution();
      await this.player.playDeath();
      await wait(500);
      this.stats.rounds = this.round;
      this.stats.playerHpRemaining = 0;
      this.stats.bossHpRemaining = this.boss.hp;
      this.hud.hide();
      this.result.showDefeat(() => this.startBattle(), this.stats, this.onHome ?? undefined);
      return;
    }

    // ====== Player's counter-attack ======
    GameState.setPhase(BattlePhase.PLAYER_INPUT);
    this.action.show();
    const quickReplies = this.llm.getQuickReplies();
    const playerMessage = await this.action.showAttackMenu(quickReplies);

    // Show what player said, wait for click
    await this.action.showPlayerMessage(playerMessage);

    // ====== Judge ======
    GameState.setPhase(BattlePhase.JUDGING);
    this.action.showThinking(i18n.t('action.judge'));
    const judgeResult = await this.llm.judgePlayerAttack(
      playerMessage, this.round, this.boss.hp, this.player.hp,
    );

    // Show result, wait for click
    await this.action.showJudgeResult(judgeResult.reaction, judgeResult.damage);

    // Animation
    GameState.setPhase(BattlePhase.BOSS_HIT_ANIM);
    this.action.hide();

    // 4.2 Flash light (subtle)
    const judgeFlashColor = judgeResult.damage === 3 ? 0x4488ff : judgeResult.damage === 2 ? 0x44aaff : 0xffffff;
    this.scene.triggerFlash(judgeFlashColor, 0.5 + judgeResult.damage * 0.4, 150 + judgeResult.damage * 50);

    await this.player.playAttack(this.boss.group.position, judgeResult.damage);
    this.boss.takeDamage(judgeResult.damage);
    await this.boss.playHit(judgeResult.damage);

    // 3.1 Bloom pulse
    this.scene.pulseBloom(judgeResult.damage);

    this.damageNum.show(judgeResult.damage, 'boss');
    this.updateHUD();
    this.stats.totalBossDamageTaken += judgeResult.damage;

    await wait(600);

    // Check boss death
    if (!this.boss.isAlive) {
      GameState.setPhase(BattlePhase.VICTORY);
      await this.player.playExecution();
      await this.boss.playDeath();
      await wait(500);
      this.stats.rounds = this.round;
      this.stats.playerHpRemaining = this.player.hp;
      this.stats.bossHpRemaining = 0;
      this.hud.hide();
      this.result.showVictory(() => this.startBattle(), this.stats, this.onHome ?? undefined);
      return;
    }

    // ====== Next round ======
    GameState.setPhase(BattlePhase.CHECK_WIN);
    this.status.showBanner(`${i18n.t('hud.round')} ${this.round + 1}`, '#fff', 800);
    await wait(1200);
    this.nextRound();
  }

  private updateHUD() {
    this.hud.updateHP(
      this.player.hp, this.player.maxHp,
      this.boss.hp, this.boss.maxHp,
    );
  }
}
