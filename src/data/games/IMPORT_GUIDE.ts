// =============================================================================
// TRAIL プラットフォーム ゲーム追加ガイド
// =============================================================================
//
// ■ このファイルの使い方
//
// 他の Claude Code セッションでゲームを作るとき、このファイルの内容を
// プロンプトにコピペして「この形式でゲームデータを出力して」と伝えてください。
//
// ■ 他セッションへのコピペ用プロンプト（↓ここから↓）
// =========================================================================
//
// 【依頼】TRAIL プラットフォーム用のゲームデータを以下の JSON 形式で出力してください。
// TypeScript ファイルではなく、純粋な JSON で出力してください。
//
// ```json
// {
//   "id": "climate-card-01",
//   "title": "気候変動カードバトル",
//   "category": "理科",
//   "grade_min": 4,
//   "grade_max": 6,
//   "skill_tags": { "思考力": 4, "探究力": 3, "創造力": 3 },
//   "description": "ゲームの説明文",
//   "thumbnail_url": "",
//   "score_display_config": {
//     "type": "rank",
//     "rules": [
//       { "min_percent": 90, "label": "S", "color": "#FFD700" },
//       { "min_percent": 75, "label": "A", "color": "#C0C0C0" },
//       { "min_percent": 55, "label": "B", "color": "#CD7F32" },
//       { "min_percent": 30, "label": "C", "color": "#4A90D9" },
//       { "min_percent": 0,  "label": "D", "color": "#888888" }
//     ]
//   },
//   "template": { ... }
// }
// ```
//
// ■ 各フィールドの仕様:
//
// | フィールド       | 型           | 説明                                           |
// |-----------------|-------------|------------------------------------------------|
// | id              | string      | 英小文字・数字・ハイフンのみ（例: "climate-card-01"）|
// | title           | string      | ゲームタイトル                                   |
// | category        | string      | "理科" / "社会" / "算数" / "美術" のいずれか       |
// | grade_min       | number(1-12)| 対象学年の下限（1=小1, 7=中1, 10=高1）            |
// | grade_max       | number(1-12)| 対象学年の上限（6=小6, 9=中3, 12=高3）            |
// | skill_tags      | object      | { "思考力": 1-5, "探究力": 1-5, "創造力": 1-5 }  |
// | description     | string      | ゲームの説明文                                   |
// | thumbnail_url   | string      | サムネイル画像URL（空文字でもOK）                  |
// | score_display_config | object | スコア表示設定（下記参照）                         |
// | template        | object      | ゲーム本体データ（下記5種類から選択）               |
//
// ■ score_display_config.type の選択肢:
//   - "rank"   : S/A/B/C/D のランク表示
//   - "stars"  : 星評価（max_stars フィールドも追加）
//   - "title"  : 称号表示（例: "江戸博士"）
//   - "points" : 点数表示
//
// ■ template の種類（type で判別）:
//
// 【quiz】択一クイズ
// {
//   "type": "quiz",
//   "questions": [
//     {
//       "question": "問題文",
//       "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
//       "correct_answer_index": 0,
//       "explanation": "解説文",
//       "time_limit": 30
//     }
//   ]
// }
//
// 【card】カードマッチング
// {
//   "type": "card",
//   "cards": [
//     { "front": "表面テキスト", "back": "裏面テキスト" }
//   ],
//   "pairs": 8,
//   "match_rules": "pair_id"
// }
//
// 【maze】迷路探索
// {
//   "type": "maze",
//   "width": 8, "height": 8,
//   "start": { "x": 0, "y": 0 },
//   "goal": { "x": 7, "y": 7 },
//   "walls": [{ "x": 1, "y": 0 }],
//   "checkpoints": [{ "question": "...", "choices": [...], ... }]
// }
//
// 【simulation】シミュレーション
// {
//   "type": "simulation",
//   "scenario": "シナリオ名",
//   "initial_params": { "環境": 50, "経済": 50 },
//   "max_steps": 5,
//   "success_conditions": { "環境": 70, "経済": 60 }
// }
//
// 【puzzle】パズル
// {
//   "type": "puzzle",
//   "puzzle_type": "number_sequence",
//   "pieces": 5,
//   "solution": [1, 2, 3, 4, 5],
//   "hints": ["ヒント1", "ヒント2"]
// }
//
// =========================================================================
// ■ 受け取った JSON をプラットフォームに追加する手順:
//
// 1. JSON を受け取ったら、このセッション（trail-games-pro）で以下を依頼:
//    「この JSON をゲームとして追加して」+ JSON を貼り付け
//
// 2. Claude が自動的に:
//    - src/data/games/<id>.ts ファイルを作成
//    - src/data/games/index.ts に import を追加
//    - ビルド確認
//
// =============================================================================

export {};
