// =============================================================================
// ゲームテンプレート — 新しいゲームを作るときにこのファイルをコピーして使う
// =============================================================================
//
// 使い方:
//   1. このファイルを `<game-id>.ts` にコピー（例: climate-card-01.ts）
//   2. 下の TODO をすべて埋める
//   3. src/data/games/index.ts の gameModules 配列に import を追加
//
// 利用可能なテンプレート:
//   - quiz:       択一クイズ（questions 配列を定義）
//   - card:       カードマッチング（cards + pairs を定義）
//   - maze:       迷路探索（width/height/walls + checkpoints を定義）
//   - simulation: シミュレーション（scenario + params + conditions を定義）
//   - puzzle:     パズル（puzzle_type + solution を定義）
//
// 教科カテゴリ: '理科' | '社会' | '算数' | '美術'
//
// 学年の数値: 1=小1, 2=小2, ... 6=小6, 7=中1, 8=中2, 9=中3, 10=高1, 11=高2, 12=高3
//
// =============================================================================

import type { GameWithTemplate } from '@/types';

const game: GameWithTemplate = {
  // --- メタデータ ---
  id: 'TODO-game-id',           // 英小文字・数字・ハイフンのみ（例: "climate-card-01"）
  title: 'TODO ゲームタイトル',
  category: '理科',              // '理科' | '社会' | '算数' | '美術'
  grade_min: 3,                  // 対象学年の下限（1〜12）
  grade_max: 6,                  // 対象学年の上限（1〜12）
  skill_tags: {
    思考力: 3,                   // 1〜5
    探究力: 3,                   // 1〜5
    創造力: 3,                   // 1〜5
  },
  description: 'TODO ゲームの説明文をここに書く',
  thumbnail_url: '',             // 任意: サムネイル画像URL

  // --- スコア表示設定 ---
  score_display_config: {
    type: 'rank',                // 'rank' | 'stars' | 'title' | 'points'
    // max_stars: 5,             // type が 'stars' の場合のみ
    rules: [
      { min_percent: 90, label: 'S', color: '#FFD700' },
      { min_percent: 75, label: 'A', color: '#C0C0C0' },
      { min_percent: 55, label: 'B', color: '#CD7F32' },
      { min_percent: 30, label: 'C', color: '#4A90D9' },
      { min_percent: 0, label: 'D', color: '#888888' },
    ],
  },

  // --- テンプレートデータ ---
  // 以下から使用するテンプレートを1つ選んでコメントアウトを解除する

  // ▼ Quiz テンプレート
  template: {
    type: 'quiz',
    questions: [
      {
        question: 'TODO 問題文',
        choices: ['選択肢A', '選択肢B', '選択肢C', '選択肢D'],
        correct_answer_index: 0,   // 正解の選択肢（0始まり）
        explanation: 'TODO 解説文',
        time_limit: 30,            // 制限時間（秒）
      },
      // ... 問題を追加
    ],
  },

  // ▼ Card テンプレート
  // template: {
  //   type: 'card',
  //   cards: [
  //     { front: '表面テキスト', back: '裏面テキスト' },
  //     // ... カードを追加
  //   ],
  //   pairs: 8,
  //   match_rules: 'pair_id',    // 'exact' | 'pair_id' | 'category'
  // },

  // ▼ Maze テンプレート
  // template: {
  //   type: 'maze',
  //   width: 8,
  //   height: 8,
  //   start: { x: 0, y: 0 },
  //   goal: { x: 7, y: 7 },
  //   walls: [{ x: 1, y: 0 }, { x: 1, y: 1 }],
  //   checkpoints: [
  //     {
  //       question: 'チェックポイントのクイズ',
  //       choices: ['A', 'B', 'C', 'D'],
  //       correct_answer_index: 0,
  //       explanation: '解説',
  //       time_limit: 30,
  //     },
  //   ],
  // },

  // ▼ Simulation テンプレート
  // template: {
  //   type: 'simulation',
  //   scenario: 'シナリオ名',
  //   initial_params: { パラメータA: 50, パラメータB: 50 },
  //   max_steps: 5,
  //   success_conditions: { パラメータA: 70, パラメータB: 60 },
  // },

  // ▼ Puzzle テンプレート
  // template: {
  //   type: 'puzzle',
  //   puzzle_type: 'number_sequence',
  //   pieces: 5,
  //   solution: [1, 2, 3, 4, 5],
  //   hints: ['ヒント1', 'ヒント2'],
  // },
};

export default game;
