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
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                         */
/* ------------------------------------------------------------------ */

// 12 weeks of data (3 months)
const longTermTrend = [
  { week: "1月1週", 思考力: 48, 探究力: 42, 創造力: 38 },
  { week: "1月2週", 思考力: 50, 探究力: 45, 創造力: 40 },
  { week: "1月3週", 思考力: 53, 探究力: 50, 創造力: 42 },
  { week: "1月4週", 思考力: 58, 探究力: 52, 創造力: 45 },
  { week: "2月1週", 思考力: 60, 探究力: 58, 創造力: 48 },
  { week: "2月2週", 思考力: 62, 探究力: 63, 創造力: 50 },
  { week: "2月3週", 思考力: 65, 探究力: 68, 創造力: 55 },
  { week: "2月4週", 思考力: 70, 探究力: 72, 創造力: 58 },
  { week: "3月1週", 思考力: 73, 探究力: 76, 創造力: 60 },
  { week: "3月2週", 思考力: 75, 探究力: 80, 創造力: 62 },
  { week: "3月3週", 思考力: 78, 探究力: 83, 創造力: 65 },
  { week: "3月4週", 思考力: 82, 探究力: 88, 創造力: 68 },
];

const combinedRadarData = [
  { axis: "思考力", value: 82, fullMark: 100 },
  { axis: "探究力", value: 88, fullMark: 100 },
  { axis: "創造力", value: 68, fullMark: 100 },
  { axis: "理科", value: 85, fullMark: 100 },
  { axis: "社会", value: 78, fullMark: 100 },
  { axis: "算数", value: 62, fullMark: 100 },
  { axis: "美術", value: 70, fullMark: 100 },
];

const comparisonData = [
  { category: "思考力", child: 82, average: 65 },
  { category: "探究力", child: 88, average: 60 },
  { category: "創造力", child: 68, average: 62 },
  { category: "理科", child: 85, average: 58 },
  { category: "社会", child: 78, average: 63 },
  { category: "算数", child: 62, average: 67 },
  { category: "美術", child: 70, average: 55 },
];

const suggestions = [
  {
    icon: "🏛",
    title: "博物館の科学展に行ってみましょう",
    description:
      "理科分野のスコアが非常に高く、実物に触れることでさらに探究心が深まります。国立科学博物館の特別展がおすすめです。",
    color: "from-trail-primary to-emerald-500",
  },
  {
    icon: "📐",
    title: "算数を日常生活で練習",
    description:
      "割合・比率の分野がやや苦手です。買い物での割引計算や料理の分量調整など、生活の中で「数字で考える」機会を増やしてみてください。",
    color: "from-trail-accent to-orange-400",
  },
  {
    icon: "🎨",
    title: "アート系の体験教室に参加",
    description:
      "創造力の伸びしろが大きいです。絵画教室やものづくりワークショップに参加すると、「自分で作る喜び」が創造力スコアの飛躍につながります。",
    color: "from-trail-secondary to-amber-500",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function QuarterlyView() {
  return (
    <div className="space-y-8">
      {/* ---- 長期成長曲線 ---- */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
          長期成長曲線（3ヶ月）
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          12週間にわたるスキルスコアの推移
        </p>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={longTermTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="week"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={{ stroke: "#e2e8f0" }}
              angle={-30}
              textAnchor="end"
              height={50}
            />
            <YAxis
              domain={[20, 100]}
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
              stroke="#16A34A"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="探究力"
              stroke="#FACC15"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="創造力"
              stroke="#38BDF8"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* ---- 探究傾向分析 ---- */}
      <section className="bg-gradient-to-br from-teal-50 to-amber-50 rounded-2xl border border-teal-100 p-5 sm:p-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          探究傾向分析
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-trail-secondary to-teal-500 flex items-center justify-center shadow-lg">
            <span className="text-4xl">🔬</span>
          </div>
          <div>
            <p className="text-xs font-bold text-trail-secondary uppercase tracking-wider mb-1">
              探究タイプ
            </p>
            <h4 className="text-xl font-black text-trail-dark mb-2">
              科学探究型
            </h4>
            <p className="text-sm leading-relaxed text-gray-600">
              自然現象に強い興味を持ち、「なぜそうなるのか」を実験的に確かめるのが得意なタイプです。
              因果関係を論理的に考える力が高く、理科分野のスコアが突出しています。
              また、歴史的な出来事の背景にも興味を示し、複数の分野をつなげて考える
              「横断的探究力」も育ってきています。
            </p>
          </div>
        </div>
      </section>

      {/* ---- スキルバランス評価 + 同学年比較 ---- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Combined radar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            スキルバランス評価（総合）
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="65%"
              data={combinedRadarData}
            >
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: "#334155", fontSize: 11, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                axisLine={false}
              />
              <Radar
                name="スコア"
                dataKey="value"
                stroke="#FACC15"
                fill="#FACC15"
                fillOpacity={0.2}
                strokeWidth={2.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Grade comparison bar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            同学年との比較
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={comparisonData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="category"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                domain={[0, 100]}
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
              <Bar
                dataKey="child"
                name="ゆうたくん"
                fill="#16A34A"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="average"
                name="学年平均"
                fill="#cbd5e1"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-50 text-trail-primary text-sm font-bold">
              探究マップの広さ TOP 20%
            </span>
          </div>
        </div>
      </section>

      {/* ---- AI総合コメント ---- */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-trail-primary to-trail-secondary flex items-center justify-center text-white text-sm font-black shadow">
            AI
          </div>
          <div>
            <h3 className="text-sm font-bold text-trail-primary mb-2">
              3ヶ月総合コメント
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              ゆうたくんは過去3ヶ月間で、すべてのスキルにおいて着実な成長を見せています。
              特に
              <span className="font-bold text-trail-secondary">探究力</span>
              は42から88へと
              <span className="font-bold text-emerald-600">
                +46ポイント
              </span>
              の飛躍的な伸びを記録しました。これは同学年の中でも上位5%に入る成長速度です。
            </p>
            <p className="text-sm leading-relaxed text-gray-700 mt-2">
              理科・社会の分野では「なぜそうなるのか」を深く考える姿勢が見られ、
              単なる暗記ではなく
              <span className="font-bold text-trail-dark">
                本質的な理解力
              </span>
              が育っています。一方、算数の
              <span className="font-bold text-amber-600">割合・比率</span>
              の分野にはまだ伸びしろがあります。ゲーム形式での反復練習と、
              日常生活での応用機会を増やすことで、今後1ヶ月で大きく改善が期待できます。
            </p>
            <p className="text-sm leading-relaxed text-gray-700 mt-2">
              創造力については、美術系ゲームへの挑戦頻度を少し増やすことで、
              バランスの取れた「探究者」へと成長するでしょう。全体として、
              <span className="font-bold text-trail-primary">
                非常に順調な成長軌道
              </span>
              にあります。
            </p>
          </div>
        </div>
      </section>

      {/* ---- 保護者への提案 ---- */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">
          保護者への提案
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestions.map((s) => (
            <div
              key={s.title}
              className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${s.color}`}
              />
              <span className="text-3xl">{s.icon}</span>
              <h4 className="mt-3 text-sm font-bold text-trail-dark leading-snug">
                {s.title}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
