"use client";

import { getParentWeeklyData } from "@/lib/reports/mock-data";

export default function ParentWeeklyReport() {
  const data = getParentWeeklyData();

  const handlePrint = () => window.print();

  const skillDelta = {
    thinking: data.skills.current.thinking - data.skills.previous.thinking,
    inquiry: data.skills.current.inquiry - data.skills.previous.inquiry,
    creativity: data.skills.current.creativity - data.skills.previous.creativity,
  };

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
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white print:rounded-none print:bg-emerald-600">
            <p className="text-sm font-medium text-white/80">Weekly Learning Report</p>
            <h1 className="text-2xl font-black mt-1">
              {data.childName}くんの週間学習レポート
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
              <span>{data.grade}</span>
              <span>Lv.{data.level}</span>
              <span>{data.period.start} 〜 {data.period.end}</span>
            </div>
          </div>
        </header>

        {/* Weekly Summary */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            今週のまとめ
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "プレイ回数", value: `${data.summary.playCount}回`, icon: "G" },
              { label: "プレイ時間", value: `${data.summary.playTime}時間`, icon: "T" },
              { label: "挑戦ゲーム数", value: `${data.summary.gamesPlayed}種類`, icon: "P" },
              { label: "新規クリア", value: `${data.summary.newClears}ゲーム`, icon: "C" },
            ].map((s) => (
              <div key={s.label} className="border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                <p className="text-xl font-black text-slate-800 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Growth */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            スキル成長（今週 vs 先週）
          </h2>
          <div className="space-y-4">
            {[
              { label: "思考力", current: data.skills.current.thinking, delta: skillDelta.thinking, color: "bg-emerald-500" },
              { label: "探究力", current: data.skills.current.inquiry, delta: skillDelta.inquiry, color: "bg-amber-500" },
              { label: "創造力", current: data.skills.current.creativity, delta: skillDelta.creativity, color: "bg-sky-500" },
            ].map((skill) => (
              <div key={skill.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-700">{skill.label}</span>
                  <span className="text-sm">
                    <span className="font-black text-slate-800">{skill.current}</span>
                    <span className="text-emerald-600 font-bold ml-2">+{skill.delta}</span>
                  </span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${skill.color} transition-all`}
                    style={{ width: `${skill.current}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Scores */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            日別スコア・プレイ時間
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-2 px-4 text-slate-500 font-medium">曜日</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">スコア</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">プレイ時間</th>
                <th className="py-2 px-4 text-slate-500 font-medium w-1/3">スコアバー</th>
              </tr>
            </thead>
            <tbody>
              {data.dailyScores.map((d) => (
                <tr key={d.day} className="border-t border-slate-100">
                  <td className="py-2 px-4 font-medium text-slate-700">{d.day}</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-800">{d.score}点</td>
                  <td className="py-2 px-4 text-right text-slate-500">{d.playTime}分</td>
                  <td className="py-2 px-4">
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        style={{ width: `${(d.score / 1000) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Weak Areas */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            つまずきポイント
          </h2>
          <div className="space-y-3">
            {data.weakAreas.map((w) => (
              <div key={w.area} className="flex items-center gap-4 border border-slate-200 rounded-lg p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">{w.area}</span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {w.category}
                    </span>
                  </div>
                </div>
                <span className={`text-sm font-black ${w.rate < 50 ? "text-red-500" : w.rate < 70 ? "text-amber-600" : "text-emerald-600"}`}>
                  正答率 {w.rate}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Best Moments */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            今週のハイライト
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.bestMoments.map((m) => (
              <div key={m.type} className="border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase">{m.type}</p>
                <p className="text-sm text-slate-700 mt-1">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Comment */}
        <section className="mb-8 bg-emerald-50 rounded-xl p-5 border border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-black">
              AI
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-700 mb-1">AIからのコメント</h3>
              <p className="text-sm leading-relaxed text-slate-700">{data.aiComment}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-4 mt-8">
          <p className="text-xs text-slate-400 text-center">
            探究教室 TRAIL - 週間学習レポート | {data.childName}くん ({data.grade})
          </p>
        </footer>
      </div>
    </>
  );
}
