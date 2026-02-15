// =============================================================================
// 歴史人物クイズ (社会, 小3-小6)
// =============================================================================

import type { GameWithTemplate } from '@/types';

const game: GameWithTemplate = {
  id: 'history-quiz-01',
  title: '歴史人物クイズ',
  category: '社会',
  grade_min: 3,
  grade_max: 6,
  skill_tags: {
    思考力: 4,
    探究力: 3,
    創造力: 2,
  },
  description:
    '日本の歴史に名を残した偉人たちについてのクイズに挑戦しよう！織田信長、聖徳太子、紫式部など、教科書に出てくる人物の功績やエピソードを楽しく学べます。',
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
    type: 'quiz',
    questions: [
      {
        question: '「鳴くよウグイス平安京」で知られる平安京に都を移した天皇は誰でしょう？',
        choices: ['聖武天皇', '桓武天皇', '天智天皇', '推古天皇'],
        correct_answer_index: 1,
        explanation:
          '桓武天皇は794年に都を平安京（現在の京都）に移しました。「鳴くよ(794)ウグイス平安京」という語呂合わせで覚えられます。',
        time_limit: 30,
      },
      {
        question: '「源氏物語」を書いた人物は誰でしょう？',
        choices: ['清少納言', '紫式部', '小野小町', '和泉式部'],
        correct_answer_index: 1,
        explanation:
          '紫式部は平安時代中期の女性作家で、世界最古の長編小説とも言われる「源氏物語」を書きました。',
        time_limit: 30,
      },
      {
        question: '織田信長が今川義元を倒した戦いの名前は？',
        choices: ['関ヶ原の戦い', '桶狭間の戦い', '長篠の戦い', '川中島の戦い'],
        correct_answer_index: 1,
        explanation:
          '1560年の桶狭間の戦いで、織田信長は少数の兵で今川義元の大軍を破りました。この勝利が信長の天下統一への第一歩となりました。',
        time_limit: 30,
      },
      {
        question: '聖徳太子が定めた、役人の心構えを示した決まりは何でしょう？',
        choices: ['御成敗式目', '十七条の憲法', '大宝律令', '武家諸法度'],
        correct_answer_index: 1,
        explanation:
          '聖徳太子は604年に十七条の憲法を制定し、役人が守るべき道徳や心構えを示しました。「和を以て貴しとなす」が有名です。',
        time_limit: 30,
      },
      {
        question: '江戸幕府を開いた人物は誰でしょう？',
        choices: ['豊臣秀吉', '徳川家康', '武田信玄', '伊達政宗'],
        correct_answer_index: 1,
        explanation:
          '徳川家康は1603年に江戸（現在の東京）に幕府を開きました。江戸幕府は約260年間続き、日本に長い平和の時代をもたらしました。',
        time_limit: 30,
      },
    ],
  },
};

export default game;
