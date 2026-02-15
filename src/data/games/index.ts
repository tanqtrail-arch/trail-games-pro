// =============================================================================
// ゲームレジストリ（自動ローダー）
// =============================================================================
//
// 新しいゲームを追加する手順:
//   1. このディレクトリに `<game-id>.ts` ファイルを作成
//   2. `GameWithTemplate` 型のオブジェクトを default export
//   3. 下の `gameModules` 配列に import を追加
//   → 自動的にプラットフォーム全体に反映されます
//
// ファイル命名規則: <category>-<template>-<number>.ts
//   例: climate-card-01.ts, history-quiz-02.ts
//
// =============================================================================

import type { GameWithTemplate, SubjectCategory } from '@/types';

// ---------------------------------------------------------------------------
// ゲームモジュールのインポート
// 新しいゲームを追加する場合はここに1行追加するだけ
// ---------------------------------------------------------------------------

import historyQuiz01 from './history-quiz-01';
import elementCard01 from './element-card-01';
import edoMaze01 from './edo-maze-01';
import ecoSim01 from './eco-sim-01';
import numberPuzzle01 from './number-puzzle-01';
import mathIframe01 from './math-iframe-01';
import fractionGunman01 from './fraction-gunman-01';
import mentalMath01 from './mental-math-01';

const gameModules: GameWithTemplate[] = [
  historyQuiz01,
  elementCard01,
  edoMaze01,
  ecoSim01,
  numberPuzzle01,
  mathIframe01,
  fractionGunman01,
  mentalMath01,
];

// ---------------------------------------------------------------------------
// ID重複チェック（開発時にすぐ気づけるように）
// ---------------------------------------------------------------------------

const idSet = new Set<string>();
for (const game of gameModules) {
  if (idSet.has(game.id)) {
    console.error(`[TRAIL] ゲームIDが重複しています: "${game.id}"`);
  }
  idSet.add(game.id);
}

// ---------------------------------------------------------------------------
// エクスポート
// ---------------------------------------------------------------------------

/** 全ゲームの配列 */
export const allGames: GameWithTemplate[] = gameModules;

/** ID → ゲーム の高速ルックアップ */
export const gamesMap = new Map<string, GameWithTemplate>(
  allGames.map((game) => [game.id, game])
);

/** カテゴリでフィルタリング */
export function getGamesByCategory(category: SubjectCategory): GameWithTemplate[] {
  return allGames.filter((g) => g.category === category);
}

/** テンプレートタイプでフィルタリング */
export function getGamesByTemplate(type: string): GameWithTemplate[] {
  return allGames.filter((g) => g.template.type === type);
}
