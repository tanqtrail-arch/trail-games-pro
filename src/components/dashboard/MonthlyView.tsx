"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import SubjectChart from "./SubjectChart";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                         */
/* ------------------------------------------------------------------ */

const skillTrend = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    day: `${day}日`,
    思考力: Math.min(100, 55 + Math.round(i * 0.8 + Math.random() * 10)),
    探究力: Math.min(100, 50 + Math.round(i * 1.0 + Math.random() * 8)),
    創造力: Math.min(100, 45 + Math.round(i * 0.6 + Math.random() * 12)),
  };
});

const subjectsCurrent = { 理科: 82, 社会: 75, 算数: 60, 美術: 68 };
const subjectsPrevious = { 理科: 70, 社会: 68, 算数: 55, 美術: 58 };

const rankingPrev = 120;
const rankingCurrent = 85;

const gameMap = [
  { name: "歴史タイムトラベラー", played: true, highScore: true, score: 920 },
  { name: "数式パズルマスター", played: true, highScore: false, score: 780 },
  { name: "生き物観察ラボ", played: true, highScore: true, score: 910 },
  { name: "色彩アートチャレンジ", played: true, highScore: false, score: 690 },
  { name: "地理クエスト", played: true, highScore: false, score: 720 },
  { name: "音楽リズムラボ", played: false, highScore: false, score: 0 },
  { name: "論理パズル王", played: true, highScore: false, score: 800 },
  { name: "宇宙探検ゲーム", played: false, highScore: false, score: 0 },
  { name: "ことわざバトル", played: true, highScore: false, score: 650 },
  { name: "実験シミュレーター", played: true, highScore: true, score: 880 },
  { name: "世界の料理探究", played: false, highScore: false, score: 0 },
  { name: "発明家チャレンジ", played: true, highScore: false, score: 760 },
];

const bestGames = [
  {
    award: "最高スコア",
    icon: "🏆",
    game: "歴史タイムトラベラー",
    detail: "920点",
    color: "from-yellow-400 to-amber-500",
  },
  {
    award: "最多リプレイ",
    icon: "🔁",
    game: "論理パズル王",
    detail: "12回プレイ",
    color: "from-trail-primary to-blue-500",
  },
  {
    award: "最大成長",
    icon: "📈",
    game: "生き物観察ラボ",
    detail: "+180点 UP",
    color: "from-emerald-400 to-green-500",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function MonthlyView() {
  const rankDiff = rankingPrev - rankingCurrent;

  return (
    <div className="space-y-8">
      {/* ---- 月間成長グラフ ---- */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          月間成長グラフ（30日間スキル推移）
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={skillTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={{ stroke: "#e2e8f0" }}
              interval={4}
            />
            <YAxis
              domain={[30, 100]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 13,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line
              type="monotone"
              dataKey="思考力"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="探究力"
              stroke="#7C3AED"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="創造力"
              stroke="#F59E0B"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* ---- 分野別習熟度マップ + ランキング ---- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject radar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            分野別習熟度マップ（今月 vs 先月）
          </h3>
          <SubjectChart
            subjects={subjectsCurrent}
            previousSubjects={subjectsPrevious}
            size="md"
          />
        </div>

        {/* Ranking */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
            全国ランキング推移
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">先月</p>
              <p className="text-3xl font-black text-gray-400">
                {rankingPrev}
                <span className="text-base font-bold">位</span>
              </p>
            </div>
            <div className="flex flex-col items-center">
              <svg
                className="w-10 h-10 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <span className="text-xs font-bold text-emerald-500 mt-1">
                {rankDiff}位UP
              </span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">今月</p>
              <p className="text-3xl font-black text-trail-primary">
                {rankingCurrent}
                <span className="text-base font-bold">位</span>
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold">
              上位 8.5% にランクイン！
            </span>
          </div>
        </div>
      </section>

      {/* ---- 探究マップ進捗 ---- */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
          探究マップ進捗
        </h3>
        <p className="text-xs text-gray-400 mb-5">
          プレイ済み={" "}
          <span className="inline-block w-3 h-3 rounded bg-trail-primary/80 align-middle" />{" "}
          ハイスコア={" "}
          <span className="inline-block w-3 h-3 rounded bg-trail-accent align-middle border-2 border-yellow-400" />{" "}
          未プレイ={" "}
          <span className="inline-block w-3 h-3 rounded bg-gray-200 align-middle" />
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {gameMap.map((g) => (
            <div
              key={g.name}
              className={`rounded-xl p-3 text-center text-xs font-semibold transition-all ${
                g.highScore
                  ? "bg-amber-50 border-2 border-yellow-400 text-trail-dark shadow-sm"
                  : g.played
                  ? "bg-trail-primary/10 border border-trail-primary/20 text-trail-dark"
                  : "bg-gray-100 border border-gray-200 text-gray-400"
              }`}
            >
              <p className="truncate">{g.name}</p>
              {g.played && (
                <p className="mt-1 text-[10px] text-gray-400">{g.score}点</p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400 text-center">
          {gameMap.filter((g) => g.played).length}/{gameMap.length} ゲーム達成（
          {Math.round(
            (gameMap.filter((g) => g.played).length / gameMap.length) * 100
          )}
          %）
        </p>
      </section>

      {/* ---- 月間ベストゲーム ---- */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
          月間ベストゲーム
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {bestGames.map((b) => (
            <div
              key={b.award}
              className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${b.color}`}
              />
              <span className="text-3xl">{b.icon}</span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {b.award}
              </p>
              <p className="mt-1 text-base font-bold text-trail-dark">
                {b.game}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-trail-primary">
                {b.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- 保護者向けTips ---- */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-trail-accent to-orange-400 flex items-center justify-center text-white text-lg shadow">
            💡
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-700 mb-2">
              保護者向けTips
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              お子さまは今月、理科分野で大きな成長を見せています。「なぜそうなるの？」と
              日常の中で問いかけてみましょう。例えば、料理中に「お湯が沸騰するのはなぜ？」
              と聞いてみると、ゲームで学んだ知識と実生活がつながり、
              <span className="font-bold text-amber-700">
                探究心がさらに深まります
              </span>
              。また、算数の割合は生活の中でも練習できます。
              「このジュースの20%はいくら？」など、買い物中に一緒に考えてみてください。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
