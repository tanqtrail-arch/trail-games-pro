// =============================================================================
// 元素カードバトル (理科, 中1-中3)
// =============================================================================

import type { GameWithTemplate } from '@/types';

const game: GameWithTemplate = {
  id: 'element-card-01',
  title: '元素カードバトル',
  category: '理科',
  grade_min: 7,
  grade_max: 9,
  skill_tags: {
    思考力: 5,
    探究力: 4,
    創造力: 3,
  },
  description:
    '元素の周期表をカードゲームで学ぼう！各元素の性質、原子番号、用途をマッチングして、化学の基礎を楽しく身につけよう。',
  thumbnail_url: '',
  score_display_config: {
    type: 'stars',
    max_stars: 5,
    rules: [
      { min_percent: 90, label: '5', color: '#FFD700' },
      { min_percent: 70, label: '4', color: '#C0C0C0' },
      { min_percent: 50, label: '3', color: '#CD7F32' },
      { min_percent: 25, label: '2', color: '#4A90D9' },
      { min_percent: 0, label: '1', color: '#888888' },
    ],
  },
  template: {
    type: 'card',
    cards: [
      { front: '水素 (H)', back: '原子番号1・最も軽い元素・水の成分' },
      { front: '酸素 (O)', back: '原子番号8・呼吸に必要・燃焼を助ける' },
      { front: '炭素 (C)', back: '原子番号6・有機物の基本・ダイヤモンドの成分' },
      { front: '窒素 (N)', back: '原子番号7・空気の約78%・肥料の原料' },
      { front: '鉄 (Fe)', back: '原子番号26・磁石に付く・血液中のヘモグロビン' },
      { front: 'ナトリウム (Na)', back: '原子番号11・食塩の成分・水と激しく反応' },
      { front: '金 (Au)', back: '原子番号79・錆びない・電気をよく通す' },
      { front: 'カルシウム (Ca)', back: '原子番号20・骨や歯の成分・牛乳に豊富' },
    ],
    pairs: 8,
    match_rules: 'pair_id',
  },
};

export default game;
