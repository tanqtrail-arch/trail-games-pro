// ---------------------------------------------------------------------------
// App-wide constants for 探究教室 TRAIL
// ---------------------------------------------------------------------------

/** Application display name */
export const APP_NAME = "探究教室 TRAIL" as const;

/** Maximum achievable level */
export const MAX_LEVEL = 99 as const;

// ---------------------------------------------------------------------------
// Subject & skill categories
// ---------------------------------------------------------------------------

/** Subject categories available in the platform */
export const SUBJECT_CATEGORIES = ["理科", "社会", "算数", "美術"] as const;
export type SubjectCategory = (typeof SUBJECT_CATEGORIES)[number];

/** Core skill axes measured across all games */
export const SKILL_NAMES = ["思考力", "探究力", "創造力"] as const;
export type SkillName = (typeof SKILL_NAMES)[number];

// ---------------------------------------------------------------------------
// Level titles (称号)
// ---------------------------------------------------------------------------

/**
 * Map of level ranges to their corresponding title (称号).
 * Each entry specifies an inclusive min/max level and the title awarded.
 */
export const LEVEL_TITLES: ReadonlyArray<{
  minLevel: number;
  maxLevel: number;
  title: string;
}> = [
  { minLevel: 1, maxLevel: 10, title: "探究ビギナー" },
  { minLevel: 11, maxLevel: 25, title: "探究チャレンジャー" },
  { minLevel: 26, maxLevel: 40, title: "探究アドベンチャー" },
  { minLevel: 41, maxLevel: 60, title: "探究マスター" },
  { minLevel: 61, maxLevel: 80, title: "探究エキスパート" },
  { minLevel: 81, maxLevel: 98, title: "探究レジェンド" },
  { minLevel: 99, maxLevel: 99, title: "探究の極み" },
] as const;

// ---------------------------------------------------------------------------
// Plan types
// ---------------------------------------------------------------------------

export interface PlanDefinition {
  id: string;
  label: string;
  features: string[];
}

/** Available subscription plans */
export const PLAN_TYPES: ReadonlyArray<PlanDefinition> = [
  {
    id: "free",
    label: "フリープラン",
    features: [
      "公開ゲーム無制限プレイ",
      "基本レベルシステム",
      "広告表示あり",
    ],
  },
  {
    id: "basic",
    label: "ベーシックプラン",
    features: [
      "全ゲームプレイ可能",
      "詳細スキルレポート",
      "広告非表示",
      "クラス管理（1クラス）",
    ],
  },
  {
    id: "pro",
    label: "プロプラン",
    features: [
      "全ゲームプレイ可能",
      "詳細スキルレポート",
      "広告非表示",
      "クラス管理（無制限）",
      "オリジナルゲーム作成",
      "CSV エクスポート",
      "優先サポート",
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Grade options
// ---------------------------------------------------------------------------

/** All grade options from 小1 to 高3 */
export const GRADE_OPTIONS = [
  "小1",
  "小2",
  "小3",
  "小4",
  "小5",
  "小6",
  "中1",
  "中2",
  "中3",
  "高1",
  "高2",
  "高3",
] as const;
export type GradeOption = (typeof GRADE_OPTIONS)[number];
