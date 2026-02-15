'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { PlatformStats } from '@/types';

// ---------------------------------------------------------------------------
// Intersection Observer hook – triggers CSS class "visible" on scroll
// ---------------------------------------------------------------------------

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// ---------------------------------------------------------------------------
// Mouse-tracking parallax hook for hero background
// ---------------------------------------------------------------------------

function useParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      el!.style.transform = `translate(${x}px, ${y}px)`;
    }

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return ref;
}

// ---------------------------------------------------------------------------
// Animated counter hook (starts when visible)
// ---------------------------------------------------------------------------

function useAnimatedCounter(target: number, duration = 1500): {
  value: number;
  ref: React.RefObject<HTMLDivElement>;
} {
  const [value, setValue] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el || target === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(target * eased));
            if (progress < 1) {
              animRef.current = requestAnimationFrame(tick);
            }
          };

          animRef.current = requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [target, duration]);

  return { value, ref: elRef };
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
  const counter = useAnimatedCounter(value);
  return (
    <div ref={counter.ref} className="text-center">
      <div className="stat-number">
        {counter.value.toLocaleString()}
        {suffix && <span className="text-xl ml-1">{suffix}</span>}
      </div>
      <div className="text-sm text-gray-500 mt-1 font-medium">{label}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Floating decoration shapes
// ---------------------------------------------------------------------------

function FloatingShapes() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* ---- Soft gradient blobs (控えめ) ---- */}
      <div className="absolute -top-24 -left-24 w-[450px] h-[350px] bg-trail-primary/10 blur-[100px] animate-aurora-morph" />
      <div className="absolute -bottom-32 -right-24 w-[400px] h-[300px] bg-trail-secondary/10 blur-[100px] animate-aurora-morph" style={{ animationDelay: '-5s' }} />

      {/* ---- Trail SVG decorations (控えめに) ---- */}

      {/* Compass */}
      <svg className="absolute top-[12%] left-[7%] w-14 h-14 text-trail-primary/15 animate-float-drift" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="12,2 14.5,9.5 12,7.5 9.5,9.5" fill="currentColor" opacity="0.4" />
        <polygon points="12,22 14.5,14.5 12,16.5 9.5,14.5" fill="currentColor" opacity="0.2" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
      </svg>

      {/* Sparkle star */}
      <svg className="absolute top-[18%] right-[14%] w-7 h-7 text-trail-secondary/30 animate-twinkle" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
      </svg>

      {/* Leaf */}
      <svg className="absolute bottom-[28%] left-[16%] w-10 h-10 text-trail-success/20 animate-float" style={{ animationDelay: '2s' }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 8.5-3 11-8 0 0-2-2-5-2a7.81 7.81 0 00-2.5.42C13 8.55 16 5 21 3c0 0-3-1-6 1a14 14 0 00-2 4z" />
      </svg>

      {/* Mountain */}
      <svg className="absolute top-[52%] right-[9%] w-12 h-12 text-trail-primary/15 animate-float-slow" style={{ animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M3 20L9 8l4 6 3-4 5 10H3z" />
      </svg>

      {/* Ring */}
      <div className="absolute top-[8%] right-[32%] w-10 h-10 border-[1.5px] border-trail-primary/15 rounded-full animate-spin-slow" style={{ animationDelay: '1.5s' }} />

      {/* Trail dots path */}
      <svg className="absolute top-[62%] left-[4%] w-56 h-28 text-trail-primary/10 animate-float-slow" style={{ animationDelay: '4s' }} viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round">
        <path d="M10 80 Q50 20, 100 50 T190 30" />
      </svg>

      {/* Small twinkle */}
      <svg className="absolute top-[35%] left-[34%] w-5 h-5 text-trail-secondary/25 animate-twinkle" style={{ animationDelay: '0.8s' }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scroll-down indicator
// ---------------------------------------------------------------------------

function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center mt-12 animate-scroll-down">
      <span className="text-xs text-gray-400 tracking-widest mb-2">SCROLL</span>
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className="text-gray-300">
        <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="2" />
        <circle cx="10" cy="8" r="2" fill="currentColor" className="animate-scroll-down" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill card component with tilt hover
// ---------------------------------------------------------------------------

function SkillCard({
  emoji,
  title,
  description,
  color,
  delay,
}: {
  emoji: string;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="card card-tilt group text-center"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`w-20 h-20 mx-auto mb-5 rounded-2xl ${color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
      >
        {emoji}
      </div>
      <h3 className="text-xl font-black text-trail-dark mb-3">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subject category card with animated gradient border
// ---------------------------------------------------------------------------

function SubjectCard({
  emoji,
  title,
  color,
  delay,
}: {
  emoji: string;
  title: string;
  color: string;
  delay: number;
}) {
  return (
    <Link
      href={`/games?category=${title}`}
      className={`card-game flex flex-col items-center justify-center p-8 bg-gradient-to-br ${color} text-white group relative overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Shine overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      <span className="text-5xl mb-3 group-hover:scale-125 group-hover:animate-wiggle transition-transform duration-300">
        {emoji}
      </span>
      <span className="font-bold text-lg">{title}</span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Pricing plan component with hover glow
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
      className={`rounded-2xl p-6 md:p-8 flex flex-col card-tilt relative overflow-hidden ${
        isHighlighted
          ? 'bg-gradient-to-br from-trail-primary to-trail-secondary text-white shadow-2xl scale-105 ring-4 ring-trail-primary/20'
          : 'bg-white shadow-lg border border-gray-100'
      }`}
    >
      {/* Animated ring for highlighted card */}
      {isHighlighted && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full animate-ripple" />
      )}

      <div className="mb-6 relative">
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

      <ul className="flex-1 space-y-3 mb-8 relative">
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
        className={`block text-center py-3 px-6 rounded-xl font-bold transition-all relative ${
          isHighlighted
            ? 'bg-white text-trail-primary hover:bg-gray-100 shadow-lg hover:scale-105'
            : 'bg-trail-primary/10 text-trail-primary hover:bg-trail-primary/20 hover:scale-105'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marquee ticker section
// ---------------------------------------------------------------------------

function MarqueeTicker() {
  const items = [
    '思考力を鍛える',
    '探究力を伸ばす',
    '創造力を育む',
    '理科',
    '社会',
    '算数',
    '美術',
    '好奇心を刺激',
    '自分で考える習慣',
    '遊びながら学ぶ',
  ];

  return (
    <div className="py-4 bg-gradient-to-r from-trail-primary via-trail-secondary to-trail-primary overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-6 text-white/90 font-bold text-sm"
          >
            <span className="w-1.5 h-1.5 bg-trail-accent rounded-full mr-3 shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function HomePage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [heroReady, setHeroReady] = useState(false);
  const parallaxRef = useParallax();

  // Scroll reveal refs for each section
  const statsRef = useScrollReveal();
  const skillsHeadRef = useScrollReveal();
  const skillsGridRef = useScrollReveal();
  const subjectsHeadRef = useScrollReveal();
  const subjectsGridRef = useScrollReveal();
  const pricingHeadRef = useScrollReveal();
  const pricingGridRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  useEffect(() => {
    // Trigger hero entrance animation
    requestAnimationFrame(() => setHeroReady(true));

    // Demo mock data
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
      <section className="relative py-20 md:py-32 px-4 overflow-hidden min-h-[90vh] flex items-center aurora-bg noise-overlay">
        {/* Dot grid texture for depth */}
        <div className="absolute inset-0 dot-grid-bg pointer-events-none" aria-hidden />
        {/* Parallax floating background */}
        <div ref={parallaxRef} className="absolute inset-0 parallax-bg">
          <FloatingShapes />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-trail-primary/10 text-trail-primary px-4 py-2 rounded-full text-sm font-medium mb-8 transition-all duration-700 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="w-2 h-2 bg-trail-success rounded-full animate-pulse" />
            探究学習ゲームプラットフォーム
          </div>

          {/* Headline – staggered entrance */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-trail-dark leading-tight mb-6">
            <span
              className={`inline-block transition-all duration-700 delay-200 ${
                heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              自分で考える
            </span>
            <br />
            <span
              className={`inline-block bg-gradient-to-r from-trail-primary via-trail-secondary to-trail-accent bg-clip-text text-transparent bg-[length:200%_200%] gradient-text-animated transition-all duration-700 delay-500 ${
                heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              習慣を作る場所
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-700 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            遊んでるだけなのに、考える力がつく。
            <br className="hidden sm:block" />
            探究学習ゲームプラットフォーム
          </p>

          {/* CTA – staggered entrance */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-1000 ${
              heroReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Link
              href="/games"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-trail-primary to-trail-secondary text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all relative overflow-hidden"
            >
              {/* Shine sweep on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">無料でゲームをプレイ &rarr;</span>
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-white text-trail-dark rounded-2xl font-bold text-lg shadow-md hover:shadow-lg border border-gray-200 hover:border-trail-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              料金プランを見る
            </Link>
          </div>

          {/* Scroll indicator */}
          <ScrollIndicator />
        </div>
      </section>

      {/* ================================================================= */}
      {/* Marquee Ticker */}
      {/* ================================================================= */}
      <MarqueeTicker />

      {/* ================================================================= */}
      {/* Platform Stats Section */}
      {/* ================================================================= */}
      <section className="py-14 md:py-20 px-4 bg-white/60 backdrop-blur-sm border-b border-gray-100 relative noise-overlay">
        <div ref={statsRef} className="max-w-5xl mx-auto reveal">
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
      <section className="py-20 md:py-28 px-4 relative overflow-hidden">
        {/* Subtle background blob */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-green-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-0 w-56 h-56 bg-yellow-50/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto">
          <div ref={skillsHeadRef} className="text-center mb-14 reveal">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              TRAILで育つ<span className="text-trail-primary">三大要素</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              すべてのゲームは3つのスキル軸で設計されています
            </p>
          </div>
          <div ref={skillsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 stagger">
            <SkillCard
              emoji="&#129504;"
              title="思考力"
              description="情報を整理し、論理的に判断する力。クイズやパズルで「なぜそうなるの？」を考え抜く体験を通じて鍛えられます。"
              color="bg-emerald-100"
              delay={0}
            />
            <SkillCard
              emoji="&#128269;"
              title="探究力"
              description="問いを立て、調べ、深掘りする力。迷路やシミュレーションで「もっと知りたい！」という好奇心を刺激します。"
              color="bg-amber-100"
              delay={150}
            />
            <SkillCard
              emoji="&#128161;"
              title="創造力"
              description="新しいアイデアを生み出し表現する力。カードゲームやシミュレーションで「こうしたらどうなる？」を試せます。"
              color="bg-sky-100"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Subject Categories Section */}
      {/* ================================================================= */}
      <section className="py-20 md:py-24 px-4 bg-gradient-to-b from-white to-trail-light relative overflow-hidden">

        <div className="max-w-5xl mx-auto">
          <div ref={subjectsHeadRef} className="text-center mb-14 reveal">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              教科から<span className="text-trail-secondary">探す</span>
            </h2>
            <p className="text-gray-500">興味のある教科のゲームで学ぼう</p>
          </div>
          <div ref={subjectsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 stagger">
            <SubjectCard
              emoji="&#129514;"
              title="理科"
              color="from-emerald-400 to-teal-500"
              delay={0}
            />
            <SubjectCard
              emoji="&#127758;"
              title="社会"
              color="from-amber-400 to-orange-500"
              delay={100}
            />
            <SubjectCard
              emoji="&#128290;"
              title="算数"
              color="from-emerald-600 to-teal-600"
              delay={200}
            />
            <SubjectCard
              emoji="&#127912;"
              title="美術"
              color="from-pink-400 to-rose-500"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Pricing Section */}
      {/* ================================================================= */}
      <section id="pricing" className="py-20 md:py-28 px-4 relative overflow-hidden bg-trail-light">

        <div className="max-w-5xl mx-auto">
          <div ref={pricingHeadRef} className="text-center mb-14 reveal">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              <span className="text-trail-primary">料金</span>プラン
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              まずは無料プランでお試しください。いつでもアップグレードできます。
            </p>
          </div>
          <div ref={pricingGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-start stagger">
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
      <section className="py-20 md:py-28 px-4 relative">
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center reveal-scale">
          <div className="bg-gradient-to-br from-trail-primary to-green-600 rounded-3xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-white/10 rounded-full" />

            <h2 className="text-2xl md:text-4xl font-black mb-4 relative">
              さあ、探究の旅を始めよう
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto relative">
              会員登録不要ですぐにプレイできます。
              まずは1つゲームを遊んでみてください。
            </p>
            <Link
              href="/games"
              className="group inline-block px-10 py-4 bg-white text-trail-primary rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-trail-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">無料でゲームをプレイ &rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
