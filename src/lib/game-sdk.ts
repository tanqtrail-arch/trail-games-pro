/**
 * TRAIL ゲームSDK
 * ゲーム終了時にスコアを送信するための軽量ライブラリ
 *
 * 使い方（テンプレート内に組み込み済み）:
 * ```typescript
 * import { submitScore } from '@/lib/game-sdk';
 * await submitScore({ game_id: "...", score: 85, max_score: 100, ... });
 * ```
 */

// ---------------------------------------------------------------------------
// 型定義
// ---------------------------------------------------------------------------

/** スキルスコア（各1〜5） */
interface SkillScores {
  /** 論理的思考・分析力 */
  思考力: number;
  /** 問いを立て調べる力 */
  探究力: number;
  /** 新しいものを生み出す力 */
  創造力: number;
}

/** 各問題の回答結果 */
interface QuestionDetail {
  /** 問題番号（1始まり） */
  question: number;
  /** 正解したかどうか */
  correct: boolean;
  /** 回答にかかった時間（秒） */
  time: number;
}

/**
 * スコア送信ペイロード
 * ゲーム完了時にAPIへ送信するデータ構造。
 */
interface ScorePayload {
  /** ゲームID（例: "history-quiz-03"） */
  game_id: string;
  /** ユーザーID（未ログインの場合は省略可） */
  user_id?: string;
  /** 学年 */
  grade?: string;
  /** 獲得スコア */
  score: number;
  /** 最大スコア（満点） */
  max_score: number;
  /** プレイ時間（秒） */
  time_seconds: number;
  /** 獲得スキルスコア */
  skills: SkillScores;
  /** 教科カテゴリ */
  subject: string;
  /** 各問題の回答結果 */
  details: QuestionDetail[];
}

/** スコア送信APIのレスポンス */
interface ScoreResponse {
  /** 成功フラグ */
  success: boolean;
  /** 作成されたスコアレコードのID */
  score_id?: string;
  /** 獲得した経験値 */
  xp_gained?: number;
  /** 更新後のレベル */
  new_level?: number | null;
  /** エラーメッセージ */
  error?: string;
}

/** ランキングパラメータ */
interface RankingParams {
  /** ゲームID（省略で全体ランキング） */
  game_id?: string;
  /** 学年でフィルタ */
  grade?: string;
  /** 期間（'daily' | 'weekly' | 'monthly' | 'all'） */
  period?: string;
  /** 取得件数（デフォルト: 20） */
  limit?: number;
}

/** ランキングエントリ */
interface RankingEntry {
  /** 順位 */
  rank: number;
  /** ユーザーID */
  user_id: string;
  /** ユーザー名 */
  name: string;
  /** スコア */
  score: number;
  /** 学年 */
  grade: number | null;
  /** レベル */
  level: number;
}

/** ランキングAPIのレスポンス */
interface RankingsResponse {
  /** ランキング一覧 */
  rankings: RankingEntry[];
  /** エラーメッセージ */
  error?: string;
}

/** プラットフォーム統計 */
interface PlatformStats {
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

// ---------------------------------------------------------------------------
// API 関数
// ---------------------------------------------------------------------------

/**
 * ゲームスコアを送信する。
 *
 * ゲーム完了時に呼び出し、スコアをサーバーに記録する。
 * ログイン済みユーザーの場合は XP とレベルも自動更新される。
 *
 * @param payload - スコア送信データ
 * @returns スコア送信結果（score_id, xp_gained, new_level）
 * @throws スコア送信に失敗した場合
 *
 * @example
 * ```typescript
 * const result = await submitScore({
 *   game_id: "science-quiz-01",
 *   score: 85,
 *   max_score: 100,
 *   time_seconds: 120,
 *   skills: { 思考力: 4, 探究力: 3, 創造力: 2 },
 *   subject: "理科",
 *   details: [
 *     { question: 1, correct: true, time: 15 },
 *     { question: 2, correct: false, time: 30 },
 *   ],
 * });
 * console.log(`獲得XP: ${result.xp_gained}`);
 * ```
 */
export async function submitScore(payload: ScorePayload): Promise<ScoreResponse> {
  const response = await fetch("/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "不明なエラー" }));
    throw new Error(error.message || error.error || "スコア送信に失敗しました");
  }

  return response.json();
}

/**
 * ランキング情報を取得する。
 *
 * ゲーム別または全体のランキングを取得する。
 * 期間や学年でフィルタリングが可能。
 *
 * @param params - ランキング取得パラメータ
 * @returns ランキング一覧
 *
 * @example
 * ```typescript
 * // ゲーム別の週間ランキング（上位10件）
 * const rankings = await fetchRankings({
 *   game_id: "science-quiz-01",
 *   period: "weekly",
 *   limit: 10,
 * });
 * rankings.rankings.forEach(entry => {
 *   console.log(`${entry.rank}位: ${entry.name} - ${entry.score}点`);
 * });
 * ```
 */
export async function fetchRankings(params: RankingParams): Promise<RankingsResponse> {
  const searchParams = new URLSearchParams();

  if (params.game_id) searchParams.set("game_id", params.game_id);
  if (params.grade) searchParams.set("grade", params.grade);
  if (params.period) searchParams.set("period", params.period);
  if (params.limit) searchParams.set("limit", String(params.limit));

  const response = await fetch(`/api/rankings?${searchParams}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "不明なエラー" }));
    throw new Error(error.message || error.error || "ランキング取得に失敗しました");
  }

  return response.json();
}

/**
 * プラットフォーム全体の統計情報を取得する。
 *
 * ランディングページやダッシュボードで表示する集計データを取得する。
 *
 * @returns プラットフォーム統計情報
 *
 * @example
 * ```typescript
 * const stats = await fetchPlatformStats();
 * console.log(`累計プレイヤー数: ${stats.totalPlayers}人`);
 * console.log(`本日のアクティブ: ${stats.todayPlayers}人`);
 * ```
 */
export async function fetchPlatformStats(): Promise<PlatformStats> {
  const response = await fetch("/api/stats");

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "不明なエラー" }));
    throw new Error(error.message || error.error || "統計情報の取得に失敗しました");
  }

  return response.json();
}
