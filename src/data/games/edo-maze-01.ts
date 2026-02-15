// =============================================================================
// 江戸時代タイムトラベル (社会, 小4-中1)
// =============================================================================

import type { GameWithTemplate } from '@/types';

const game: GameWithTemplate = {
  id: 'edo-maze-01',
  title: '江戸時代タイムトラベル',
  category: '社会',
  grade_min: 4,
  grade_max: 7,
  skill_tags: {
    思考力: 3,
    探究力: 5,
    創造力: 4,
  },
  description:
    '江戸時代にタイムスリップ！迷路を進みながら、各チェックポイントでクイズに答えて江戸の文化や生活について学ぼう。寺子屋、歌舞伎、参勤交代など、江戸時代の暮らしが体験できます。',
  thumbnail_url: '',
  score_display_config: {
    type: 'title',
    rules: [
      { min_percent: 90, label: '江戸博士', color: '#FFD700' },
      { min_percent: 70, label: '江戸名人', color: '#C0C0C0' },
      { min_percent: 50, label: '江戸町人', color: '#CD7F32' },
      { min_percent: 25, label: '江戸見習い', color: '#4A90D9' },
      { min_percent: 0, label: '江戸旅人', color: '#888888' },
    ],
  },
  template: {
    type: 'maze',
    width: 8,
    height: 8,
    start: { x: 0, y: 0 },
    goal: { x: 7, y: 7 },
    walls: [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 2 },
      { x: 3, y: 3 }, { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 3 },
      { x: 0, y: 4 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 4, y: 5 },
      { x: 4, y: 6 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 },
    ],
    checkpoints: [
      {
        question: '江戸時代に子どもたちが読み書きを学んだ場所を何と言う？',
        choices: ['塾', '寺子屋', '学校', '私塾'],
        correct_answer_index: 1,
        explanation:
          '寺子屋はお寺のお坊さんが子どもたちに読み書きやそろばんを教えた場所です。江戸時代の識字率は世界でもトップクラスでした。',
        time_limit: 30,
      },
      {
        question: '参勤交代とは、大名が何と何を行き来する制度？',
        choices: ['京都と大阪', '江戸と自分の領地', '江戸と京都', '大阪と自分の領地'],
        correct_answer_index: 1,
        explanation:
          '参勤交代は大名が一年おきに江戸と自分の領地を往復する制度で、徳川幕府が大名の力を抑えるために行いました。',
        time_limit: 30,
      },
      {
        question: '江戸時代に人気だった演劇で、派手な化粧と演技が特徴的なものは？',
        choices: ['能', '歌舞伎', '狂言', '人形浄瑠璃'],
        correct_answer_index: 1,
        explanation:
          '歌舞伎は江戸時代に町人文化として大人気でした。華やかな衣装や化粧、大胆な演技が特徴です。',
        time_limit: 30,
      },
      {
        question: '江戸時代に発達した、木版で刷られたカラフルな絵を何という？',
        choices: ['水墨画', '浮世絵', '日本画', '屏風絵'],
        correct_answer_index: 1,
        explanation:
          '浮世絵は木版画の技術で大量に刷られ、庶民にも手が届く価格で楽しまれました。葛飾北斎の「富嶽三十六景」が有名です。',
        time_limit: 30,
      },
      {
        question: '江戸時代、鎖国中にも日本と貿易していた唯一のヨーロッパの国は？',
        choices: ['イギリス', 'スペイン', 'オランダ', 'ポルトガル'],
        correct_answer_index: 2,
        explanation:
          'オランダは長崎の出島を通じて、鎖国中も日本と貿易を続けました。オランダを通じて西洋の学問（蘭学）も日本に伝わりました。',
        time_limit: 30,
      },
      {
        question: '江戸時代の身分制度で、武士の次に位置づけられていたのは？',
        choices: ['商人', '農民', '職人', '町人'],
        correct_answer_index: 1,
        explanation:
          '士農工商の身分制度では、武士・農民・職人・商人の順でした。農民は米を作る重要な役割を担っていたため、商人より上に位置づけられていました。',
        time_limit: 30,
      },
    ],
  },
};

export default game;
