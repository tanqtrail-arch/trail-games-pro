// =============================================================================
// 探究教室 TRAIL - ゲームデータ（後方互換エクスポート）
// =============================================================================
//
// ゲームデータは src/data/games/ に移行しました。
// このファイルは既存のインポートとの互換性を保つための re-export です。
//
// 新しいゲームを追加する場合:
//   1. src/data/games/_template.ts をコピーして新しいファイルを作成
//   2. src/data/games/index.ts の gameModules に追加
//
// =============================================================================

import type { SubjectCategory } from '@/types';
import { allGames, gamesMap } from '@/data/games';

// ---------------------------------------------------------------------------
// 後方互換エクスポート
// ---------------------------------------------------------------------------

/** @deprecated allGames を使用してください */
export const sampleGames = allGames;

/** @deprecated gamesMap を使用してください */
export const sampleGamesMap = gamesMap;

// ---------------------------------------------------------------------------
// ヘルパー関数（引き続きここからエクスポート）
// ---------------------------------------------------------------------------

/** Helper to get grade label from numeric value */
export function getGradeLabel(gradeNum: number): string {
  if (gradeNum >= 1 && gradeNum <= 6) return `小${gradeNum}`;
  if (gradeNum >= 7 && gradeNum <= 9) return `中${gradeNum - 6}`;
  if (gradeNum >= 10 && gradeNum <= 12) return `高${gradeNum - 9}`;
  return `${gradeNum}`;
}

/** Helper to get grade range string */
export function getGradeRange(min: number, max: number): string {
  return `${getGradeLabel(min)}〜${getGradeLabel(max)}`;
}

/** Category color mapping */
export const categoryColors: Record<SubjectCategory, { bg: string; text: string; gradient: string }> = {
  理科: { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-400 to-teal-500' },
  社会: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-400 to-orange-500' },
  算数: { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-400 to-teal-500' },
  美術: { bg: 'bg-pink-100', text: 'text-pink-700', gradient: 'from-pink-400 to-rose-500' },
};
