export enum BattlePhase {
  IDLE = 'IDLE',
  INTRO = 'INTRO',
  AI_ATTACKING = 'AI_ATTACKING',         // AI generating attack
  PLAYER_REACT = 'PLAYER_REACT',         // Player selects how much they're "hit"
  PLAYER_HIT_ANIM = 'PLAYER_HIT_ANIM',  // Playing hit animation on player
  PLAYER_INPUT = 'PLAYER_INPUT',         // Player typing their counter-attack
  JUDGING = 'JUDGING',                   // LLM judging player's attack
  BOSS_HIT_ANIM = 'BOSS_HIT_ANIM',      // Playing hit animation on boss
  CHECK_WIN = 'CHECK_WIN',
  VICTORY = 'VICTORY',
  DEFEAT = 'DEFEAT',
}

type PhaseListener = (phase: BattlePhase, prev: BattlePhase) => void;

class GameStateClass {
  phase: BattlePhase = BattlePhase.IDLE;
  private listeners: PhaseListener[] = [];

  onPhaseChange(fn: PhaseListener) {
    this.listeners.push(fn);
  }

  setPhase(next: BattlePhase) {
    const prev = this.phase;
    this.phase = next;
    for (const fn of this.listeners) fn(next, prev);
  }
}

export const GameState = new GameStateClass();
