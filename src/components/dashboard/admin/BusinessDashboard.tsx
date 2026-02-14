"use client";

import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import KPICard from "./KPICard";
import FunnelChart from "./FunnelChart";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const dailyRegistrations = [
  { date: "1/1", new: 45, cumulative: 3200 },
  { date: "1/8", new: 62, cumulative: 3634 },
  { date: "1/15", new: 78, cumulative: 4180 },
  { date: "1/22", new: 55, cumulative: 4565 },
  { date: "2/1", new: 91, cumulative: 5202 },
  { date: "2/8", new: 84, cumulative: 5790 },
  { date: "2/15", new: 110, cumulative: 6560 },
  { date: "2/22", new: 97, cumulative: 7238 },
  { date: "3/1", new: 125, cumulative: 8113 },
  { date: "3/8", new: 138, cumulative: 9079 },
  { date: "3/15", new: 142, cumulative: 10073 },
  { date: "3/22", new: 156, cumulative: 11165 },
];

const mrrTrend = [
  { month: "2025/10", mrr: 490000 },
  { month: "2025/11", mrr: 637000 },
  { month: "2025/12", mrr: 784000 },
  { month: "2026/01", mrr: 960400 },
  { month: "2026/02", mrr: 1176000 },
];

const channelData = [
  { name: "SNS", value: 35 },
  { name: "検索", value: 28 },
  { name: "直接", value: 22 },
  { name: "リファラル", value: 15 },
];

const CHANNEL_COLORS = ["#2563EB", "#7C3AED", "#F59E0B", "#10B981"];

const funnelStages = [
  { label: "PV (月間)", value: 120000, percentage: 100 },
  { label: "無料プレイ", value: 12000, percentage: 10 },
  { label: "会員登録", value: 2400, percentage: 20 },
  { label: "有料転換", value: 192, percentage: 8 },
];

const cohortData = [
  { cohort: "2025/10", m0: 100, m1: 72, m2: 58, m3: 48, m4: 42 },
  { cohort: "2025/11", m0: 100, m1: 75, m2: 62, m3: 51, m4: null },
  { cohort: "2025/12", m0: 100, m1: 78, m2: 65, m3: null, m4: null },
  { cohort: "2026/01", m0: 100, m1: 80, m2: null, m3: null, m4: null },
  { cohort: "2026/02", m0: 100, m1: null, m2: null, m3: null, m4: null },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CohortHeatmap() {
  const months = ["M0", "M1", "M2", "M3", "M4"];

  const getCellColor = (val: number | null): string => {
    if (val === null) return "bg-slate-100 text-slate-300";
    if (val >= 75) return "bg-emerald-500 text-white";
    if (val >= 60) return "bg-emerald-400 text-white";
    if (val >= 50) return "bg-amber-400 text-white";
    if (val >= 40) return "bg-amber-500 text-white";
    return "bg-red-400 text-white";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 px-3 text-slate-500 font-medium">
              コホート
            </th>
            {months.map((m) => (
              <th
                key={m}
                className="text-center py-2 px-3 text-slate-500 font-medium"
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohortData.map((row) => (
            <tr key={row.cohort}>
              <td className="py-1.5 px-3 font-medium text-slate-600">
                {row.cohort}
              </td>
              {[row.m0, row.m1, row.m2, row.m3, row.m4].map(
                (val, i) => (
                  <td key={i} className="py-1.5 px-3 text-center">
                    <span
                      className={`inline-block w-12 py-1 rounded text-xs font-bold ${getCellColor(val)}`}
                    >
                      {val !== null ? `${val}%` : "-"}
                    </span>
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function BusinessDashboard() {
  const freeMembers = 11165;
  const paidMembers = 1200;
  const paidGoal = 10000;
  const mrr = paidMembers * 980;
  const arr = mrr * 12;
  const arrGoal = 98000000;
  const churnRate = 2.8;
  const ltv = Math.round(mrr / paidMembers / (churnRate / 100));

  const churnColor =
    churnRate < 3 ? "green" : churnRate <= 5 ? "amber" : "red";

  const formatYen = (n: number) =>
    `\u00a5${n.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* ---- KPI Overview ---- */}
      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-3">
          KPI Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="累計無料会員"
            value={freeMembers.toLocaleString()}
            trend="up"
            trendValue="+156 今週"
            subtitle="前週比 +14%"
            color="blue"
            icon="👥"
          />
          <KPICard
            title="累計有料会員"
            value={paidMembers.toLocaleString()}
            trend="up"
            trendValue={`${((paidMembers / paidGoal) * 100).toFixed(1)}%`}
            subtitle={`目標 ${paidGoal.toLocaleString()} まであと ${(paidGoal - paidMembers).toLocaleString()}`}
            color="purple"
            icon="💎"
          />
          <KPICard
            title="MRR (月次経常収益)"
            value={formatYen(mrr)}
            trend="up"
            trendValue="+18.3%"
            subtitle={`有料会員 ${paidMembers.toLocaleString()} x \u00a5980`}
            color="amber"
            icon="💰"
          />
          <KPICard
            title="月間解約率"
            value={`${churnRate}%`}
            trend={churnRate < 3 ? "down" : "up"}
            trendValue={churnRate < 3 ? "-0.3pt" : "+0.2pt"}
            subtitle={
              churnRate < 3
                ? "良好 - 目標3%以下を達成"
                : "改善が必要"
            }
            color={churnColor as "green" | "amber" | "red"}
            icon="📉"
          />
        </div>
      </section>

      {/* ---- Paid member progress bar ---- */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            有料会員 目標進捗
          </span>
          <span className="text-sm font-bold text-purple-600">
            {paidMembers.toLocaleString()} / {paidGoal.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min((paidMembers / paidGoal) * 100, 100)}%`,
            }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          達成率 {((paidMembers / paidGoal) * 100).toFixed(1)}% -
          目標達成まで有料会員あと{" "}
          {(paidGoal - paidMembers).toLocaleString()} 人
        </p>
      </section>

      {/* ---- Charts Row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Trend */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            ユーザー数推移
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dailyRegistrations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
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
                yAxisId="left"
                type="monotone"
                dataKey="new"
                stroke="#2563EB"
                strokeWidth={2}
                name="新規登録"
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                stroke="#7C3AED"
                strokeWidth={2}
                name="累計"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* MRR Trend */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            MRR 推移
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mrrTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                tickFormatter={(v: number) =>
                  `\u00a5${(v / 10000).toFixed(0)}万`
                }
              />
              <Tooltip
                formatter={(value: number) => [
                  `\u00a5${value.toLocaleString()}`,
                  "MRR",
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* ---- Revenue Panel ---- */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-4">
          売上パネル
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-1">ARR (年間経常収益)</p>
            <p className="text-xl font-bold text-slate-800">
              {formatYen(arr)}
            </p>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>目標 {formatYen(arrGoal)}</span>
                <span>
                  {((arr / arrGoal) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full"
                  style={{
                    width: `${Math.min((arr / arrGoal) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">LTV (顧客生涯価値)</p>
            <p className="text-xl font-bold text-slate-800">
              {formatYen(ltv)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              ARPU \u00a5980 / 解約率 {churnRate}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">
              ペイバック期間
            </p>
            <p className="text-xl font-bold text-slate-800">
              {Math.round(0 / 980) || "< 1"} ヶ月
            </p>
            <p className="text-xs text-slate-400 mt-1">
              CAC \u00a50 (オーガニック中心)
            </p>
          </div>
        </div>
      </section>

      {/* ---- Channel & Funnel Row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Pie */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            チャネル別流入
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }: { name: string; value: number }) =>
                    `${name} ${value}%`
                  }
                >
                  {channelData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHANNEL_COLORS[index]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "割合"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Funnel */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">
            転換率ファネル
          </h3>
          <FunnelChart stages={funnelStages} />
        </section>
      </div>

      {/* ---- Cohort ---- */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-4">
          コホート分析 (月次リテンション)
        </h3>
        <CohortHeatmap />
        <p className="text-xs text-slate-400 mt-3">
          ※ M0 = 登録月, M1 = 翌月, ... 数値は各コホートの残存率(%)
        </p>
      </section>
    </div>
  );
}
