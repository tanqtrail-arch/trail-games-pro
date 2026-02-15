// =============================================================================
// レポート用モックデータ
// 将来的にSupabase APIから取得するデータのモック
// =============================================================================

// ---------------------------------------------------------------------------
// 経営レポート用データ
// ---------------------------------------------------------------------------

export interface BusinessWeeklyData {
  period: { start: string; end: string };
  kpis: {
    freeMembers: { current: number; previous: number; delta: number };
    paidMembers: { current: number; previous: number; delta: number };
    mrr: { current: number; previous: number };
    churnRate: { current: number; previous: number };
    newRegistrations: number;
    paidConversions: number;
  };
  dailyRegistrations: Array<{ date: string; free: number; paid: number }>;
  channelBreakdown: Array<{ channel: string; visitors: number; registrations: number; conversions: number; rate: number }>;
  topGames: Array<{ name: string; plays: number; deltaPlays: number; completion: number; rating: number }>;
  alerts: Array<{ level: 'info' | 'warning' | 'critical'; message: string }>;
}

export interface BusinessMonthlyData {
  period: string;
  kpis: {
    freeMembers: { current: number; startOfMonth: number };
    paidMembers: { current: number; startOfMonth: number };
    mrr: { current: number; startOfMonth: number };
    arr: { current: number; goal: number };
    churnRate: number;
    ltv: number;
    arpu: number;
  };
  mrrTrend: Array<{ month: string; mrr: number }>;
  cohortRetention: Array<{ cohort: string; m0: number; m1: number | null; m2: number | null; m3: number | null }>;
  channelROI: Array<{ channel: string; cost: number; registrations: number; paidConversions: number; cac: number }>;
  funnelMetrics: { pv: number; freePlay: number; registration: number; paid: number };
  gamePerformance: Array<{ name: string; plays: number; completion: number; avgScore: number; rating: number; revenue: number }>;
  actionItems: string[];
}

// ---------------------------------------------------------------------------
// 保護者レポート用データ
// ---------------------------------------------------------------------------

export interface ParentWeeklyData {
  childName: string;
  grade: string;
  level: number;
  period: { start: string; end: string };
  summary: {
    playCount: number;
    playTime: number;
    gamesPlayed: number;
    newClears: number;
  };
  skills: {
    current: { thinking: number; inquiry: number; creativity: number };
    previous: { thinking: number; inquiry: number; creativity: number };
  };
  dailyScores: Array<{ day: string; score: number; playTime: number }>;
  weakAreas: Array<{ area: string; rate: number; category: string }>;
  bestMoments: Array<{ type: string; description: string }>;
  aiComment: string;
}

export interface ParentMonthlyData {
  childName: string;
  grade: string;
  level: number;
  xp: number;
  period: string;
  skills: {
    current: { thinking: number; inquiry: number; creativity: number };
    monthAgo: { thinking: number; inquiry: number; creativity: number };
  };
  subjects: {
    current: { science: number; social: number; math: number; art: number };
    previous: { science: number; social: number; math: number; art: number };
  };
  ranking: { current: number; previous: number; total: number };
  gamesPlayed: Array<{ name: string; plays: number; bestScore: number; growth: number }>;
  monthlyAwards: Array<{ award: string; game: string; detail: string }>;
  aiSummary: string;
  parentTips: string[];
}

// ---------------------------------------------------------------------------
// モックデータ生成
// ---------------------------------------------------------------------------

export function getBusinessWeeklyData(): BusinessWeeklyData {
  return {
    period: { start: '2026年2月9日', end: '2026年2月15日' },
    kpis: {
      freeMembers: { current: 11165, previous: 11009, delta: 156 },
      paidMembers: { current: 1200, previous: 1168, delta: 32 },
      mrr: { current: 1176000, previous: 1144640 },
      churnRate: { current: 2.8, previous: 3.1 },
      newRegistrations: 156,
      paidConversions: 32,
    },
    dailyRegistrations: [
      { date: '2/9(月)', free: 20, paid: 4 },
      { date: '2/10(火)', free: 18, paid: 3 },
      { date: '2/11(水)', free: 25, paid: 6 },
      { date: '2/12(木)', free: 22, paid: 5 },
      { date: '2/13(金)', free: 19, paid: 4 },
      { date: '2/14(土)', free: 28, paid: 5 },
      { date: '2/15(日)', free: 24, paid: 5 },
    ],
    channelBreakdown: [
      { channel: 'SNS (X/Instagram)', visitors: 4200, registrations: 55, conversions: 11, rate: 20.0 },
      { channel: 'Google検索', visitors: 3360, registrations: 44, conversions: 9, rate: 20.5 },
      { channel: '直接アクセス', visitors: 2640, registrations: 34, conversions: 7, rate: 20.6 },
      { channel: 'リファラル', visitors: 1800, registrations: 23, conversions: 5, rate: 21.7 },
    ],
    topGames: [
      { name: '歴史人物カードバトル', plays: 1240, deltaPlays: 180, completion: 88, rating: 4.7 },
      { name: '音楽リズムラボ', plays: 980, deltaPlays: 150, completion: 93, rating: 4.9 },
      { name: '都道府県チャレンジ', plays: 920, deltaPlays: 120, completion: 85, rating: 4.3 },
      { name: '色と光の実験室', plays: 850, deltaPlays: 110, completion: 91, rating: 4.8 },
      { name: '火山のしくみ探究', plays: 780, deltaPlays: 95, completion: 78, rating: 4.6 },
    ],
    alerts: [
      { level: 'info', message: '今週の有料転換率が20.5%で目標(15%)を上回っています' },
      { level: 'warning', message: '算数カテゴリの完走率が48%で全体平均を下回っています' },
      { level: 'info', message: 'SNSからの流入が先週比+12%で成長中です' },
    ],
  };
}

export function getBusinessMonthlyData(): BusinessMonthlyData {
  return {
    period: '2026年2月',
    kpis: {
      freeMembers: { current: 11165, startOfMonth: 10073 },
      paidMembers: { current: 1200, startOfMonth: 1020 },
      mrr: { current: 1176000, startOfMonth: 999600 },
      arr: { current: 14112000, goal: 98000000 },
      churnRate: 2.8,
      ltv: 34929,
      arpu: 980,
    },
    mrrTrend: [
      { month: '2025/10', mrr: 490000 },
      { month: '2025/11', mrr: 637000 },
      { month: '2025/12', mrr: 784000 },
      { month: '2026/01', mrr: 960400 },
      { month: '2026/02', mrr: 1176000 },
    ],
    cohortRetention: [
      { cohort: '2025/10', m0: 100, m1: 72, m2: 58, m3: 48 },
      { cohort: '2025/11', m0: 100, m1: 75, m2: 62, m3: null },
      { cohort: '2025/12', m0: 100, m1: 78, m2: null, m3: null },
      { cohort: '2026/01', m0: 100, m1: 80, m2: null, m3: null },
    ],
    channelROI: [
      { channel: 'SNS', cost: 0, registrations: 420, paidConversions: 84, cac: 0 },
      { channel: '検索(SEO)', cost: 0, registrations: 336, paidConversions: 67, cac: 0 },
      { channel: '直接', cost: 0, registrations: 264, paidConversions: 53, cac: 0 },
      { channel: 'リファラル', cost: 0, registrations: 180, paidConversions: 36, cac: 0 },
    ],
    funnelMetrics: { pv: 120000, freePlay: 12000, registration: 2400, paid: 192 },
    gamePerformance: [
      { name: '歴史人物カードバトル', plays: 7450, completion: 88, avgScore: 75, rating: 4.7, revenue: 0 },
      { name: '音楽リズムラボ', plays: 5800, completion: 93, avgScore: 82, rating: 4.9, revenue: 0 },
      { name: '都道府県チャレンジ', plays: 6230, completion: 85, avgScore: 68, rating: 4.3, revenue: 0 },
      { name: '色と光の実験室', plays: 5100, completion: 91, avgScore: 80, rating: 4.8, revenue: 0 },
      { name: '火山のしくみ探究', plays: 4520, completion: 78, avgScore: 72, rating: 4.6, revenue: 0 },
    ],
    actionItems: [
      '算数カテゴリのゲーム追加を検討（完走率48%を改善）',
      'SNSチャネルのコンテンツ投稿頻度を週3→5に増加',
      '有料転換フローのA/Bテストを実施（CTA文言変更）',
      '解約理由アンケートを月末に実施',
      'リファラルプログラムの設計を開始',
    ],
  };
}

export function getParentWeeklyData(): ParentWeeklyData {
  return {
    childName: 'ゆうた',
    grade: '小学4年生',
    level: 12,
    period: { start: '2026年2月9日', end: '2026年2月15日' },
    summary: {
      playCount: 18,
      playTime: 4.5,
      gamesPlayed: 9,
      newClears: 4,
    },
    skills: {
      current: { thinking: 78, inquiry: 85, creativity: 62 },
      previous: { thinking: 65, inquiry: 72, creativity: 58 },
    },
    dailyScores: [
      { day: '月', score: 720, playTime: 35 },
      { day: '火', score: 810, playTime: 40 },
      { day: '水', score: 680, playTime: 30 },
      { day: '木', score: 890, playTime: 45 },
      { day: '金', score: 850, playTime: 38 },
      { day: '土', score: 920, playTime: 50 },
      { day: '日', score: 870, playTime: 32 },
    ],
    weakAreas: [
      { area: '割合の計算', rate: 42, category: '算数' },
      { area: '江戸時代の文化', rate: 55, category: '社会' },
      { area: '光の性質', rate: 60, category: '理科' },
    ],
    bestMoments: [
      { type: '最高スコア', description: '歴史タイムトラベラーで920点を達成' },
      { type: '初挑戦', description: '色彩アートチャレンジに初めてチャレンジ' },
      { type: 'スコアUP', description: '生き物観察ラボで+85点の成長' },
    ],
    aiComment:
      'ゆうたくんは今週、特に探究力が大きく伸びました（先週比+13ポイント）。歴史と理科のゲームに積極的に取り組み、複数の分野を横断する「つなげて考える力」が育ってきています。一方で、算数の割合の計算にやや苦手意識が見られます。ゲーム形式で楽しく取り組める「割合マスター」を試してみてはいかがでしょうか。',
  };
}

export function getParentMonthlyData(): ParentMonthlyData {
  return {
    childName: 'ゆうた',
    grade: '小学4年生',
    level: 12,
    xp: 2450,
    period: '2026年2月',
    skills: {
      current: { thinking: 82, inquiry: 88, creativity: 68 },
      monthAgo: { thinking: 65, inquiry: 60, creativity: 55 },
    },
    subjects: {
      current: { science: 82, social: 75, math: 60, art: 68 },
      previous: { science: 70, social: 68, math: 55, art: 58 },
    },
    ranking: { current: 85, previous: 120, total: 1000 },
    gamesPlayed: [
      { name: '歴史タイムトラベラー', plays: 8, bestScore: 920, growth: 180 },
      { name: '生き物観察ラボ', plays: 6, bestScore: 910, growth: 160 },
      { name: '実験シミュレーター', plays: 5, bestScore: 880, growth: 120 },
      { name: '論理パズル王', plays: 12, bestScore: 800, growth: 90 },
      { name: '数式パズルマスター', plays: 4, bestScore: 780, growth: 70 },
    ],
    monthlyAwards: [
      { award: '最高スコア', game: '歴史タイムトラベラー', detail: '920点' },
      { award: '最多リプレイ', game: '論理パズル王', detail: '12回プレイ' },
      { award: '最大成長', game: '生き物観察ラボ', detail: '+180点UP' },
    ],
    aiSummary:
      'ゆうたくんは今月、探究力が+28ポイントと大幅に成長しました。特に理科・社会分野での成長が目覚ましく、「なぜ？」を追求する姿勢が身についてきています。全国ランキングでも35位アップし、上位8.5%に入りました。来月は算数分野を中心に取り組むことで、バランスの良い成長が期待できます。',
    parentTips: [
      '理科の成長が顕著です。科学館や博物館に一緒に行くと、ゲームで学んだことがリアルにつながります。',
      '算数の割合は、お買い物で「30%オフはいくら？」と一緒に計算すると効果的です。',
      '探究力が高いので、「なぜそう思う？」と理由を聞いてあげると、考える力がさらに伸びます。',
    ],
  };
}
