// =============================================================================
// 分数ガンマン (算数, 小2-小5)
// =============================================================================
//
// 円グラフで表示される分数を見て、正しい分数を4択から撃ち抜くゲーム。
// 前半は基本的な分数、後半は紛らわしい選択肢で難易度UP。
//
// =============================================================================

import type { GameWithTemplate } from '@/types';

const game: GameWithTemplate = {
  id: 'fraction-gunman-01',
  title: '分数ガンマン',
  category: '算数',
  grade_min: 2,
  grade_max: 5,
  skill_tags: {
    思考力: 4,
    探究力: 3,
    創造力: 2,
  },
  description:
    '円グラフに表示される分数をすばやく見抜いて撃ち抜け！制限時間内に正しい分数を選んで、すべての的を破壊しよう。前半はかんたん、後半はむずかしくなるぞ！',
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
    type: 'fraction',
    questions: [
      // --- 前半: 基本分数 ---
      {
        numerator: 1,
        denominator: 2,
        choices: ['1/2', '1/3', '1/4', '2/3'],
        correct_answer_index: 0,
        explanation:
          '円を2つに分けた1つ分が 1/2（にぶんのいち）です。半分とも言います。',
        time_limit: 15,
      },
      {
        numerator: 1,
        denominator: 4,
        choices: ['1/2', '1/3', '1/4', '1/5'],
        correct_answer_index: 2,
        explanation:
          '円を4つに分けた1つ分が 1/4（よんぶんのいち）です。ケーキを4等分した1つ分と同じですね。',
        time_limit: 15,
      },
      {
        numerator: 3,
        denominator: 4,
        choices: ['2/3', '3/4', '1/2', '4/5'],
        correct_answer_index: 1,
        explanation:
          '円を4つに分けた3つ分が 3/4（よんぶんのさん）です。1/4 が3個分ですね。',
        time_limit: 15,
      },
      {
        numerator: 1,
        denominator: 3,
        choices: ['1/2', '1/4', '1/3', '2/3'],
        correct_answer_index: 2,
        explanation:
          '円を3つに分けた1つ分が 1/3（さんぶんのいち）です。ピザを3等分した1切れ分です。',
        time_limit: 15,
      },
      {
        numerator: 2,
        denominator: 3,
        choices: ['1/3', '3/4', '2/3', '1/2'],
        correct_answer_index: 2,
        explanation:
          '円を3つに分けた2つ分が 2/3（さんぶんのに）です。半分よりも多く塗られていますね。',
        time_limit: 15,
      },
      // --- 後半: やや複雑 ---
      {
        numerator: 2,
        denominator: 5,
        choices: ['1/5', '2/5', '3/5', '1/4'],
        correct_answer_index: 1,
        explanation:
          '円を5つに分けた2つ分が 2/5（ごぶんのに）です。半分より少し少ないですね。',
        time_limit: 18,
      },
      {
        numerator: 3,
        denominator: 8,
        choices: ['1/4', '3/8', '1/3', '2/5'],
        correct_answer_index: 1,
        explanation:
          '円を8つに分けた3つ分が 3/8（はちぶんのさん）です。8つの目盛りのうち3つが塗られています。',
        time_limit: 18,
      },
      {
        numerator: 5,
        denominator: 6,
        choices: ['4/5', '3/4', '5/6', '7/8'],
        correct_answer_index: 2,
        explanation:
          '円を6つに分けた5つ分が 5/6（ろくぶんのご）です。ほとんど全部が塗られていますね！',
        time_limit: 18,
      },
      {
        numerator: 3,
        denominator: 5,
        choices: ['2/3', '3/5', '1/2', '3/4'],
        correct_answer_index: 1,
        explanation:
          '円を5つに分けた3つ分が 3/5（ごぶんのさん）です。半分より少し多いですね。',
        time_limit: 20,
      },
      {
        numerator: 5,
        denominator: 8,
        choices: ['3/4', '5/8', '2/3', '4/7'],
        correct_answer_index: 1,
        explanation:
          '円を8つに分けた5つ分が 5/8（はちぶんのご）です。半分(4/8)より1つ分多いですね。',
        time_limit: 20,
      },
    ],
  },
};

export default game;
