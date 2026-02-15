// =============================================================================
// 江戸時代タイムトラベル (社会, 小4-中1)
// グラフ形式の迷路 + チェックポイントクイズ
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

  // ---------------------------------------------------------------------------
  // グラフ形式の迷路データ
  // ---------------------------------------------------------------------------
  template: {
    type: 'maze',
    startNode: 'start',
    goalNode: 'goal',

    nodes: [
      // ── 起点 ──
      {
        id: 'start',
        text: '突然、目の前に光の渦が現れた！気がつくと、そこは江戸時代の街並み。さあ、江戸の町を探検して現代に帰る方法を見つけよう！',
      },

      // ── 中継地点（クイズなし） ──
      {
        id: 'nihonbashi',
        text: '江戸の中心、日本橋に到着！五街道の起点であるこの橋は、多くの商人や旅人が行き交うにぎやかな場所だ。どの道を進もうか？',
      },
      {
        id: 'senso-ji',
        text: '大きな赤い提灯が目印の浅草寺。仲見世通りには団子や煎餅など美味しそうなお店がずらり。お参りする人々でにぎわっている。',
      },
      {
        id: 'uokashi',
        text: '新鮮な魚がところ狭しと並ぶ魚河岸。「へい、いらっしゃい！」と威勢のいい掛け声が飛び交っている。ここは江戸の台所だ！',
      },

      // ── チェックポイント（クイズあり） ──
      {
        id: 'terakoya',
        text: '子どもたちが元気に読み書きの練習をしている寺子屋を発見！先生のお坊さんが優しく教えている。',
        question:
          '寺子屋で子どもたちが最初に使う教科書として広く使われていたものは？',
        choices: ['源氏物語', '往来物（おうらいもの）', '古事記', '万葉集'],
        correctIndex: 1,
      },
      {
        id: 'nagaya',
        text: '庶民が暮らす長屋の通り。洗濯物が干してあり、井戸端で楽しそうにおしゃべりする人たちの姿が見える。',
        question:
          '江戸時代の長屋で、住民たちが共同で使っていた設備はどれ？',
        choices: [
          'お風呂と台所',
          '井戸とトイレ',
          '書斎と茶室',
          '馬小屋と倉庫',
        ],
        correctIndex: 1,
      },
      {
        id: 'edo-castle',
        text: '堂々とした石垣と美しいお堀に囲まれた江戸城！将軍様が住む日本一のお城だ。門番の侍がこちらをにらんでいる。',
        question: '江戸城を居城として江戸幕府を開いた人物は誰？',
        choices: ['豊臣秀吉', '織田信長', '徳川家康', '武田信玄'],
        correctIndex: 2,
      },
      {
        id: 'kabuki',
        text: '派手な看板と太鼓の音！歌舞伎の公演が始まるようだ。桟敷席からは大きな歓声が聞こえてくる。',
        question:
          '歌舞伎で、役者が目を寄せて大きくにらむ見せ場の演出を何という？',
        choices: [
          '六方（ろっぽう）',
          '見得（みえ）',
          '花道（はなみち）',
          '黒子（くろこ）',
        ],
        correctIndex: 1,
      },
      {
        id: 'ukiyoe',
        text: '色鮮やかな版画が所狭しと並ぶ工房。職人たちが丁寧に版木を彫り、一枚一枚刷り上げている。',
        question: '「富嶽三十六景」で世界的に有名な浮世絵師は誰？',
        choices: ['歌川広重', '喜多川歌麿', '葛飾北斎', '東洲斎写楽'],
        correctIndex: 2,
      },
      {
        id: 'daimyo',
        text: '立派な門構えの大名屋敷。参勤交代で江戸に来ている大名が住んでいるようだ。家来たちが忙しそうに動き回っている。',
        question:
          '参勤交代で大名が江戸に住む期間は、原則としてどのくらい？',
        choices: ['3ヶ月', '半年', '1年', '2年'],
        correctIndex: 2,
      },
      {
        id: 'dejima',
        text: '長崎の出島まで来た！扇形の小さな島に外国人の姿が見える。日本で唯一、外の世界とつながっている場所だ。',
        question:
          '鎖国中にも出島で日本と貿易を続けていた唯一のヨーロッパの国は？',
        choices: ['イギリス', 'スペイン', 'オランダ', 'ポルトガル'],
        correctIndex: 2,
      },
      {
        id: 'rangaku',
        text: 'オランダ語の書物がたくさん並ぶ蘭学塾。医学や天文学を熱心に学ぶ人々の姿がある。新しい知識への情熱を感じる。',
        question:
          '杉田玄白らがオランダの医学書を翻訳して出版した書物は？',
        choices: ['蘭学事始', '解体新書', '養生訓', '医心方'],
        correctIndex: 1,
      },

      // ── ゴール ──
      {
        id: 'goal',
        text: '江戸時代の知識をたくさん集めたおかげで、タイムスリップの扉が開いた！無事に現代に帰れるぞ！',
      },
    ],

    edges: [
      // start → 日本橋（唯一の入口）
      { from: 'start', to: 'nihonbashi', label: '光の渦の先へ進む...' },

      // 日本橋 → 3方向に分岐
      {
        from: 'nihonbashi',
        to: 'terakoya',
        label: '路地裏から子どもたちの声が...',
      },
      {
        from: 'nihonbashi',
        to: 'senso-ji',
        label: 'にぎやかな方へ歩いてみよう',
      },
      {
        from: 'nihonbashi',
        to: 'edo-castle',
        label: 'お城の方角へ向かう',
      },

      // 寺子屋ルート
      { from: 'terakoya', to: 'nagaya', label: '長屋の通りへ出る' },
      { from: 'terakoya', to: 'senso-ji', label: '大通りに戻る' },

      // 浅草寺ルート
      { from: 'senso-ji', to: 'kabuki', label: '太鼓の音がする方へ' },
      { from: 'senso-ji', to: 'uokashi', label: '市場のにおいに誘われて' },

      // 長屋ルート
      { from: 'nagaya', to: 'ukiyoe', label: '版画の看板が見える' },
      { from: 'nagaya', to: 'uokashi', label: '市場へ買い物に' },

      // 江戸城ルート
      { from: 'edo-castle', to: 'daimyo', label: '大名屋敷通りへ' },
      { from: 'edo-castle', to: 'kabuki', label: '城下町を散策' },

      // 歌舞伎ルート
      { from: 'kabuki', to: 'ukiyoe', label: '浮世絵を見に行く' },

      // 魚河岸ルート
      { from: 'uokashi', to: 'dejima', label: '船で港町へ向かう' },

      // ゴールへの道（2ルート）
      { from: 'ukiyoe', to: 'goal', label: '未来への扉が光っている...' },
      { from: 'daimyo', to: 'rangaku', label: '蘭学の話を聞きに行く' },
      { from: 'daimyo', to: 'dejima', label: '港町の噂を聞いて' },
      { from: 'dejima', to: 'rangaku', label: 'オランダの学問に触れる' },
      { from: 'rangaku', to: 'goal', label: '知識を携えて未来へ！' },
    ],
  },
};

export default game;
