// =============================================================================
// 暗算チャレンジ — たし算・ひき算・かけ算の暗算力を鍛えるゲーム
// =============================================================================

import type { GameWithTemplate } from '@/types';

const game: GameWithTemplate = {
  id: 'mental-math-01',
  title: '暗算チャレンジ',
  category: '算数',
  grade_min: 1,   // 小1
  grade_max: 6,   // 小6
  skill_tags: {
    思考力: 4,
    探究力: 2,
    創造力: 3,
  },
  description:
    'ランダムに出題される計算問題をすばやく暗算で解こう！制限時間内に正しい答えを入力してね。コンボをつなげて高スコアを目指そう！',
  thumbnail_url: '',

  score_display_config: {
    type: 'rank',
    rules: [
      { min_percent: 90, label: 'S', color: '#FFD700' },
      { min_percent: 75, label: 'A', color: '#C0C0C0' },
      { min_percent: 55, label: 'B', color: '#CD7F32' },
      { min_percent: 30, label: 'C', color: '#4A90D9' },
      { min_percent: 0, label: 'D', color: '#888888' },
    ],
  },

  template: {
    type: 'mental-math',
    totalQuestions: 15,
    timePerQuestion: 15,
    levels: [
      {
        // 序盤（問1-5）: かんたん たし算・ひき算
        fromQuestion: 1,
        toQuestion: 5,
        operations: ['+', '-'],
        minNumber: 1,
        maxNumber: 20,
      },
      {
        // 中盤（問6-10）: たし算・ひき算の数が大きくなる + かけ算
        fromQuestion: 6,
        toQuestion: 10,
        operations: ['+', '-', '×'],
        minNumber: 2,
        maxNumber: 50,
      },
      {
        // 終盤（問11-15）: 大きい数 + かけ算・わり算
        fromQuestion: 11,
        toQuestion: 15,
        operations: ['+', '-', '×', '÷'],
        minNumber: 3,
        maxNumber: 99,
      },
    ],
  },
};

export default game;
