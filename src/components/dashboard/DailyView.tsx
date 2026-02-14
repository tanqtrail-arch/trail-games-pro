"use client";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                         */
/* ------------------------------------------------------------------ */

const playLog = [
  {
    id: 1,
    time: "15:32",
    game: "歴史タイムトラベラー",
    category: "社会",
    score: 920,
    maxScore: 1000,
    duration: "12分",
  },
  {
    id: 2,
    time: "15:50",
    game: "数式パズルマスター",
    category: "算数",
    score: 780,
    maxScore: 1000,
    duration: "8分",
  },
  {
    id: 3,
    time: "16:05",
    game: "生き物観察ラボ",
    category: "理科",
    score: 850,
    maxScore: 1000,
    duration: "15分",
  },
  {
    id: 4,
    time: "16:25",
    game: "色彩アートチャレンジ",
    category: "美術",
    score: 690,
    maxScore: 1000,
    duration: "10分",
  },
];

const highlights = [
  {
    label: "最高スコアのゲーム",
    icon: "🏆",
    game: "歴史タイムトラベラー",
    detail: "920点 / 1000点",
    color: "from-yellow-400 to-amber-500",
  },
  {
    label: "初チャレンジのゲーム",
    icon: "🌟",
    game: "色彩アートチャレンジ",
    detail: "初めてプレイしました！",
    color: "from-amber-400 to-orange-500",
  },
  {
    label: "前回より伸びたゲーム",
    icon: "📈",
    game: "生き物観察ラボ",
    detail: "前回より +85点 UP",
    color: "from-emerald-400 to-green-500",
  },
];

const todayPlayMinutes = 45;
const playLimitMinutes = 60;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function DailyView() {
  const progressPercent = Math.min(
    (todayPlayMinutes / playLimitMinutes) * 100,
    100
  );

  return (
    <div className="space-y-8">
      {/* ---- プレイ時間トラッカー ---- */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          プレイ時間トラッカー
        </h3>
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-black text-trail-dark">
            {todayPlayMinutes}
            <span className="text-lg font-bold text-gray-400">分</span>
          </span>
          <span className="text-sm text-gray-400 mb-1">
            / {playLimitMinutes}分
          </span>
        </div>
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              progressPercent >= 90
                ? "bg-gradient-to-r from-red-400 to-red-500"
                : progressPercent >= 70
                ? "bg-gradient-to-r from-amber-400 to-orange-400"
                : "bg-gradient-to-r from-trail-primary to-emerald-400"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {playLimitMinutes - todayPlayMinutes > 0
            ? `あと${playLimitMinutes - todayPlayMinutes}分プレイできます`
            : "本日のプレイ時間上限に達しました"}
        </p>
      </section>

      {/* ---- 今日のハイライト ---- */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
          今日のハイライト
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${h.color}`}
              />
              <span className="text-2xl">{h.icon}</span>
              <p className="mt-2 text-xs font-semibold text-gray-400">
                {h.label}
              </p>
              <p className="mt-1 text-base font-bold text-trail-dark">
                {h.game}
              </p>
              <p className="mt-0.5 text-sm text-gray-500">{h.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- 今日のプレイログ ---- */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">
          今日のプレイログ
        </h3>
        <div className="relative">
          {/* timeline line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gray-100 sm:left-[22px]" />

          <ul className="space-y-6">
            {playLog.map((entry, idx) => (
              <li key={entry.id} className="relative flex gap-4 items-start">
                {/* dot */}
                <div className="relative z-10 flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-trail-primary to-emerald-400 flex items-center justify-center text-white text-xs font-bold shadow">
                  {idx + 1}
                </div>
                {/* content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-trail-dark">
                      {entry.game}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-trail-primary/10 text-trail-primary">
                      {entry.category}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span>{entry.time}</span>
                    <span>{entry.duration}</span>
                    <span className="font-semibold text-trail-dark">
                      {entry.score}
                      <span className="text-gray-300">
                        /{entry.maxScore}点
                      </span>
                    </span>
                  </div>
                  {/* mini score bar */}
                  <div className="mt-2 w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-trail-primary to-trail-secondary"
                      style={{
                        width: `${(entry.score / entry.maxScore) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- 今日の探究メモ (AI Comment) ---- */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-trail-primary to-trail-secondary flex items-center justify-center text-white text-sm font-black shadow">
            AI
          </div>
          <div>
            <h3 className="text-sm font-bold text-trail-primary mb-2">
              今日の探究メモ
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              今日は<span className="font-bold text-trail-dark">4つのゲーム</span>に
              チャレンジしました！歴史ジャンルに集中して取り組み、
              <span className="font-bold text-trail-primary">
                歴史タイムトラベラーで920点
              </span>
              の高得点を記録しています。また、
              <span className="font-bold text-trail-secondary">
                色彩アートチャレンジ
              </span>
              に初挑戦し、新しい分野への好奇心が見られます。生き物観察ラボでは前回より
              <span className="font-bold text-emerald-600">+85点</span>
              の成長が見られ、理科分野の探究力が着実に伸びています。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
