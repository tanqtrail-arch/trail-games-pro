"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// ---------------------------------------------------------------------------
// Plan data
// ---------------------------------------------------------------------------

const plans = [
  {
    id: "free",
    name: "フリー",
    price: 0,
    priceLabel: "¥0",
    period: "永久無料",
    description: "まずは気軽に始めたい方に",
    features: [
      { text: "公開ゲーム 無制限プレイ", included: true },
      { text: "基本レベルシステム", included: true },
      { text: "ランキング参加", included: true },
      { text: "週間学習レポート (簡易版)", included: true },
      { text: "全ゲーム解放", included: false },
      { text: "詳細スキル分析", included: false },
      { text: "広告非表示", included: false },
      { text: "保護者ダッシュボード", included: false },
    ],
    cta: "無料で始める",
    ctaStyle: "border-2 border-trail-primary text-trail-primary hover:bg-trail-primary/5",
    highlight: false,
  },
  {
    id: "basic",
    name: "ベーシック",
    price: 980,
    priceLabel: "¥980",
    period: "/ 月",
    description: "お子さまの学びを本格サポート",
    features: [
      { text: "公開ゲーム 無制限プレイ", included: true },
      { text: "基本レベルシステム", included: true },
      { text: "ランキング参加", included: true },
      { text: "週間 + 月間 学習レポート", included: true },
      { text: "全ゲーム解放", included: true },
      { text: "詳細スキル分析", included: true },
      { text: "広告非表示", included: true },
      { text: "保護者ダッシュボード", included: true },
    ],
    cta: "ベーシックを始める",
    ctaStyle: "bg-gradient-to-r from-trail-primary to-trail-secondary text-white shadow-lg hover:opacity-90",
    highlight: true,
    badge: "人気 No.1",
  },
  {
    id: "pro",
    name: "プロ",
    price: 2980,
    priceLabel: "¥2,980",
    period: "/ 月",
    description: "教室・塾など複数人の管理に",
    features: [
      { text: "ベーシックの全機能", included: true },
      { text: "クラス管理 (無制限)", included: true },
      { text: "オリジナルゲーム作成", included: true },
      { text: "CSVエクスポート", included: true },
      { text: "優先サポート", included: true },
      { text: "API アクセス", included: true },
      { text: "カスタムブランディング", included: true },
      { text: "複数管理者", included: true },
    ],
    cta: "プロを始める",
    ctaStyle: "border-2 border-slate-800 text-slate-800 hover:bg-slate-50",
    highlight: false,
  },
];

const faqs = [
  {
    q: "無料プランはいつまで使えますか？",
    a: "フリープランは期間制限なく永久に無料でご利用いただけます。公開ゲームは無制限にプレイ可能です。",
  },
  {
    q: "プランはいつでも変更・解約できますか？",
    a: "はい、いつでもプランの変更・解約が可能です。解約しても、現在の請求期間が終了するまではサービスをご利用いただけます。",
  },
  {
    q: "支払い方法は何がありますか？",
    a: "クレジットカード（Visa, Mastercard, AMEX, JCB）に対応しています。Stripeの安全な決済システムを使用しています。",
  },
  {
    q: "子ども2人以上で使う場合はどうなりますか？",
    a: "ベーシックプランは1アカウントにつき1人分です。お子さまが複数いる場合は、それぞれにアカウントを作成してください。教室・塾での利用にはプロプランがおすすめです。",
  },
  {
    q: "返金は可能ですか？",
    a: "初回登録から14日以内であれば、理由を問わず全額返金いたします。お気軽にお試しください。",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PricingPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-trail-light to-white pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-black text-trail-dark mb-4">
            シンプルな料金プラン
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            お子さまの探究心を育てる最適なプランを選びましょう。
            いつでもプラン変更・解約が可能です。
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-4 -mt-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-6 transition-all ${
                plan.highlight
                  ? "border-trail-primary shadow-xl shadow-trail-primary/10 scale-[1.02]"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-trail-primary to-trail-secondary text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-trail-dark">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-black text-trail-dark">
                    {plan.priceLabel}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    {f.included ? (
                      <svg
                        className="w-4 h-4 text-trail-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <span
                      className={
                        f.included ? "text-gray-700" : "text-gray-400"
                      }
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {user?.plan_type === plan.id ? (
                <div className="w-full py-3 text-center text-sm font-bold text-gray-400 bg-gray-100 rounded-xl">
                  現在のプラン
                </div>
              ) : (
                <Link
                  href={user ? "#" : "/auth"}
                  className={`block w-full py-3 text-center text-sm font-bold rounded-xl transition-all ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            安全なStripe決済
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            14日間返金保証
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            いつでも解約OK
          </span>
        </div>
      </section>

      {/* Comparison table (desktop) */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-trail-dark text-center mb-8">
            プラン比較表
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-500 w-1/3">機能</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-500">フリー</th>
                  <th className="text-center py-3 px-4 font-bold text-trail-primary bg-trail-primary/5">ベーシック</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-500">プロ</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "ゲームプレイ", free: "公開のみ", basic: "全て", pro: "全て" },
                  { feature: "レベルシステム", free: "O", basic: "O", pro: "O" },
                  { feature: "ランキング", free: "O", basic: "O", pro: "O" },
                  { feature: "学習レポート", free: "簡易版", basic: "詳細版", pro: "詳細版" },
                  { feature: "広告非表示", free: "X", basic: "O", pro: "O" },
                  { feature: "保護者ダッシュボード", free: "X", basic: "O", pro: "O" },
                  { feature: "スキル分析", free: "X", basic: "O", pro: "O" },
                  { feature: "クラス管理", free: "X", basic: "1クラス", pro: "無制限" },
                  { feature: "オリジナルゲーム作成", free: "X", basic: "X", pro: "O" },
                  { feature: "CSVエクスポート", free: "X", basic: "X", pro: "O" },
                  { feature: "APIアクセス", free: "X", basic: "X", pro: "O" },
                  { feature: "サポート", free: "コミュニティ", basic: "メール", pro: "優先対応" },
                ].map((row, i) => (
                  <tr key={row.feature} className={`border-b border-gray-100 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    <td className="py-2.5 px-4 font-medium text-gray-700">{row.feature}</td>
                    {[row.free, row.basic, row.pro].map((val, j) => (
                      <td key={j} className={`py-2.5 px-4 text-center ${j === 1 ? "bg-trail-primary/5" : ""}`}>
                        {val === "O" ? (
                          <svg className="w-5 h-5 text-trail-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : val === "X" ? (
                          <span className="text-gray-300">-</span>
                        ) : (
                          <span className="text-gray-600 text-xs font-medium">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-trail-dark text-center mb-8">
          よくある質問
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-bold text-trail-dark pr-4">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === i ? "max-h-40" : "max-h-0"
                }`}
              >
                <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-trail-primary to-trail-secondary py-16 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            お子さまの探究心を、今日から育てよう
          </h2>
          <p className="text-sm text-white/80 mb-8">
            まずは無料プランで始めて、お子さまの反応を見てみましょう。
          </p>
          <Link
            href="/auth"
            className="inline-block px-8 py-3 bg-white text-trail-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            無料で始める
          </Link>
        </div>
      </section>
    </div>
  );
}
