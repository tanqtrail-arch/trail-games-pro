"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import KPICard from "./KPICard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortKey =
  | "name"
  | "plays"
  | "completion"
  | "avgScore"
  | "replay"
  | "rating";
type SortDir = "asc" | "desc";

interface GameRow {
  name: string;
  plays: number;
  completion: number;
  avgScore: number;
  replay: number;
  rating: number;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const gamePerformance: GameRow[] = [
  {
    name: "火山のしくみ探究",
    plays: 4520,
    completion: 78,
    avgScore: 72,
    replay: 35,
    rating: 4.6,
  },
  {
    name: "都道府県チャレンジ",
    plays: 6230,
    completion: 85,
    avgScore: 68,
    replay: 42,
    rating: 4.3,
  },
  {
    name: "分数パズルアドベンチャー",
    plays: 3890,
    completion: 52,
    avgScore: 55,
    replay: 18,
    rating: 3.8,
  },
  {
    name: "色と光の実験室",
    plays: 5100,
    completion: 91,
    avgScore: 80,
    replay: 48,
    rating: 4.8,
  },
  {
    name: "天体観測シミュレーター",
    plays: 2870,
    completion: 65,
    avgScore: 62,
    replay: 28,
    rating: 4.1,
  },
  {
    name: "歴史人物カードバトル",
    plays: 7450,
    completion: 88,
    avgScore: 75,
    replay: 55,
    rating: 4.7,
  },
  {
    name: "図形の面積マスター",
    plays: 3200,
    completion: 45,
    avgScore: 48,
    replay: 12,
    rating: 3.5,
  },
  {
    name: "水の循環アドベンチャー",
    plays: 4100,
    completion: 72,
    avgScore: 66,
    replay: 30,
    rating: 4.2,
  },
  {
    name: "音楽リズムラボ",
    plays: 5800,
    completion: 93,
    avgScore: 82,
    replay: 60,
    rating: 4.9,
  },
  {
    name: "割合とグラフ探偵",
    plays: 2100,
    completion: 38,
    avgScore: 42,
    replay: 8,
    rating: 3.2,
  },
];

const completionByCategory = [
  { category: "理科", rate: 72, color: "#16A34A" },
  { category: "社会", rate: 82, color: "#FACC15" },
  { category: "算数", rate: 48, color: "#38BDF8" },
  { category: "美術/音楽", rate: 88, color: "#4ADE80" },
];

const stumblePoints = [
  {
    grade: "小1-2",
    points: ["時計の読み方", "繰り上がり計算", "長文の読解"],
  },
  {
    grade: "小3-4",
    points: ["分数の概念", "都道府県の位置", "実験手順の理解"],
  },
  {
    grade: "小5-6",
    points: ["割合・百分率", "歴史年号の順序", "グラフの読み取り"],
  },
];

const difficultyDistribution = [
  {
    label: "簡単すぎる (>90%)",
    games: ["色と光の実験室", "音楽リズムラボ"],
    color: "bg-emerald-400",
    percent: 20,
  },
  {
    label: "適正 (60-90%)",
    games: [
      "火山のしくみ探究",
      "都道府県チャレンジ",
      "天体観測シミュレーター",
      "歴史人物カードバトル",
      "水の循環アドベンチャー",
    ],
    color: "bg-emerald-500",
    percent: 50,
  },
  {
    label: "やや難しい (30-60%)",
    games: ["分数パズルアドベンチャー", "図形の面積マスター"],
    color: "bg-amber-400",
    percent: 20,
  },
  {
    label: "難しすぎる (<30%)",
    games: ["割合とグラフ探偵"],
    color: "bg-red-400",
    percent: 10,
  },
];

const gameProposals = [
  {
    title: "速さと距離の冒険RPG",
    reason: "空白分野",
    detail:
      "算数「速さ」単元のゲームが未存在。離脱率が高い算数分野を補強し、小5-6向けRPG形式で楽しく学べる設計。",
    priority: 95,
    tag: "bg-red-100 text-red-700",
  },
  {
    title: "漢字バトルアリーナ",
    reason: "リクエスト",
    detail:
      "保護者アンケートで「漢字ゲームが欲しい」が最多。国語分野の拡充と既存ユーザーの継続率向上が見込める。",
    priority: 88,
    tag: "bg-amber-100 text-amber-700",
  },
  {
    title: "生き物観察図鑑クエスト",
    reason: "人気横展開",
    detail:
      "理科系ゲームの高評価を活かし、図鑑コレクション要素で長期リテンションを狙う。リプレイ率60%超を目標。",
    priority: 82,
    tag: "bg-emerald-100 text-emerald-700",
  },
];

const skillGrowth = [
  { month: "2025/10", thinking: 42, inquiry: 38, creativity: 35 },
  { month: "2025/11", thinking: 48, inquiry: 44, creativity: 40 },
  { month: "2025/12", thinking: 55, inquiry: 50, creativity: 46 },
  { month: "2026/01", thinking: 61, inquiry: 57, creativity: 52 },
  { month: "2026/02", thinking: 68, inquiry: 63, creativity: 58 },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SortIcon({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) {
  if (!active) return <span className="text-slate-300 ml-1">&#8597;</span>;
  return (
    <span className="text-emerald-500 ml-1">
      {dir === "asc" ? "\u2191" : "\u2193"}
    </span>
  );
}

function metricColor(
  value: number,
  good: number,
  bad: number,
  higherIsBetter = true
): string {
  if (higherIsBetter) {
    if (value >= good) return "text-emerald-600 font-semibold";
    if (value <= bad) return "text-red-500 font-semibold";
    return "text-slate-700";
  }
  if (value <= good) return "text-emerald-600 font-semibold";
  if (value >= bad) return "text-red-500 font-semibold";
  return "text-slate-700";
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function LearningDashboard() {
  const [sortKey, setSortKey] = useState<SortKey>("plays");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedGames = useMemo(() => {
    return [...gamePerformance].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [sortKey, sortDir]);

  const totalPlays = gamePerformance.reduce((s, g) => s + g.plays, 0);
  const avgCompletion = Math.round(
    gamePerformance.reduce((s, g) => s + g.completion, 0) /
      gamePerformance.length
  );
  const avgRating = (
    gamePerformance.reduce((s, g) => s + g.rating, 0) /
    gamePerformance.length
  ).toFixed(1);

  const columns: { key: SortKey; label: string }[] = [
    { key: "name", label: "ゲーム名" },
    { key: "plays", label: "プレイ数" },
    { key: "completion", label: "完走率" },
    { key: "avgScore", label: "平均スコア" },
    { key: "replay", label: "リプレイ率" },
    { key: "rating", label: "★評価" },
  ];

  return (
    <div className="space-y-6">
      {/* ---- KPI Summary ---- */}
      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-3">
          学習分析 Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard
            title="総プレイ数"
            value={totalPlays.toLocaleString()}
            trend="up"
            trendValue="+2,340 今週"
            color="blue"
            icon="🎮"
          />
          <KPICard
            title="平均完走率"
            value={`${avgCompletion}%`}
            trend={avgCompletion >= 65 ? "up" : "down"}
            trendValue="+3pt"
            color={avgCompletion >= 65 ? "green" : "amber"}
            icon="🏁"
          />
          <KPICard
            title="平均★評価"
            value={avgRating}
            trend="up"
            trendValue="+0.2"
            subtitle="5.0点満点"
            color="purple"
            icon="⭐"
          />
        </div>
      </section>

      {/* ---- Game Performance Table ---- */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-4">
          ゲーム別パフォーマンス
        </h3>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left py-2.5 px-3 text-slate-500 font-medium cursor-pointer hover:text-slate-700 select-none whitespace-nowrap"
                  >
                    {col.label}
                    <SortIcon
                      active={sortKey === col.key}
                      dir={sortDir}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedGames.map((game) => (
                <tr
                  key={game.name}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-slate-700 whitespace-nowrap">
                    {game.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {game.plays.toLocaleString()}
                  </td>
                  <td
                    className={`py-2.5 px-3 ${metricColor(game.completion, 70, 40)}`}
                  >
                    {game.completion}%
                  </td>
                  <td
                    className={`py-2.5 px-3 ${metricColor(game.avgScore, 65, 45)}`}
                  >
                    {game.avgScore}
                  </td>
                  <td
                    className={`py-2.5 px-3 ${metricColor(game.replay, 30, 15)}`}
                  >
                    {game.replay}%
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 ${metricColor(game.rating, 4.5, 3.5)}`}
                    >
                      ★ {game.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- Dropout Analysis ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            学習離脱分析 - カテゴリ別完走率
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={completionByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "完走率"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                {completionByCategory.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Color the bars manually via Cell wasn't imported - use fill prop on data */}
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            つまずきポイント (学年別)
          </h3>
          <div className="space-y-4">
            {stumblePoints.map((sp) => (
              <div key={sp.grade}>
                <p className="text-sm font-semibold text-slate-600 mb-1.5">
                  {sp.grade}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sp.points.map((point) => (
                    <span
                      key={point}
                      className="inline-block bg-red-50 text-red-600 text-xs font-medium px-3 py-1.5 rounded-full border border-red-200"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ---- Difficulty Distribution ---- */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-4">
          ゲーム達成率ダッシュボード
        </h3>

        {/* Distribution bar */}
        <div className="flex rounded-lg overflow-hidden h-10 mb-4">
          {difficultyDistribution.map((d) => (
            <div
              key={d.label}
              className={`${d.color} flex items-center justify-center text-white text-xs font-bold transition-all`}
              style={{ width: `${d.percent}%` }}
              title={d.label}
            >
              {d.percent}%
            </div>
          ))}
        </div>

        {/* Legend & games list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {difficultyDistribution.map((d) => (
            <div
              key={d.label}
              className="border border-slate-100 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${d.color}`}
                />
                <span className="text-xs font-semibold text-slate-600">
                  {d.label}
                </span>
              </div>
              <ul className="space-y-1">
                {d.games.map((g) => (
                  <li
                    key={g}
                    className="text-xs text-slate-500 pl-5 relative before:content-[''] before:absolute before:left-1.5 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-slate-300"
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Game Proposals ---- */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-1">
          次に作るべきゲーム提案
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          今週の開発提案 TOP3 - データ分析に基づく優先度順
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gameProposals.map((proposal, i) => (
            <div
              key={proposal.title}
              className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow relative"
            >
              {/* Priority badge */}
              <div className="absolute -top-2.5 -right-2.5 w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow">
                #{i + 1}
              </div>

              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${proposal.tag}`}
              >
                {proposal.reason}
              </span>

              <h4 className="text-sm font-bold text-slate-800 mb-2">
                {proposal.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {proposal.detail}
              </p>

              {/* Priority score bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>優先度スコア</span>
                  <span className="font-bold text-slate-700">
                    {proposal.priority}/100
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full rounded-full"
                    style={{ width: `${proposal.priority}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Skill Growth Curve ---- */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-4">
          スキル成長曲線 (プラットフォーム全体平均)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={skillGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="#94a3b8"
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="thinking"
              stroke="#16A34A"
              strokeWidth={2}
              name="思考力"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="inquiry"
              stroke="#FACC15"
              strokeWidth={2}
              name="探究力"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="creativity"
              stroke="#38BDF8"
              strokeWidth={2}
              name="創造力"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
