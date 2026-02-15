// =============================================================================
// 計算チャレンジ (算数, 小2-小6) — iframe外部ゲームのサンプル
// =============================================================================

import type { GameWithTemplate } from '@/types';

const game: GameWithTemplate = {
  id: 'math-iframe-01',
  title: '計算チャレンジ',
  category: '算数',
  grade_min: 2,
  grade_max: 6,
  skill_tags: {
    思考力: 4,
    探究力: 2,
    創造力: 1,
  },
  description:
    '制限時間内にたし算・ひき算・かけ算の問題に挑戦！素早く正確に答えて高スコアを目指そう。外部ゲームエンジンで動作するサンプルです。',
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
    type: 'iframe',
    url: '/games/sample-math/index.html',
  },
};

export default game;
