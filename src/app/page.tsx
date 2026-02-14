'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { PlatformStats } from '@/types';

// ---------------------------------------------------------------------------
// Animated counter hook
// ---------------------------------------------------------------------------

function useAnimatedCounter(target: number, duration = 1500): number {
  const [value, setValue] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const from = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(from + (target - from) * eased));
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    }

    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Stats display component
// ---------------------------------------------------------------------------

function AnimatedStat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  const animated = useAnimatedCounter(value);
  return (
    <div className="text-center">
      <div className="stat-number">
        {animated.toLocaleString()}
        {suffix && <span className="text-xl ml-1">{suffix}</span>}
      </div>
      <div className="text-sm text-gray-500 mt-1 font-medium">{label}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill card component
// ---------------------------------------------------------------------------

function SkillCard({
  emoji,
  title,
  description,
  color,
}: {
  emoji: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="card group text-center">
      <div
        className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}
      >
        {emoji}
      </div>
      <h3 className="text-lg font-bold text-trail-dark mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subject category card
// ---------------------------------------------------------------------------

function SubjectCard({
  emoji,
  title,
  color,
}: {
  emoji: string;
  title: string;
  color: string;
}) {
  return (
    <Link
      href={`/games?category=${title}`}
      className={`card-game flex flex-col items-center justify-center p-6 bg-gradient-to-br ${color} text-white group`}
    >
      <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">
        {emoji}
      </span>
      <span className="font-bold text-lg">{title}</span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Pricing plan component
// ---------------------------------------------------------------------------

function PricingCard({
  name,
  price,
  priceLabel,
  features,
  isHighlighted,
  cta,
  ctaHref,
}: {
  name: string;
  price: string;
  priceLabel: string;
  features: string[];
  isHighlighted?: boolean;
  cta: string;
  ctaHref: string;
}) {
  return (
    <div
      className={`rounded-2xl p-6 md:p-8 flex flex-col ${
        isHighlighted
          ? 'bg-gradient-to-br from-trail-primary to-trail-secondary text-white shadow-2xl scale-105 ring-4 ring-trail-primary/20'
          : 'bg-white shadow-lg border border-gray-100'
      }`}
    >
      <div className="mb-6">
        <h3
          className={`text-lg font-bold mb-2 ${
            isHighlighted ? 'text-white' : 'text-trail-dark'
          }`}
        >
          {name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-3xl font-black ${
              isHighlighted ? 'text-white' : 'text-trail-primary'
            }`}
          >
            {price}
          </span>
          <span
            className={`text-sm ${
              isHighlighted ? 'text-white/80' : 'text-gray-400'
            }`}
          >
            {priceLabel}
          </span>
        </div>
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span
              className={`mt-0.5 shrink-0 ${
                isHighlighted ? 'text-trail-accent' : 'text-trail-success'
              }`}
            >
              &#10003;
            </span>
            <span className={isHighlighted ? 'text-white/90' : 'text-gray-600'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`block text-center py-3 px-6 rounded-xl font-bold transition-all ${
          isHighlighted
            ? 'bg-white text-trail-primary hover:bg-gray-100 shadow-lg'
            : 'bg-trail-primary/10 text-trail-primary hover:bg-trail-primary/20'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function HomePage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    // デモ用モックデータ（Supabase接続後はAPIから取得に切り替え）
    setStats({
      totalPlayers: 1247,
      totalPlayTime: 184320,
      todayPlayers: 38,
      totalGames: 5,
      highestLevel: 42,
    });
  }, []);

  const totalHours = stats ? Math.floor(stats.totalPlayTime / 3600) : 0;

  return (
    <div className="overflow-x-hidden">
      {/* ================================================================= */}
      {/* Hero Section */}
      {/* ================================================================= */}
      <section className="relative py-16 md:py-28 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-trail-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-trail-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-trail-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-trail-primary/10 text-trail-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-trail-success rounded-full animate-pulse" />
            探究学習ゲームプラットフォーム
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-trail-dark leading-tight mb-6">
            自分で考える
            <br />
            <span className="bg-gradient-to-r from-trail-primary via-trail-secondary to-trail-accent bg-clip-text text-transparent">
              習慣を作る場所
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            遊んでるだけなのに、考える力がつく。
            <br className="hidden sm:block" />
            探究学習ゲームプラットフォーム
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/games"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-trail-primary to-trail-secondary text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              無料でゲームをプレイ &rarr;
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-white text-trail-dark rounded-2xl font-bold text-lg shadow-md hover:shadow-lg border border-gray-200 transition-all"
            >
              料金プランを見る
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Platform Stats Section */}
      {/* ================================================================= */}
      <section className="py-12 md:py-16 px-4 bg-white/60 backdrop-blur-sm border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          {stats && (
            <p className="text-center text-lg font-bold text-trail-primary mb-8">
              みんなで{totalHours.toLocaleString()}時間探究中!
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            <AnimatedStat
              label="総プレイ人数"
              value={stats?.totalPlayers ?? 0}
              suffix="人"
            />
            <AnimatedStat
              label="総プレイ時間"
              value={totalHours}
              suffix="時間"
            />
            <AnimatedStat
              label="今日のプレイ人数"
              value={stats?.todayPlayers ?? 0}
              suffix="人"
            />
            <AnimatedStat
              label="公開ゲーム数"
              value={stats?.totalGames ?? 0}
              suffix="本"
            />
            <AnimatedStat
              label="最高レベル"
              value={stats?.highestLevel ?? 0}
              suffix="Lv"
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Three Core Skills Section */}
      {/* ================================================================= */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              TRAILで育つ<span className="text-trail-primary">三大要素</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              すべてのゲームは3つのスキル軸で設計されています
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <SkillCard
              emoji="&#129504;"
              title="思考力"
              description="情報を整理し、論理的に判断する力。クイズやパズルで「なぜそうなるの？」を考え抜く体験を通じて鍛えられます。"
              color="bg-blue-100"
            />
            <SkillCard
              emoji="&#128269;"
              title="探究力"
              description="問いを立て、調べ、深掘りする力。迷路やシミュレーションで「もっと知りたい！」という好奇心を刺激します。"
              color="bg-purple-100"
            />
            <SkillCard
              emoji="&#128161;"
              title="創造力"
              description="新しいアイデアを生み出し表現する力。カードゲームやシミュレーションで「こうしたらどうなる？」を試せます。"
              color="bg-amber-100"
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Subject Categories Section */}
      {/* ================================================================= */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-white to-trail-light">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              教科から<span className="text-trail-secondary">探す</span>
            </h2>
            <p className="text-gray-500">興味のある教科のゲームで学ぼう</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <SubjectCard
              emoji="&#129514;"
              title="理科"
              color="from-emerald-400 to-teal-500"
            />
            <SubjectCard
              emoji="&#127758;"
              title="社会"
              color="from-amber-400 to-orange-500"
            />
            <SubjectCard
              emoji="&#128290;"
              title="算数"
              color="from-blue-400 to-indigo-500"
            />
            <SubjectCard
              emoji="&#127912;"
              title="美術"
              color="from-pink-400 to-rose-500"
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Pricing Section */}
      {/* ================================================================= */}
      <section id="pricing" className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              <span className="text-trail-primary">料金</span>プラン
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              まずは無料プランでお試しください。いつでもアップグレードできます。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-start">
            <PricingCard
              name="無料プラン"
              price="0円"
              priceLabel=""
              features={[
                '公開ゲーム無制限プレイ',
                '基本レベルシステム',
                'ランキング参加',
                '広告表示あり',
              ]}
              cta="無料で始める"
              ctaHref="/signup"
            />
            <PricingCard
              name="モニタープラン"
              price="0円"
              priceLabel="/ 2週間無料"
              features={[
                '無料プランの全機能',
                '全ゲームプレイ可能',
                '詳細スキルレポート',
                '広告非表示',
                '2週間の無料体験期間',
                '体験後は有料プランへ自動移行',
              ]}
              isHighlighted
              cta="2週間無料で試す"
              ctaHref="/signup?plan=monitor"
            />
            <PricingCard
              name="有料プラン"
              price="980円"
              priceLabel="/ 月"
              features={[
                '無料プランの全機能',
                '有料限定ゲームをプレイ可能',
                '詳細スキルレポート',
                '広告非表示',
                '保護者ダッシュボード',
                '学習進捗メール通知',
                'CSV エクスポート',
                '優先サポート',
              ]}
              cta="有料プランを始める"
              ctaHref="/signup?plan=paid"
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Final CTA Section */}
      {/* ================================================================= */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-trail-primary to-trail-secondary rounded-3xl p-10 md:p-16 text-white shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-black mb-4">
              さあ、探究の旅を始めよう
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              会員登録不要ですぐにプレイできます。
              まずは1つゲームを遊んでみてください。
            </p>
            <Link
              href="/games"
              className="inline-block px-10 py-4 bg-white text-trail-primary rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              無料でゲームをプレイ &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
