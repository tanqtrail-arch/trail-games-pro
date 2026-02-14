// =============================================================================
// 探究教室 TRAIL - 型定義
// =============================================================================

// -----------------------------------------------------------------------------
// 基本ユニオン型・列挙型
// -----------------------------------------------------------------------------

/** 教科カテゴリ */
export type SubjectCategory = '理科' | '社会' | '算数' | '美術';

/** ユーザーの役割 */
export type UserRole = 'child' | 'parent';

/** 料金プラン */
export type PlanType = 'free' | 'monitor' | 'paid';

/** 学年（小学1年〜高校3年） */
export type Grade =
  | '小1' | '小2' | '小3' | '小4' | '小5' | '小6'
  | '中1' | '中2' | '中3'
  | '高1' | '高2' | '高3';

/** スコア表示のタイプ */
export type ScoreDisplayType = 'rank' | 'points' | 'stars' | 'title';

/** フィードバックの種類 */
export type FeedbackType = 'game_review' | 'nps' | 'feature_request' | 'churn_reason';

/** ゲームテンプレートの種類 */
export type GameTemplateType = 'quiz' | 'card' | 'maze' | 'simulation' | 'puzzle';

/** セッションの流入元 */
export type SessionSource = 'direct' | 'dashboard' | 'recommendation' | 'share' | 'notification';

// -----------------------------------------------------------------------------
// スキルスコア
// -----------------------------------------------------------------------------

/**
 * スキルスコア
 * 各スキルの評価値（1〜5）を保持する。
 * ゲームごとのスキル配点やユーザーの獲得スキルに使用。
 */
export interface SkillScores {
  /** 論理的思考・分析力 */
  思考力: number;
  /** 問いを立て調べる力 */
  探究力: number;
  /** 新しいものを生み出す力 */
  創造力: number;
}

// -----------------------------------------------------------------------------
// ユーザー
// -----------------------------------------------------------------------------

/**
 * ユーザー情報
 * 子ども（child）または保護者（parent）のアカウントを表す。
 * Supabase Auth のユーザーIDと紐づく。
 */
export interface User {
  /** UUID（Supabase Auth のユーザーID） */
  id: string;
  /** メールアドレス */
  email: string;
  /** 表示名 */
  name: string;
  /** 学年（小1〜高3） */
  grade: Grade;
  /** 役割（子ども or 保護者） */
  role: UserRole;
  /** 保護者のユーザーID（子どもアカウントの場合） */
  parent_id: string | null;
  /** レベル（1〜99） */
  level: number;
  /** 経験値（累計） */
  xp: number;
  /** 料金プラン */
  plan_type: PlanType;
  /** 累計プレイ時間（秒） */
  total_play_time: number;
  /** アカウント作成日時（ISO 8601） */
  created_at: string;
}

// -----------------------------------------------------------------------------
// スコア表示設定
// -----------------------------------------------------------------------------

/** スコア表示ルール（しきい値ごとのラベルと色） */
export interface ScoreDisplayRule {
  /** 最低パーセント（0〜100） */
  min_percent: number;
  /** 表示ラベル（例: "S", "A", "★★★"） */
  label: string;
  /** 表示色（CSS カラーコード） */
  color: string;
}

/**
 * スコア表示設定
 * ゲーム完了時にスコアをどのように表示するかを定義する。
 */
export interface ScoreDisplayConfig {
  /** 表示タイプ */
  type: ScoreDisplayType;
  /** しきい値ごとの表示ルール（min_percent 降順で評価） */
  rules: ScoreDisplayRule[];
  /** 星表示の場合の最大星数（type が "stars" のときのみ使用） */
  max_stars?: number;
}

// -----------------------------------------------------------------------------
// ゲーム
// -----------------------------------------------------------------------------

/**
 * ゲーム定義
 * プラットフォームに登録されたゲームのメタデータ。
 * id は "history-quiz-03" のような文字列識別子。
 */
export interface Game {
  /** ゲームID（例: "history-quiz-03"） */
  id: string;
  /** ゲームタイトル */
  title: string;
  /** 教科カテゴリ */
  category: SubjectCategory;
  /** 対象学年の下限（数値: 1=小1, 7=中1, 10=高1） */
  grade_min: number;
  /** 対象学年の上限（数値: 6=小6, 9=中3, 12=高3） */
  grade_max: number;
  /** ゲームで育成されるスキルの配点（各1〜5） */
  skill_tags: SkillScores;
  /** ゲームの説明文 */
  description: string;
  /** サムネイル画像のURL */
  thumbnail_url: string;
  /** スコア表示設定 */
  score_display_config: ScoreDisplayConfig;
}

// -----------------------------------------------------------------------------
// 問題の詳細結果
// -----------------------------------------------------------------------------

/**
 * 問題ごとの回答結果
 * ゲーム内の各問題に対する正誤と所要時間を記録する。
 */
export interface QuestionDetail {
  /** 問題番号（1始まり） */
  question: number;
  /** 正解したかどうか */
  correct: boolean;
  /** 回答にかかった時間（秒） */
  time_seconds: number;
}

// -----------------------------------------------------------------------------
// ゲームスコア
// -----------------------------------------------------------------------------

/**
 * ゲームスコア
 * ユーザーが1回のプレイで獲得したスコアの記録。
 */
export interface GameScore {
  /** スコアレコードのID（UUID） */
  id: string;
  /** プレイしたユーザーのID */
  user_id: string;
  /** プレイしたゲームのID */
  game_id: string;
  /** 獲得スコア */
  score: number;
  /** 最大スコア（満点） */
  max_score: number;
  /** プレイ時間（秒） */
  time_seconds: number;
  /** 獲得スキルスコア */
  skills: SkillScores;
  /** 各問題の回答結果 */
  details: QuestionDetail[];
  /** プレイ日時（ISO 8601） */
  played_at: string;
}

// -----------------------------------------------------------------------------
// ゲームセッション
// -----------------------------------------------------------------------------

/**
 * ゲームセッション
 * ゲームの開始から終了までの1プレイ分のセッション情報。
 * 途中離脱の追跡にも使用する。
 */
export interface GameSession {
  /** セッションID（UUID） */
  id: string;
  /** ユーザーID */
  user_id: string;
  /** ゲームID */
  game_id: string;
  /** セッション開始日時（ISO 8601） */
  started_at: string;
  /** セッション終了日時（ISO 8601）。未完了の場合は null */
  ended_at: string | null;
  /** ゲームを最後まで完了したか */
  completed: boolean;
  /** 離脱した画面・ステップ（途中離脱時のみ） */
  drop_point: string | null;
  /** セッションの流入元 */
  source: SessionSource;
}

// -----------------------------------------------------------------------------
// ユーザーフィードバック
// -----------------------------------------------------------------------------

/**
 * ユーザーフィードバック
 * ゲームレビュー、NPS、機能リクエスト、解約理由などを記録。
 */
export interface UserFeedback {
  /** フィードバックID（UUID） */
  id: string;
  /** ユーザーID */
  user_id: string;
  /** 対象ゲームID（ゲームレビューの場合）。ゲーム非依存の場合は null */
  game_id: string | null;
  /** 評価（1〜5） */
  rating: number;
  /** コメント（自由記述） */
  comment: string;
  /** フィードバックの種類 */
  type: FeedbackType;
  /** 作成日時（ISO 8601） */
  created_at: string;
}

// -----------------------------------------------------------------------------
// レベル情報
// -----------------------------------------------------------------------------

/**
 * レベル情報
 * レベルごとの称号と必要経験値の定義。
 */
export interface LevelInfo {
  /** レベル番号（1〜99） */
  level: number;
  /** レベルの称号（例: "探究ビギナー", "探究マスター"） */
  title: string;
  /** このレベルに必要な最小XP */
  min_xp: number;
  /** 次のレベルに必要なXP（最大レベルの場合は null） */
  max_xp: number | null;
}

// -----------------------------------------------------------------------------
// プラットフォーム統計
// -----------------------------------------------------------------------------

/**
 * プラットフォーム全体の統計情報
 * 管理ダッシュボードやランディングページで表示する集計データ。
 */
export interface PlatformStats {
  /** 累計プレイヤー数 */
  totalPlayers: number;
  /** 累計プレイ時間（秒） */
  totalPlayTime: number;
  /** 本日のアクティブプレイヤー数 */
  todayPlayers: number;
  /** 登録ゲーム総数 */
  totalGames: number;
  /** プラットフォーム内の最高レベル */
  highestLevel: number;
}

// -----------------------------------------------------------------------------
// スコア送信ペイロード
// -----------------------------------------------------------------------------

/**
 * スコア送信ペイロード
 * ゲーム（iframe）からスコアAPIに送信されるデータ。
 * user_id と played_at はサーバー側で付与されるため含まない。
 */
export interface ScoreSubmission {
  /** ゲームID */
  game_id: string;
  /** 獲得スコア */
  score: number;
  /** 最大スコア（満点） */
  max_score: number;
  /** プレイ時間（秒） */
  time_seconds: number;
  /** 獲得スキルスコア */
  skills: SkillScores;
  /** 各問題の回答結果 */
  details: QuestionDetail[];
}

// -----------------------------------------------------------------------------
// ゲームテンプレート定義
// -----------------------------------------------------------------------------

/**
 * クイズの1問分の定義
 */
export interface QuizQuestion {
  /** 問題文 */
  question: string;
  /** 選択肢の配列 */
  choices: string[];
  /** 正解の選択肢インデックス（0始まり） */
  correct_answer_index: number;
  /** 正解時の解説 */
  explanation: string;
  /** 制限時間（秒） */
  time_limit: number;
}

/**
 * クイズテンプレート
 * 択一問題形式のゲーム用テンプレート。
 */
export interface QuizTemplate {
  /** テンプレート種別 */
  type: 'quiz';
  /** 問題の配列 */
  questions: QuizQuestion[];
}

/**
 * カード1枚分の定義
 */
export interface Card {
  /** カードの表面テキストまたは画像URL */
  front: string;
  /** カードの裏面テキストまたは画像URL */
  back: string;
}

/** カードのマッチングルール */
export type CardMatchRule = 'exact' | 'pair_id' | 'category';

/**
 * カードテンプレート
 * 神経衰弱やマッチングゲーム用テンプレート。
 */
export interface CardTemplate {
  /** テンプレート種別 */
  type: 'card';
  /** カードの配列 */
  cards: Card[];
  /** ペアの数 */
  pairs: number;
  /** マッチングルール */
  match_rules: CardMatchRule;
}

/**
 * 迷路テンプレート
 * 迷路形式のゲーム用テンプレート。
 */
export interface MazeTemplate {
  /** テンプレート種別 */
  type: 'maze';
  /** 迷路の幅（セル数） */
  width: number;
  /** 迷路の高さ（セル数） */
  height: number;
  /** スタート座標 */
  start: { x: number; y: number };
  /** ゴール座標 */
  goal: { x: number; y: number };
  /** 壁の配列（セル座標のペア） */
  walls: Array<{ x: number; y: number }>;
  /** 途中に配置するクイズ */
  checkpoints?: QuizQuestion[];
}

/**
 * シミュレーションテンプレート
 * シミュレーション形式のゲーム用テンプレート。
 */
export interface SimulationTemplate {
  /** テンプレート種別 */
  type: 'simulation';
  /** シミュレーションのシナリオ名 */
  scenario: string;
  /** 初期パラメータ */
  initial_params: Record<string, number>;
  /** ステップ数の上限 */
  max_steps: number;
  /** 成功条件の定義 */
  success_conditions: Record<string, number>;
}

/**
 * パズルテンプレート
 * パズル形式のゲーム用テンプレート。
 */
export interface PuzzleTemplate {
  /** テンプレート種別 */
  type: 'puzzle';
  /** パズルの種類 */
  puzzle_type: string;
  /** ピース数 */
  pieces: number;
  /** 正解の配置（順序や座標） */
  solution: Array<number | string>;
  /** ヒントの配列 */
  hints?: string[];
}

/**
 * ゲームテンプレートのユニオン型
 * type フィールドによって判別可能なディスクリミネーテッドユニオン。
 */
export type GameTemplate =
  | QuizTemplate
  | CardTemplate
  | MazeTemplate
  | SimulationTemplate
  | PuzzleTemplate;

// -----------------------------------------------------------------------------
// ゲーム定義（テンプレート付き）
// -----------------------------------------------------------------------------

/**
 * ゲーム定義（テンプレートデータ含む）
 * Game のメタデータにテンプレートの実データを結合した型。
 * ゲーム一覧からは Game を、実際のプレイ画面では GameWithTemplate を使用する。
 */
export interface GameWithTemplate extends Game {
  /** ゲームのテンプレートデータ */
  template: GameTemplate;
}

// -----------------------------------------------------------------------------
// API レスポンス型
// -----------------------------------------------------------------------------

/** API 成功レスポンスの汎用型 */
export interface ApiResponse<T> {
  /** 成功フラグ */
  success: true;
  /** レスポンスデータ */
  data: T;
}

/** API エラーレスポンスの汎用型 */
export interface ApiErrorResponse {
  /** 成功フラグ */
  success: false;
  /** エラーメッセージ */
  error: string;
  /** エラーコード（任意） */
  code?: string;
}

/** API レスポンスのユニオン型 */
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// -----------------------------------------------------------------------------
// ランキング
// -----------------------------------------------------------------------------

/** ランキングエントリ */
export interface RankingEntry {
  /** 順位 */
  rank: number;
  /** ユーザーID */
  user_id: string;
  /** ユーザー名 */
  user_name: string;
  /** スコア */
  score: number;
  /** プレイ日時（ISO 8601） */
  played_at: string;
}

// -----------------------------------------------------------------------------
// postMessage 通信型
// -----------------------------------------------------------------------------

/**
 * ゲーム iframe からホストへの postMessage イベント型
 * iframe 内のゲームがプラットフォームへ送信するメッセージ。
 */
export type GamePostMessage =
  | { type: 'GAME_READY' }
  | { type: 'GAME_STARTED' }
  | { type: 'GAME_COMPLETED'; payload: ScoreSubmission }
  | { type: 'GAME_ERROR'; payload: { message: string; code?: string } }
  | { type: 'GAME_PROGRESS'; payload: { current: number; total: number } };

/**
 * ホストからゲーム iframe への postMessage イベント型
 */
export type HostPostMessage =
  | { type: 'INIT_GAME'; payload: { user_id: string; game_id: string; template: GameTemplate } }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' };
