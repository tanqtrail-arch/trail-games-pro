# CLAUDE.md - 探究教室 TRAIL 開発ガイド

## プロダクト概要

**探究教室 TRAIL** - 小学生向け探究学習ゲームSaaS。
ゲームを通じて「思考力・探究力・創造力」を育てる教育プラットフォーム。
ソロオペレーター運営、現在MVP段階（モックデータで画面を先に構築中）。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js 14 (App Router, 静的エクスポート) |
| 言語 | TypeScript 5 (strict) |
| スタイリング | Tailwind CSS 3.4 のみ（UIライブラリ不使用） |
| データベース | Supabase (PostgreSQL) |
| 決済 | Stripe |
| グラフ | Recharts |
| フォント | Noto Sans JP (Google Fonts) |

## デザイン原則

- **Tailwind CSS のみ** - shadcn/ui、MUI等のUIライブラリは使わない
- **画像ファイル不使用** - 絵文字 + インラインSVG + CSSグラデーションで表現
- **モバイルファースト** - sm/md/lg/xl ブレークポイントで対応
- **ブランドカラー**:
  - `trail-primary`: #16A34A (フレッシュグリーン)
  - `trail-secondary`: #FACC15 (ひまわりイエロー)
  - `trail-accent`: #38BDF8 (スカイブルー)
  - `trail-dark`: #1E293B / `trail-light`: #F8FAF8
- **グローバルCSS** (`globals.css`) に `.btn-primary`, `.card`, `.glass-card` 等の共通クラスあり

## ディレクトリ構成

```
src/
├── app/                    # ページ (Next.js App Router)
│   ├── page.tsx            # LP（ランディングページ）
│   ├── games/              # ゲーム一覧 + [gameId] 個別ページ
│   ├── dashboard/admin/    # 管理ダッシュボード（経営管理・学習分析）
│   ├── dashboard/parent/   # 保護者ダッシュボード（日/週/月/四半期）
│   ├── reports/            # レポート（経営週次/月次、保護者週間/月間）
│   ├── profile/            # プロフィール
│   ├── rankings/           # ランキング
│   └── api/                # APIエンドポイント
├── components/
│   ├── layout/             # Header, Footer
│   ├── game/               # GameEngine, ResultScreen, テンプレート5種
│   ├── dashboard/          # DailyView〜QuarterlyView, admin/
│   └── ui/                 # （空 - 将来のUIコンポーネント用）
├── data/games/             # ゲームデータ定義（5ゲーム実装済み）
├── lib/                    # ビジネスロジック・ユーティリティ
│   ├── constants.ts        # 定数（科目、スキル、レベル、プラン）
│   ├── game-sdk.ts         # ゲームAPI SDK
│   ├── level.ts            # レベルシステム（最大Lv.99）
│   ├── supabase.ts         # Supabaseクライアント
│   ├── stripe.ts           # Stripe決済
│   └── reports/            # レポートデータ・ユーティリティ
└── types/index.ts          # 全TypeScript型定義（50+インターフェース）
```

## ゲームシステム

- **テンプレート**: quiz, card, maze, simulation, puzzle の5種類
- **教科**: 理科, 社会, 算数, 美術
- **スキル**: 思考力, 探究力, 創造力（各1-5段階）
- **対象学年**: 小1〜高3（12段階）
- **レベル**: 最大99, 7段階の称号（探究ビギナー→探究の極み）
- **ゲーム追加**: `src/data/games/_template.ts` をコピーして作成

## API エンドポイント

- `POST /api/auth/login` - ログイン
- `POST /api/auth/register` - 新規登録
- `GET /api/auth` - 認証状態確認
- `POST /api/scores` - スコア送信
- `GET /api/rankings` - ランキング取得
- `GET /api/stats` - プラットフォーム統計
- `POST /api/webhooks/stripe` - Stripe Webhook

## 現在のフェーズと状態

**完了済み**:
- LP（アニメーション付きランディングページ）
- ゲームエンジン + 5ゲーム
- 保護者ダッシュボード（4ビュー）
- 管理ダッシュボード（経営管理 + 学習分析）
- レポート生成（4種類、PDF保存対応）
- プロフィール / ランキング
- API設計（モック対応）

**未実装**:
- Supabase実データ接続（現在モックデータ）
- 認証フロー（UI未実装）
- Stripe決済フロー（SDK準備済み）
- ゲームコンテンツ追加

## 設定

- `output: "export"` - 静的エクスポート
- `trailingSlash: true`
- パスエイリアス: `@/*` → `./src/*`
- 環境変数: `.env.local.example` 参照

## コマンド

```bash
npm run dev     # 開発サーバー起動
npm run build   # ビルド
npm run lint    # ESLint
```
