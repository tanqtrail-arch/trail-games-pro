// =============================================================================
// エコタウンをつくろう (理科, 小4-小6)
// =============================================================================

import type { GameWithTemplate } from '@/types';

const game: GameWithTemplate = {
  id: 'eco-sim-01',
  title: 'エコタウンをつくろう',
  category: '理科',
  grade_min: 4,
  grade_max: 6,
  skill_tags: {
    思考力: 4,
    探究力: 4,
    創造力: 5,
  },
  description:
    'あなたは新しい町の町長！環境にやさしく、経済も発展し、住民も幸せな理想の町をつくろう。太陽光発電、リサイクル施設、公園など、どの施設を建てるかで町の未来が変わります。',
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
    type: 'simulation',
    scenario: 'エコタウン建設シミュレーション',
    initial_params: {
      環境: 50,
      経済: 50,
      住民満足度: 50,
      予算: 1000,
      人口: 100,
    },
    max_steps: 5,
    success_conditions: {
      環境: 70,
      経済: 60,
      住民満足度: 65,
    },
  },
};

export default game;
