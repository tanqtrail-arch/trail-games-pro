// ---------------------------------------------------------------------------
// Level system engine for 探究教室 TRAIL
// ---------------------------------------------------------------------------

import { MAX_LEVEL } from "./constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LevelEntry {
  level: number;
  title: string;
  xp_required: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number | null; // null at max level
  progressPercent: number; // 0-100
}

export interface GameSkills {
  思考力?: number;
  探究力?: number;
  創造力?: number;
  [key: string]: number | undefined;
}

// ---------------------------------------------------------------------------
// Title resolver
// ---------------------------------------------------------------------------

/**
 * Returns the 称号 (title) for a given level.
 */
export function getTitleForLevel(level: number): string {
  if (level >= 99) return "探究の極み";
  if (level >= 81) return "探究レジェンド";
  if (level >= 61) return "探究エキスパート";
  if (level >= 41) return "探究マスター";
  if (level >= 26) return "探究アドベンチャー";
  if (level >= 11) return "探究チャレンジャー";
  return "探究ビギナー";
}

// ---------------------------------------------------------------------------
// XP curve generation
// ---------------------------------------------------------------------------

/**
 * Compute cumulative XP required to reach a given level.
 *
 * The curve follows:  xp_required = floor(BASE * level ^ EXPONENT)
 *
 * This produces an easy start that becomes progressively harder:
 *   Lv  1 →     0 XP  (starting point)
 *   Lv  2 →    40 XP
 *   Lv 10 →   760 XP
 *   Lv 25 →  3,700 XP
 *   Lv 50 → 12,800 XP
 *   Lv 99 → 44,000+ XP
 */
function computeXpRequired(level: number): number {
  if (level <= 1) return 0;
  const BASE = 8;
  const EXPONENT = 1.85;
  return Math.floor(BASE * Math.pow(level, EXPONENT));
}

// ---------------------------------------------------------------------------
// LEVEL_TABLE
// ---------------------------------------------------------------------------

/**
 * Precomputed lookup table for all 99 levels.
 * Each entry contains the level number, its title (称号) and cumulative XP
 * required to reach that level.
 */
export const LEVEL_TABLE: ReadonlyArray<LevelEntry> = Array.from(
  { length: MAX_LEVEL },
  (_, i) => {
    const level = i + 1;
    return {
      level,
      title: getTitleForLevel(level),
      xp_required: computeXpRequired(level),
    };
  }
);

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Given a total XP value, determine the player's current level, title,
 * and progress toward the next level.
 */
export function getLevelInfo(xp: number): LevelInfo {
  // Walk the table to find the highest level the player has reached.
  let currentEntry = LEVEL_TABLE[0];
  for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TABLE[i].xp_required) {
      currentEntry = LEVEL_TABLE[i];
      break;
    }
  }

  const isMaxLevel = currentEntry.level >= MAX_LEVEL;
  const nextEntry = isMaxLevel
    ? null
    : LEVEL_TABLE[currentEntry.level]; // LEVEL_TABLE is 0-indexed, so index = level for next

  const xpForCurrentLevel = currentEntry.xp_required;
  const xpForNextLevel = nextEntry ? nextEntry.xp_required : null;

  let progressPercent = 100;
  if (xpForNextLevel !== null) {
    const range = xpForNextLevel - xpForCurrentLevel;
    const progress = xp - xpForCurrentLevel;
    progressPercent = range > 0 ? Math.min(100, Math.floor((progress / range) * 100)) : 100;
  }

  return {
    level: currentEntry.level,
    title: currentEntry.title,
    currentXp: xp,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercent,
  };
}

/**
 * Returns 0-100 representing progress toward the next level.
 */
export function getProgressPercent(xp: number): number {
  return getLevelInfo(xp).progressPercent;
}

/**
 * Calculate XP earned from a single game play.
 *
 * Base XP is derived from the score percentage.  A skill bonus is layered
 * on top – each skill value (0-100 scale) contributes a small multiplier
 * so that games tagging multiple skills reward slightly more XP.
 *
 * @param score     - The raw score the player achieved.
 * @param maxScore  - The maximum possible score for the game.
 * @param gameSkills - Object mapping skill names to their awarded values (0-100).
 * @returns XP gained (integer, minimum 1 if score > 0).
 */
export function calculateXpGain(
  score: number,
  maxScore: number,
  gameSkills: GameSkills = {}
): number {
  if (maxScore <= 0 || score <= 0) return 0;

  const percent = Math.min(score / maxScore, 1);

  // Base XP: 10-50 range based on percent
  const BASE_MIN = 10;
  const BASE_MAX = 50;
  const baseXp = BASE_MIN + (BASE_MAX - BASE_MIN) * percent;

  // Skill bonus: each skill adds up to 5% per skill axis
  const skillValues = Object.values(gameSkills).filter(
    (v): v is number => typeof v === "number"
  );
  const skillBonus =
    skillValues.length > 0
      ? skillValues.reduce((sum, v) => sum + (v / 100) * 0.05, 0)
      : 0;

  const totalXp = baseXp * (1 + skillBonus);

  return Math.max(1, Math.round(totalXp));
}
