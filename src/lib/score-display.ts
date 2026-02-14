// ---------------------------------------------------------------------------
// Score display conversion system for 探究教室 TRAIL
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single rule that maps a percentage threshold to a display value. */
export interface ScoreDisplayRule {
  /** Minimum percentage (inclusive) for this rule to apply. */
  minPercent: number;
  /** The label to display (e.g. "S", "探究博士"). */
  label: string;
  /** Optional colour (hex string) associated with this rule. */
  color?: string;
  /** Optional star count (used by "stars" type). */
  stars?: number;
}

/** Configuration object that determines how a raw score is presented. */
export interface ScoreDisplayConfig {
  /**
   * Display type:
   *  - "rank"   : letter-rank label  (S / A / B / C / D)
   *  - "points" : numeric points     (85点)
   *  - "stars"  : filled-star rating  (4 / 5)
   *  - "title"  : descriptive title   (探究博士)
   */
  type: "rank" | "points" | "stars" | "title";
  /** Rules evaluated from highest minPercent to lowest. First match wins. */
  rules?: ScoreDisplayRule[];
  /** Maximum number of stars (only relevant for "stars" type). */
  maxStars?: number;
}

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface RankDisplayResult {
  type: "rank";
  label: string;
  color: string;
}

export interface PointsDisplayResult {
  type: "points";
  label: string;
  value: number;
}

export interface StarsDisplayResult {
  type: "stars";
  filled: number;
  max: number;
}

export interface TitleDisplayResult {
  type: "title";
  label: string;
}

export type ScoreDisplayResult =
  | RankDisplayResult
  | PointsDisplayResult
  | StarsDisplayResult
  | TitleDisplayResult;

// ---------------------------------------------------------------------------
// Default configurations
// ---------------------------------------------------------------------------

const DEFAULT_RANK_RULES: ScoreDisplayRule[] = [
  { minPercent: 90, label: "S", color: "#FFD700" },
  { minPercent: 75, label: "A", color: "#C0C0C0" },
  { minPercent: 55, label: "B", color: "#CD7F32" },
  { minPercent: 30, label: "C", color: "#4A90D9" },
  { minPercent: 0, label: "D", color: "#888888" },
];

const DEFAULT_STAR_RULES: ScoreDisplayRule[] = [
  { minPercent: 90, label: "5", stars: 5 },
  { minPercent: 70, label: "4", stars: 4 },
  { minPercent: 50, label: "3", stars: 3 },
  { minPercent: 25, label: "2", stars: 2 },
  { minPercent: 0, label: "1", stars: 1 },
];

const DEFAULT_TITLE_RULES: ScoreDisplayRule[] = [
  { minPercent: 90, label: "探究博士" },
  { minPercent: 70, label: "探究名人" },
  { minPercent: 50, label: "探究見習い" },
  { minPercent: 25, label: "探究入門" },
  { minPercent: 0, label: "探究たまご" },
];

// ---------------------------------------------------------------------------
// Core function
// ---------------------------------------------------------------------------

/**
 * Convert a raw score into a display-friendly result based on the provided
 * configuration.
 *
 * The function calculates `percent = (score / maxScore) * 100` and then
 * matches against the config rules (sorted descending by `minPercent`).
 *
 * @param score    - The raw score achieved.
 * @param maxScore - The maximum possible score.
 * @param config   - Display configuration controlling the output format.
 * @returns A typed display result depending on the config type.
 */
export function formatScoreDisplay(
  score: number,
  maxScore: number,
  config: ScoreDisplayConfig
): ScoreDisplayResult {
  const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;

  switch (config.type) {
    // ------------------------------------------------------------------
    // Rank display  (S / A / B / C / D)
    // ------------------------------------------------------------------
    case "rank": {
      const rules = config.rules?.length ? config.rules : DEFAULT_RANK_RULES;
      const sorted = [...rules].sort((a, b) => b.minPercent - a.minPercent);
      const matched = sorted.find((r) => percent >= r.minPercent) ?? sorted[sorted.length - 1];
      return {
        type: "rank",
        label: matched.label,
        color: matched.color ?? "#888888",
      };
    }

    // ------------------------------------------------------------------
    // Points display  (85点)
    // ------------------------------------------------------------------
    case "points": {
      const value = Math.round(percent);
      return {
        type: "points",
        label: `${value}点`,
        value,
      };
    }

    // ------------------------------------------------------------------
    // Stars display  (4 / 5)
    // ------------------------------------------------------------------
    case "stars": {
      const maxStars = config.maxStars ?? 5;
      const rules = config.rules?.length ? config.rules : DEFAULT_STAR_RULES;
      const sorted = [...rules].sort((a, b) => b.minPercent - a.minPercent);
      const matched = sorted.find((r) => percent >= r.minPercent) ?? sorted[sorted.length - 1];
      const filled = matched.stars ?? Math.max(1, Math.round((percent / 100) * maxStars));
      return {
        type: "stars",
        filled: Math.min(filled, maxStars),
        max: maxStars,
      };
    }

    // ------------------------------------------------------------------
    // Title display  (探究博士)
    // ------------------------------------------------------------------
    case "title": {
      const rules = config.rules?.length ? config.rules : DEFAULT_TITLE_RULES;
      const sorted = [...rules].sort((a, b) => b.minPercent - a.minPercent);
      const matched = sorted.find((r) => percent >= r.minPercent) ?? sorted[sorted.length - 1];
      return {
        type: "title",
        label: matched.label,
      };
    }

    default: {
      // Fallback – treat as points.
      const value = Math.round(percent);
      return {
        type: "points",
        label: `${value}点`,
        value,
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Default config helper
// ---------------------------------------------------------------------------

/**
 * Returns a sensible default ScoreDisplayConfig using the "points" type.
 */
export function getDefaultDisplayConfig(): ScoreDisplayConfig {
  return {
    type: "points",
  };
}
