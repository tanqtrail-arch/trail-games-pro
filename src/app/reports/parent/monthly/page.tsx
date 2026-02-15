"use client";

import { getParentMonthlyData } from "@/lib/reports/mock-data";

export default function ParentMonthlyReport() {
  const data = getParentMonthlyData();

  const handlePrint = () => window.print();

  const skillDelta = {
    thinking: data.skills.current.thinking - data.skills.monthAgo.thinking,
    inquiry: data.skills.current.inquiry - data.skills.monthAgo.inquiry,
    creativity: data.skills.current.creativity - data.skills.monthAgo.creativity,
  };

  const rankDiff = data.ranking.previous - data.ranking.current;

  return (
    <>
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-emerald-700 transition-colors"
        >
          PDF保存 / 印刷
        </button>
        <a
          href="/dashboard/parent"
          className="px-4 py-2.5 bg-white text-slate-600 text-sm font-medium rounded-lg shadow border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          戻る
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10 bg-white print:px-0 print:py-0 print:max-w-none">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white print:rounded-none print:bg-emerald-700">
            <p className="text-sm font-medium text-white/80">Monthly Growth Report</p>
            <h1 className="text-2xl font-black mt-1">
              {data.childName}くんの月間成長レポート
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
              <span>{data.grade}</span>
              <span>Lv.{data.level}</span>
              <span>XP: {data.xp.toLocaleString()}</span>
              <span>{data.period}</span>
            </div>
          </div>
        </header>

        {/* Skill Growth Summary */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            スキル成長（今月 vs 先月）
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "思考力", current: data.skills.current.thinking, delta: skillDelta.thinking, color: "emerald" },
              { label: "探究力", current: data.skills.current.inquiry, delta: skillDelta.inquiry, color: "amber" },
              { label: "創造力", current: data.skills.current.creativity, delta: skillDelta.creativity, color: "sky" },
            ].map((s) => (
              <div key={s.label} className="border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{s.current}</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">+{s.delta}</p>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.color === "emerald" ? "bg-emerald-500" : s.color === "amber" ? "bg-amber-500" : "bg-sky-500"
                    }`}
                    style={{ width: `${s.current}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subject Mastery */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            教科別習熟度
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-4 text-slate-500 font-medium">教科</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">先月</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">今月</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">成長</th>
                <th className="py-2 px-4 text-slate-500 font-medium w-1/3">習熟度</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "理科", prev: data.subjects.previous.science, curr: data.subjects.current.science, color: "bg-emerald-500" },
                { label: "社会", prev: data.subjects.previous.social, curr: data.subjects.current.social, color: "bg-amber-500" },
                { label: "算数", prev: data.subjects.previous.math, curr: data.subjects.current.math, color: "bg-sky-500" },
                { label: "美術", prev: data.subjects.previous.art, curr: data.subjects.current.art, color: "bg-pink-500" },
              ].map((sub) => (
                <tr key={sub.label} className="border-t border-slate-100">
                  <td className="py-2 px-4 font-medium text-slate-700">{sub.label}</td>
                  <td className="py-2 px-4 text-right text-slate-400">{sub.prev}</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-800">{sub.curr}</td>
                  <td className="py-2 px-4 text-right font-bold text-emerald-600">
                    +{sub.curr - sub.prev}
                  </td>
                  <td className="py-2 px-4">
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sub.color}`}
                        style={{ width: `${sub.curr}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Ranking */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            全国ランキング
          </h2>
          <div className="flex items-center justify-center gap-6 border border-slate-200 rounded-xl p-6">
            <div className="text-center">
              <p className="text-xs text-slate-400">先月</p>
              <p className="text-2xl font-black text-slate-400">{data.ranking.previous}位</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-500">&rarr;</p>
              <p className="text-xs font-bold text-emerald-600">{rankDiff}位UP</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">今月</p>
              <p className="text-2xl font-black text-emerald-600">{data.ranking.current}位</p>
            </div>
            <div className="text-center ml-4 pl-4 border-l border-slate-200">
              <p className="text-xs text-slate-400">全体</p>
              <p className="text-lg font-bold text-slate-600">{data.ranking.total}人中</p>
              <p className="text-xs font-bold text-emerald-600">
                上位 {((data.ranking.current / data.ranking.total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </section>

        {/* Games Played */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            今月プレイしたゲーム
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-4 text-slate-500 font-medium">ゲーム名</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">プレイ数</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">最高スコア</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">成長</th>
              </tr>
            </thead>
            <tbody>
              {data.gamesPlayed.map((g) => (
                <tr key={g.name} className="border-t border-slate-100">
                  <td className="py-2 px-4 font-medium text-slate-700">{g.name}</td>
                  <td className="py-2 px-4 text-right text-slate-600">{g.plays}回</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-800">{g.bestScore}点</td>
                  <td className="py-2 px-4 text-right font-bold text-emerald-600">+{g.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Monthly Awards */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            月間アワード
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {data.monthlyAwards.map((a) => (
              <div key={a.award} className="border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-amber-600 uppercase">{a.award}</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{a.game}</p>
                <p className="text-sm text-emerald-600 font-bold mt-0.5">{a.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Summary */}
        <section className="mb-8 bg-emerald-50 rounded-xl p-5 border border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-black">
              AI
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-1">AI月間総評</h3>
              <p className="text-sm leading-relaxed text-slate-700">{data.aiSummary}</p>
            </div>
          </div>
        </section>

        {/* Parent Tips */}
        <section className="mb-8 bg-amber-50 rounded-xl p-5 border border-amber-200">
          <h3 className="text-sm font-bold text-amber-700 mb-3">保護者へのアドバイス</h3>
          <ul className="space-y-2">
            {data.parentTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-4 mt-8">
          <p className="text-xs text-slate-400 text-center">
            探究教室 TRAIL - 月間成長レポート | {data.childName}くん ({data.grade})
          </p>
        </footer>
      </div>
    </>
  );
}
