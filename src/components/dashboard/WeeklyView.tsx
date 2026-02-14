"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                         */
/* ------------------------------------------------------------------ */

const summaryCards = [
  { label: "プレイ回数", value: "18回", icon: "🎮", delta: "+3" },
  { label: "合計プレイ時間", value: "4.5時間", icon: "⏱", delta: "+0.8h" },
  { label: "挑戦ゲーム数", value: "9種類", icon: "🧩", delta: "+2" },
  { label: "新規クリア数", value: "4ゲーム", icon: "✅", delta: "+4" },
];

const radarData = [
  { skill: "思考力", thisWeek: 78, lastWeek: 65, fullMark: 100 },
  { skill: "探究力", thisWeek: 85, lastWeek: 72, fullMark: 100 },
  { skill: "創造力", thisWeek: 62, lastWeek: 58, fullMark: 100 },
];

const dailyScores = [
  { day: "月", score: 720 },
  { day: "火", score: 810 },
  { day: "水", score: 680 },
  { day: "木", score: 890 },
  { day: "金", score: 850 },
  { day: "土", score: 920 },
  { day: "日", score: 870 },
];

const weakAreas = [
  { area: "割合の計算", rate: 42, category: "算数" },
  { area: "江戸時代の文化", rate: 55, category: "社会" },
  { area: "光の性質", rate: 60, category: "理科" },
];

const recommendations = [
  {
    type: "弱点補強",
    game: "割合マスター",
    reason: "割合の計算の正答率を上げよう",
    color: "from-red-400 to-rose-500",
    icon: "🎯",
  },
  {
    type: "得意を伸ばす",
    game: "歴史探偵ゲーム",
    reason: "歴史分野をさらに極めよう",
    color: "from-trail-primary to-emerald-500",
    icon: "🚀",
  },
  {
    type: "新ジャンル挑戦",
    game: "音楽リズムラボ",
    reason: "まだ試していないジャンルに挑戦！",
    color: "from-trail-secondary to-amber-500",
    icon: "🌈",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function WeeklyView() {
  return (
    <div className="space-y-8">
      {/* ---- 週間サマリー ---- */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
          週間サマリー
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((c) => (
            <div
              key={c.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <span className="text-2xl">{c.icon}</span>
              <p className="mt-2 text-xs font-semibold text-gray-400">
                {c.label}
              </p>
              <p className="mt-1 text-2xl font-black text-trail-dark">
                {c.value}
              </p>
              <span className="inline-block mt-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                {c.delta}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- スキル別推移グラフ ---- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            スキルバランス（今週 vs 先週）
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "#334155", fontSize: 13, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
              />
              <Radar
                name="先週"
                dataKey="lastWeek"
                stroke="#94a3b8"
                fill="#94a3b8"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
              <Radar
                name="今週"
                dataKey="thisWeek"
                stroke="#40916C"
                fill="#40916C"
                fillOpacity={0.25}
                strokeWidth={2.5}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="line"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            日別スコア推移
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                domain={[500, 1000]}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                }}
                formatter={(value: number) => [`${value}点`, "スコア"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#40916C"
                strokeWidth={3}
                dot={{ r: 5, fill: "#40916C", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ---- つまずき分析 ---- */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">
          つまずき分析 TOP3
        </h3>
        <div className="space-y-5">
          {weakAreas.map((w) => (
            <div key={w.area}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-trail-dark">
                    {w.area}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-trail-secondary/10 text-trail-secondary">
                    {w.category}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-500">
                  正答率 {w.rate}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    w.rate < 50
                      ? "bg-gradient-to-r from-red-400 to-rose-400"
                      : w.rate < 70
                      ? "bg-gradient-to-r from-amber-400 to-orange-400"
                      : "bg-gradient-to-r from-emerald-400 to-green-400"
                  }`}
                  style={{ width: `${w.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- おすすめゲーム3選 ---- */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
          おすすめゲーム3選
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recommendations.map((r) => (
            <div
              key={r.type}
              className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${r.color}`}
              />
              <span className="text-2xl">{r.icon}</span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {r.type}
              </p>
              <p className="mt-1 text-base font-bold text-trail-dark">
                {r.game}
              </p>
              <p className="mt-1 text-xs text-gray-500">{r.reason}</p>
              <button className="mt-3 w-full py-2 text-xs font-bold text-white bg-gradient-to-r from-trail-primary to-trail-secondary rounded-lg hover:opacity-90 transition-opacity">
                プレイする
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ---- AIコメント ---- */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-trail-primary to-trail-secondary flex items-center justify-center text-white text-sm font-black shadow">
            AI
          </div>
          <div>
            <h3 className="text-sm font-bold text-trail-primary mb-2">
              今週のAIコメント
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              ゆうたくんは今週、特に
              <span className="font-bold text-trail-dark">探究力</span>
              が大きく伸びました（先週比
              <span className="font-bold text-emerald-600">+13ポイント</span>
              ）。歴史と理科のゲームに積極的に取り組み、複数の分野を横断する
              「つなげて考える力」が育ってきています。一方で、算数の
              <span className="font-bold text-amber-600">割合の計算</span>
              にやや苦手意識が見られます。ゲーム形式で楽しく取り組める
              「割合マスター」を試してみてはいかがでしょうか。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
