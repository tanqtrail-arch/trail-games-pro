// =============================================================================
// 数字パターンパズル (算数, 小2-小4)
// =============================================================================

import type { GameWithTemplate } from '@/types';

const game: GameWithTemplate = {
  id: 'number-puzzle-01',
  title: '数字パターンパズル',
  category: '算数',
  grade_min: 2,
  grade_max: 4,
  skill_tags: {
    思考力: 5,
    探究力: 3,
    創造力: 4,
  },
  description:
    '数字の並びに隠されたパターンを見つけよう！「次の数字は何？」に答えながら、数のふしぎを体験できます。規則性を見つける力が自然と身につきます。',
  thumbnail_url: '',
  score_display_config: {
    type: 'points',
    rules: [
      { min_percent: 90, label: '90点以上', color: '#FFD700' },
      { min_percent: 70, label: '70点以上', color: '#C0C0C0' },
      { min_percent: 50, label: '50点以上', color: '#CD7F32' },
      { min_percent: 0, label: '50点未満', color: '#888888' },
    ],
  },
  template: {
    type: 'puzzle',
    puzzle_type: 'number_sequence',
    pieces: 5,
    solution: [10, 15, 36, 32, 21],
    hints: [
      '2ずつ増えていくよ',
      '3の倍数になっているよ',
      '前の数を2倍にしているよ',
      '前の2つの数を足しているよ',
      '1, 3, 6, 10... 三角数だよ',
    ],
  },
};

export default game;
