"use client";

import { getBusinessMonthlyData } from "@/lib/reports/mock-data";
import { formatYen, deltaPercent } from "@/lib/reports/utils";

export default function BusinessMonthlyReport() {
  const data = getBusinessMonthlyData();

  const handlePrint = () => window.print();

  const freeGrowth = data.kpis.freeMembers.current - data.kpis.freeMembers.startOfMonth;
  const paidGrowth = data.kpis.paidMembers.current - data.kpis.paidMembers.startOfMonth;

  return (
    <>
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

      <div className="max-w-4xl mx-auto px-8 py-10 bg-white print:px-0 print:py-0 print:max-w-none">
        {/* Header */}
        <header className="border-b-2 border-slate-800 pb-4 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">
                Monthly Business Report
              </p>
              <h1 className="text-2xl font-black text-slate-800 mt-1">
                TRAIL 月次経営レポート
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-600">{data.period}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                生成日: {new Date().toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mb-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            エグゼクティブサマリー
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-400">MRR</p>
              <p className="text-2xl font-black text-slate-800">{formatYen(data.kpis.mrr.current)}</p>
              <p className="text-xs font-bold text-emerald-600 mt-0.5">
                {deltaPercent(data.kpis.mrr.current, data.kpis.mrr.startOfMonth)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">ARR</p>
              <p className="text-2xl font-black text-slate-800">{formatYen(data.kpis.arr.current)}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                目標 {formatYen(data.kpis.arr.goal)} の{" "}
                {((data.kpis.arr.current / data.kpis.arr.goal) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">LTV</p>
              <p className="text-2xl font-black text-slate-800">{formatYen(data.kpis.ltv)}</p>
              <p className="text-xs text-slate-400 mt-0.5">ARPU {formatYen(data.kpis.arpu)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">解約率</p>
              <p className="text-2xl font-black text-slate-800">{data.kpis.churnRate}%</p>
              <p className={`text-xs font-bold mt-0.5 ${data.kpis.churnRate < 3 ? "text-emerald-600" : "text-red-500"}`}>
                {data.kpis.churnRate < 3 ? "目標3%以下 達成" : "目標3%以下 未達"}
              </p>
            </div>
          </div>
        </section>

        {/* Member Growth */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            会員数推移
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-400">無料会員</p>
              <p className="text-xl font-black text-slate-800">
                {data.kpis.freeMembers.current.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 font-bold mt-1">
                +{freeGrowth.toLocaleString()} ({deltaPercent(data.kpis.freeMembers.current, data.kpis.freeMembers.startOfMonth)})
              </p>
              <p className="text-xs text-slate-400">月初 {data.kpis.freeMembers.startOfMonth.toLocaleString()}</p>
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-400">有料会員</p>
              <p className="text-xl font-black text-slate-800">
                {data.kpis.paidMembers.current.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 font-bold mt-1">
                +{paidGrowth.toLocaleString()} ({deltaPercent(data.kpis.paidMembers.current, data.kpis.paidMembers.startOfMonth)})
              </p>
              <p className="text-xs text-slate-400">月初 {data.kpis.paidMembers.startOfMonth.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* MRR Trend */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            MRR推移（5ヶ月）
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-4 text-slate-500 font-medium">月</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">MRR</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">前月比</th>
              </tr>
            </thead>
            <tbody>
              {data.mrrTrend.map((m, i) => (
                <tr key={m.month} className="border-t border-slate-100">
                  <td className="py-2 px-4 font-medium text-slate-700">{m.month}</td>
                  <td className="py-2 px-4 text-right text-slate-600">{formatYen(m.mrr)}</td>
                  <td className="py-2 px-4 text-right font-semibold text-emerald-600">
                    {i > 0
                      ? deltaPercent(m.mrr, data.mrrTrend[i - 1].mrr)
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Cohort Retention */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            コホート分析（月次リテンション）
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-4 text-slate-500 font-medium">コホート</th>
                <th className="text-center py-2 px-4 text-slate-500 font-medium">M0</th>
                <th className="text-center py-2 px-4 text-slate-500 font-medium">M1</th>
                <th className="text-center py-2 px-4 text-slate-500 font-medium">M2</th>
                <th className="text-center py-2 px-4 text-slate-500 font-medium">M3</th>
              </tr>
            </thead>
            <tbody>
              {data.cohortRetention.map((c) => (
                <tr key={c.cohort} className="border-t border-slate-100">
                  <td className="py-2 px-4 font-medium text-slate-700">{c.cohort}</td>
                  {[c.m0, c.m1, c.m2, c.m3].map((val, i) => (
                    <td key={i} className="py-2 px-4 text-center">
                      <span
                        className={`inline-block w-14 py-0.5 rounded text-xs font-bold ${
                          val === null
                            ? "bg-slate-100 text-slate-300"
                            : val >= 75
                            ? "bg-emerald-500 text-white"
                            : val >= 60
                            ? "bg-emerald-400 text-white"
                            : val >= 50
                            ? "bg-amber-400 text-white"
                            : "bg-red-400 text-white"
                        }`}
                      >
                        {val !== null ? `${val}%` : "-"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Funnel */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            転換ファネル
          </h2>
          <div className="flex items-center gap-2 text-sm">
            {[
              { label: "PV", value: data.funnelMetrics.pv, rate: null },
              { label: "無料プレイ", value: data.funnelMetrics.freePlay, rate: (data.funnelMetrics.freePlay / data.funnelMetrics.pv * 100) },
              { label: "会員登録", value: data.funnelMetrics.registration, rate: (data.funnelMetrics.registration / data.funnelMetrics.freePlay * 100) },
              { label: "有料転換", value: data.funnelMetrics.paid, rate: (data.funnelMetrics.paid / data.funnelMetrics.registration * 100) },
            ].map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-2 flex-1">
                <div className="border border-slate-200 rounded-lg p-3 flex-1 text-center">
                  <p className="text-xs text-slate-400">{stage.label}</p>
                  <p className="text-lg font-black text-slate-800">
                    {stage.value.toLocaleString()}
                  </p>
                  {stage.rate !== null && (
                    <p className="text-xs font-bold text-emerald-600">
                      {stage.rate.toFixed(1)}%
                    </p>
                  )}
                </div>
                {i < 3 && (
                  <span className="text-slate-300 font-bold text-lg">&rarr;</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Game Performance */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            ゲーム別パフォーマンス
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-4 text-slate-500 font-medium">ゲーム名</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">プレイ数</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">完走率</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">平均スコア</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">評価</th>
              </tr>
            </thead>
            <tbody>
              {data.gamePerformance.map((g) => (
                <tr key={g.name} className="border-t border-slate-100">
                  <td className="py-2 px-4 font-medium text-slate-700">{g.name}</td>
                  <td className="py-2 px-4 text-right text-slate-600">
                    {g.plays.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-semibold ${g.completion >= 70 ? "text-emerald-600" : g.completion >= 50 ? "text-amber-600" : "text-red-500"}`}>
                    {g.completion}%
                  </td>
                  <td className="py-2 px-4 text-right text-slate-600">{g.avgScore}</td>
                  <td className="py-2 px-4 text-right text-slate-600">{g.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Action Items */}
        <section className="mb-8 bg-amber-50 rounded-xl p-6 border border-amber-200 print:break-before-auto">
          <h2 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-3">
            来月のアクションアイテム
          </h2>
          <ol className="space-y-2">
            {data.actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-4 mt-8">
          <p className="text-xs text-slate-400 text-center">
            探究教室 TRAIL - 月次経営レポート | Confidential
          </p>
        </footer>
      </div>
    </>
  );
}
