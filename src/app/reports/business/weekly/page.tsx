"use client";

import { useRef } from "react";
import { getBusinessWeeklyData } from "@/lib/reports/mock-data";
import { formatYen, deltaPercent, trendArrow } from "@/lib/reports/utils";

export default function BusinessWeeklyReport() {
  const data = getBusinessWeeklyData();
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  return (
    <>
      {/* Print button - hidden in print */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
        >
          PDF保存 / 印刷
        </button>
        <a
          href="/dashboard/admin"
          className="px-4 py-2.5 bg-white text-slate-600 text-sm font-medium rounded-lg shadow border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          戻る
        </a>
      </div>

      <div
        ref={reportRef}
        className="max-w-4xl mx-auto px-8 py-10 bg-white print:px-0 print:py-0 print:max-w-none"
      >
        {/* Header */}
        <header className="border-b-2 border-slate-800 pb-4 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">
                Weekly Business Report
              </p>
              <h1 className="text-2xl font-black text-slate-800 mt-1">
                TRAIL 週次経営レポート
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-600">
                {data.period.start} 〜 {data.period.end}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                生成日: {new Date().toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
        </header>

        {/* Alerts */}
        {data.alerts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
              アラート・注目ポイント
            </h2>
            <div className="space-y-2">
              {data.alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-4 py-2.5 rounded-lg text-sm ${
                    alert.level === "critical"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : alert.level === "warning"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <span className="font-bold text-base leading-none mt-0.5">
                    {alert.level === "critical"
                      ? "!!"
                      : alert.level === "warning"
                      ? "!"
                      : "i"}
                  </span>
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* KPI Summary */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            KPI サマリー
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "累計無料会員",
                current: data.kpis.freeMembers.current.toLocaleString(),
                delta: `+${data.kpis.freeMembers.delta}`,
                sub: deltaPercent(data.kpis.freeMembers.current, data.kpis.freeMembers.previous),
              },
              {
                label: "累計有料会員",
                current: data.kpis.paidMembers.current.toLocaleString(),
                delta: `+${data.kpis.paidMembers.delta}`,
                sub: deltaPercent(data.kpis.paidMembers.current, data.kpis.paidMembers.previous),
              },
              {
                label: "MRR",
                current: formatYen(data.kpis.mrr.current),
                delta: formatYen(data.kpis.mrr.current - data.kpis.mrr.previous),
                sub: deltaPercent(data.kpis.mrr.current, data.kpis.mrr.previous),
              },
              {
                label: "解約率",
                current: `${data.kpis.churnRate.current}%`,
                delta: `${(data.kpis.churnRate.current - data.kpis.churnRate.previous).toFixed(1)}pt`,
                sub: data.kpis.churnRate.current < 3 ? "目標達成" : "要改善",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="border border-slate-200 rounded-lg p-4"
              >
                <p className="text-xs text-slate-400 font-medium">
                  {kpi.label}
                </p>
                <p className="text-xl font-black text-slate-800 mt-1">
                  {kpi.current}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-emerald-600">
                    {kpi.delta}
                  </span>
                  <span className="text-xs text-slate-400">{kpi.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Registrations Table */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            日別登録数
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-4 text-slate-500 font-medium">日付</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">無料登録</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">有料転換</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">転換率</th>
              </tr>
            </thead>
            <tbody>
              {data.dailyRegistrations.map((d) => (
                <tr key={d.date} className="border-t border-slate-100">
                  <td className="py-2 px-4 font-medium text-slate-700">{d.date}</td>
                  <td className="py-2 px-4 text-right text-slate-600">{d.free}</td>
                  <td className="py-2 px-4 text-right text-slate-600">{d.paid}</td>
                  <td className="py-2 px-4 text-right font-semibold text-emerald-600">
                    {d.free > 0 ? ((d.paid / d.free) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                <td className="py-2 px-4 text-slate-700">合計</td>
                <td className="py-2 px-4 text-right text-slate-700">
                  {data.dailyRegistrations.reduce((s, d) => s + d.free, 0)}
                </td>
                <td className="py-2 px-4 text-right text-slate-700">
                  {data.dailyRegistrations.reduce((s, d) => s + d.paid, 0)}
                </td>
                <td className="py-2 px-4 text-right text-emerald-600">
                  {(
                    (data.dailyRegistrations.reduce((s, d) => s + d.paid, 0) /
                      data.dailyRegistrations.reduce((s, d) => s + d.free, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Channel Breakdown */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            チャネル別パフォーマンス
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-4 text-slate-500 font-medium">チャネル</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">訪問者</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">登録</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">有料転換</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">転換率</th>
              </tr>
            </thead>
            <tbody>
              {data.channelBreakdown.map((ch) => (
                <tr key={ch.channel} className="border-t border-slate-100">
                  <td className="py-2 px-4 font-medium text-slate-700">{ch.channel}</td>
                  <td className="py-2 px-4 text-right text-slate-600">
                    {ch.visitors.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right text-slate-600">{ch.registrations}</td>
                  <td className="py-2 px-4 text-right text-slate-600">{ch.conversions}</td>
                  <td className="py-2 px-4 text-right font-semibold text-emerald-600">
                    {ch.rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Top Games */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            ゲーム別パフォーマンス TOP5
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-4 text-slate-500 font-medium">ゲーム名</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">プレイ数</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">増減</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">完走率</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">評価</th>
              </tr>
            </thead>
            <tbody>
              {data.topGames.map((g) => (
                <tr key={g.name} className="border-t border-slate-100">
                  <td className="py-2 px-4 font-medium text-slate-700">{g.name}</td>
                  <td className="py-2 px-4 text-right text-slate-600">
                    {g.plays.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right text-emerald-600 font-semibold">
                    +{g.deltaPlays}
                  </td>
                  <td className="py-2 px-4 text-right text-slate-600">{g.completion}%</td>
                  <td className="py-2 px-4 text-right text-slate-600">{g.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-4 mt-8">
          <p className="text-xs text-slate-400 text-center">
            探究教室 TRAIL - 週次経営レポート | Confidential
          </p>
        </footer>
      </div>
    </>
  );
}
