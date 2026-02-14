// =============================================================================
// 探究教室 TRAIL - サンプルゲームデータ
// =============================================================================

import type {
  GameWithTemplate,
  SubjectCategory,
  SkillScores,
  ScoreDisplayConfig,
  QuizTemplate,
  CardTemplate,
  MazeTemplate,
  SimulationTemplate,
  PuzzleTemplate,
} from '@/types';

// -----------------------------------------------------------------------------
// 1. Quiz: 歴史人物クイズ (社会, 小3-小6)
// -----------------------------------------------------------------------------

export const historyQuizGame: GameWithTemplate = {
  id: 'history-quiz-01',
  title: '歴史人物クイズ',
  category: '社会' as SubjectCategory,
  grade_min: 3,
  grade_max: 6,
  skill_tags: {
    思考力: 4,
    探究力: 3,
    創造力: 2,
  } as SkillScores,
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
  } as ScoreDisplayConfig,
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
  } as QuizTemplate,
};

// -----------------------------------------------------------------------------
// 2. Card: 元素カードバトル (理科, 中1-中3)
// -----------------------------------------------------------------------------

export const elementCardGame: GameWithTemplate = {
  id: 'element-card-01',
  title: '元素カードバトル',
  category: '理科' as SubjectCategory,
  grade_min: 7,
  grade_max: 9,
  skill_tags: {
    思考力: 5,
    探究力: 4,
    創造力: 3,
  } as SkillScores,
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
  } as ScoreDisplayConfig,
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
  } as CardTemplate,
};

// -----------------------------------------------------------------------------
// 3. Maze: 江戸時代タイムトラベル (社会, 小4-中1)
// -----------------------------------------------------------------------------

export const edoMazeGame: GameWithTemplate = {
  id: 'edo-maze-01',
  title: '江戸時代タイムトラベル',
  category: '社会' as SubjectCategory,
  grade_min: 4,
  grade_max: 7,
  skill_tags: {
    思考力: 3,
    探究力: 5,
    創造力: 4,
  } as SkillScores,
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
  } as ScoreDisplayConfig,
  template: {
    type: 'maze',
    width: 8,
    height: 8,
    start: { x: 0, y: 0 },
    goal: { x: 7, y: 7 },
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 5, y: 0 },
      { x: 5, y: 1 },
      { x: 5, y: 3 },
      { x: 0, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 5 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },
      { x: 6, y: 4 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
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
  } as MazeTemplate,
};

// -----------------------------------------------------------------------------
// 4. Simulation: エコタウンをつくろう (理科, 小4-小6)
// -----------------------------------------------------------------------------

export const ecoSimGame: GameWithTemplate = {
  id: 'eco-sim-01',
  title: 'エコタウンをつくろう',
  category: '理科' as SubjectCategory,
  grade_min: 4,
  grade_max: 6,
  skill_tags: {
    思考力: 4,
    探究力: 4,
    創造力: 5,
  } as SkillScores,
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
  } as ScoreDisplayConfig,
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
  } as SimulationTemplate,
};

// -----------------------------------------------------------------------------
// 5. Puzzle: 数字パターンパズル (算数, 小2-小4)
// -----------------------------------------------------------------------------

export const numberPuzzleGame: GameWithTemplate = {
  id: 'number-puzzle-01',
  title: '数字パターンパズル',
  category: '算数' as SubjectCategory,
  grade_min: 2,
  grade_max: 4,
  skill_tags: {
    思考力: 5,
    探究力: 3,
    創造力: 4,
  } as SkillScores,
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
  } as ScoreDisplayConfig,
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
  } as PuzzleTemplate,
};

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

/** All sample games */
export const sampleGames: GameWithTemplate[] = [
  historyQuizGame,
  elementCardGame,
  edoMazeGame,
  ecoSimGame,
  numberPuzzleGame,
];

/** Map for quick lookup by ID */
export const sampleGamesMap = new Map<string, GameWithTemplate>(
  sampleGames.map((game) => [game.id, game])
);

/** Helper to get grade label from numeric value */
export function getGradeLabel(gradeNum: number): string {
  if (gradeNum >= 1 && gradeNum <= 6) return `小${gradeNum}`;
  if (gradeNum >= 7 && gradeNum <= 9) return `中${gradeNum - 6}`;
  if (gradeNum >= 10 && gradeNum <= 12) return `高${gradeNum - 9}`;
  return `${gradeNum}`;
}

/** Helper to get grade range string */
export function getGradeRange(min: number, max: number): string {
  return `${getGradeLabel(min)}〜${getGradeLabel(max)}`;
}

/** Category color mapping */
export const categoryColors: Record<SubjectCategory, { bg: string; text: string; gradient: string }> = {
  理科: { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-400 to-teal-500' },
  社会: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-400 to-orange-500' },
  算数: { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-400 to-teal-500' },
  美術: { bg: 'bg-pink-100', text: 'text-pink-700', gradient: 'from-pink-400 to-rose-500' },
};
