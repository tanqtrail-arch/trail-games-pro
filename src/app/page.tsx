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
  icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
}) {
  const counter = useAnimatedCounter(value);
  return (
    <div ref={counter.ref} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-trail-primary/10 flex items-center justify-center shrink-0">
        <span className="text-lg" dangerouslySetInnerHTML={{ __html: icon }} />
      </div>
      <div>
        <div className="text-2xl font-black text-trail-primary leading-tight">
          {counter.value.toLocaleString()}
          {suffix && <span className="text-base ml-0.5">{suffix}</span>}
        </div>
        <div className="text-xs text-gray-500 font-medium">{label}</div>
      </div>
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
    <div className="flex flex-col items-center mt-8 animate-scroll-down">
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
// Sticky navigation bar
// ---------------------------------------------------------------------------

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'ゲーム', href: '/games' },
    { label: '特徴', href: '#features' },
    { label: '料金', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-trail-primary to-trail-secondary flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 20L9 8l4 6 3-4 5 10" />
            </svg>
          </div>
          <span className="font-black text-xl text-trail-dark">TRAIL</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-trail-primary ${
                scrolled ? 'text-trail-dark' : 'text-trail-dark/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="text-sm font-bold bg-trail-primary text-white px-5 py-2 rounded-xl hover:opacity-90 transition-all shadow-sm"
          >
            無料で始める
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-trail-dark"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col p-4 gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-trail-dark py-3 px-4 rounded-lg hover:bg-trail-light transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/signup"
              className="text-sm font-bold bg-trail-primary text-white py-3 px-4 rounded-xl text-center mt-2"
              onClick={() => setMenuOpen(false)}
            >
              無料で始める
            </Link>
          </nav>
        </div>
      )}
    </header>
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
      <Navbar />

      {/* ================================================================= */}
      {/* Hero Section */}
      {/* ================================================================= */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-4 overflow-hidden min-h-[80vh] flex items-center aurora-bg noise-overlay">
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
            className={`text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed transition-all duration-700 delay-700 ${
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
      <section className="py-10 md:py-14 px-4 bg-white border-b border-gray-100">
        <div ref={statsRef} className="max-w-6xl mx-auto reveal">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            <AnimatedStat
              label="総プレイ人数"
              value={stats?.totalPlayers ?? 0}
              suffix="人"
              icon="&#128101;"
            />
            <AnimatedStat
              label="総プレイ時間"
              value={totalHours}
              suffix="時間"
              icon="&#9201;"
            />
            <AnimatedStat
              label="今日のプレイ人数"
              value={stats?.todayPlayers ?? 0}
              suffix="人"
              icon="&#127775;"
            />
            <AnimatedStat
              label="公開ゲーム数"
              value={stats?.totalGames ?? 0}
              suffix="本"
              icon="&#127918;"
            />
            <AnimatedStat
              label="最高レベル"
              value={stats?.highestLevel ?? 0}
              suffix="Lv"
              icon="&#127942;"
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TRAILの特徴 — Features Section */}
      {/* ================================================================= */}
      <section id="features" className="py-14 md:py-20 px-4 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 reveal">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              TRAILが<span className="text-trail-primary">選ばれる理由</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              「遊んでるだけ」なのに、考える力がつく仕組み
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                icon: '&#129302;',
                title: 'AIが学習カリキュラムを提案',
                description: 'お子さまのプレイ履歴とスキルバランスをAIが分析。得意を伸ばし、苦手を補う最適なゲームを自動でおすすめします。',
                color: 'bg-green-50 border-green-200',
              },
              {
                icon: '&#128202;',
                title: '保護者ダッシュボードで見える化',
                description: '思考力・探究力・創造力の成長をグラフで確認。「今日何をしたか」「どれだけ伸びたか」がひと目でわかります。',
                color: 'bg-yellow-50 border-yellow-200',
              },
              {
                icon: '&#127922;',
                title: '専用アプリ・教材は不要',
                description: 'ブラウザだけでプレイ可能。タブレット、スマホ、PCどれでもOK。特別な機器や教材の購入は一切不要です。',
                color: 'bg-sky-50 border-sky-200',
              },
              {
                icon: '&#128640;',
                title: '教科横断の探究ゲーム',
                description: '理科・社会・算数・美術を横断するゲームで、教科書だけでは得られない「つながる学び」を体験できます。',
                color: 'bg-rose-50 border-rose-200',
              },
            ].map((feature, i) => (
              <div key={i} className={`rounded-2xl border p-6 md:p-8 ${feature.color} card-tilt`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl shrink-0" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                  <div>
                    <h3 className="text-lg font-bold text-trail-dark mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* こうやって始める — Steps Section */}
      {/* ================================================================= */}
      <section className="py-14 md:py-16 px-4 bg-trail-light">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 reveal">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              <span className="text-trail-primary">3ステップ</span>で始められる
            </h2>
            <p className="text-gray-500">会員登録なしでも、すぐにゲームをプレイできます</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-0.5 bg-trail-primary/20" aria-hidden />

            {[
              { step: '1', title: 'ゲームを選ぶ', description: '理科・社会・算数・美術から、興味のあるゲームを選ぼう。', emoji: '&#128270;' },
              { step: '2', title: '遊びながら学ぶ', description: 'クイズ・パズル・カードバトルで楽しみながら探究力を鍛えよう。', emoji: '&#127918;' },
              { step: '3', title: '成長を確認する', description: 'スキルレーダーチャートで思考力・探究力・創造力の成長が見える。', emoji: '&#128200;' },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-trail-primary text-white flex items-center justify-center text-2xl font-black shadow-lg relative z-10">
                  {item.step}
                </div>
                <span className="text-3xl mb-3 block" dangerouslySetInnerHTML={{ __html: item.emoji }} />
                <h3 className="text-lg font-bold text-trail-dark mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/games" className="btn-primary text-lg">
              ゲーム一覧を見る &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Three Core Skills Section */}
      {/* ================================================================= */}
      <section className="py-14 md:py-20 px-4 relative overflow-hidden">
        {/* Subtle background blob */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-green-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-0 w-56 h-56 bg-yellow-50/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto">
          <div ref={skillsHeadRef} className="text-center mb-10 reveal">
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
      <section className="py-14 md:py-16 px-4 bg-gradient-to-b from-white to-trail-light relative overflow-hidden">

        <div className="max-w-5xl mx-auto">
          <div ref={subjectsHeadRef} className="text-center mb-10 reveal">
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
      <section id="pricing" className="py-14 md:py-20 px-4 relative overflow-hidden bg-trail-light scroll-mt-16">

        <div className="max-w-5xl mx-auto">
          <div ref={pricingHeadRef} className="text-center mb-10 reveal">
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
      {/* 保護者の声 — Testimonials */}
      {/* ================================================================= */}
      <section className="py-14 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 reveal">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              <span className="text-trail-primary">保護者</span>の声
            </h2>
            <p className="text-gray-500">TRAILを使っているご家庭からのフィードバック</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'S.Tさん',
                child: '小3のお子さま',
                text: '「勉強しなさい」と言わなくなりました。自分からタブレットを開いてゲームに没頭しています。それが学びになっているのが嬉しいです。',
                stars: 5,
              },
              {
                name: 'M.Kさん',
                child: '小5のお子さま',
                text: '保護者ダッシュボードで子どもの成長が見えるのが安心。「探究力が伸びてるね」と具体的に褒められるようになりました。',
                stars: 5,
              },
              {
                name: 'A.Hさん',
                child: '小1のお子さま',
                text: '元素カードバトルにハマっています。いつの間にか元素記号を覚えていてびっくり。遊びの中で自然に知識が身につくのを実感しています。',
                stars: 5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 card-tilt relative">
                <span className="absolute top-4 right-5 text-5xl text-trail-primary/10 font-serif leading-none select-none" aria-hidden>&ldquo;</span>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonial.stars }).map((_, j) => (
                    <span key={j} className="text-trail-secondary text-lg">&#9733;</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 relative">{testimonial.text}</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-trail-primary/10 flex items-center justify-center text-trail-primary font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-trail-dark">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.child}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Trust / Social Proof Band */}
      {/* ================================================================= */}
      <section className="py-8 md:py-10 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-trail-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="font-medium text-trail-dark">安心のセキュリティ</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-trail-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a4 4 0 00-8 0v2" />
              </svg>
              <span className="font-medium text-trail-dark">個人情報保護方針準拠</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-trail-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="font-medium text-trail-dark">教育専門家監修</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-trail-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="font-medium text-trail-dark">いつでも解約OK</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* よくある質問 — FAQ */}
      {/* ================================================================= */}
      <section id="faq" className="py-14 md:py-16 px-4 bg-trail-light scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 reveal">
            <h2 className="text-2xl md:text-4xl font-black text-trail-dark mb-4">
              よくある<span className="text-trail-primary">質問</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: '何歳から利用できますか？',
                a: '小学1年生〜6年生を対象に設計しています。ひらがなが読めるお子さまであれば、低学年でも楽しめます。',
              },
              {
                q: '1日の利用時間はどのくらいですか？',
                a: '1回15〜20分を推奨しています。短い時間でも集中して取り組めるゲーム設計です。保護者ダッシュボードからプレイ時間の制限も設定できます。',
              },
              {
                q: '学校の勉強に役立ちますか？',
                a: 'TRAILは教科書の暗記ではなく「考える力」を育てます。論理的思考・情報整理・仮説検証のスキルは、学校の学びにも大いに活きます。',
              },
              {
                q: '無料プランでどこまでできますか？',
                a: '公開されている全ゲームを無制限にプレイできます。ランキングやレベルシステムも利用可能です。有料プランでは限定ゲームや詳細レポートが追加されます。',
              },
              {
                q: '途中で解約できますか？',
                a: 'はい、いつでも解約可能です。解約後も無料プランとしてご利用いただけます。違約金等は一切ありません。',
              },
              {
                q: 'タブレットは必要ですか？',
                a: 'いいえ、専用機器は不要です。ブラウザさえあればスマホ・タブレット・PCどれでもプレイできます。',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-100 shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer p-5 text-trail-dark font-bold text-sm md:text-base list-none">
                  <span>{faq.q}</span>
                  <span className="text-trail-primary text-xl transition-transform group-open:rotate-45 shrink-0 ml-4">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* Final CTA Section */}
      {/* ================================================================= */}
      <section className="py-14 md:py-20 px-4 relative">
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center reveal-scale">
          <div className="bg-gradient-to-br from-trail-primary to-green-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
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

      {/* ================================================================= */}
      {/* Footer */}
      {/* ================================================================= */}
      <footer className="bg-trail-dark text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-black text-lg mb-4">TRAIL</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                遊んでるだけなのに、考える力がつく。探究学習ゲームプラットフォーム。
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-300 mb-4">サービス</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/games" className="hover:text-white transition-colors">ゲーム一覧</Link></li>
                <li><Link href="/rankings" className="hover:text-white transition-colors">ランキング</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">料金プラン</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-300 mb-4">保護者向け</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/dashboard/parent" className="hover:text-white transition-colors">保護者ダッシュボード</Link></li>
                <li><Link href="/profile" className="hover:text-white transition-colors">プロフィール</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-300 mb-4">サポート</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">利用規約</a></li>
                <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
                <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
            &copy; 2026 TRAIL — 探究学習ゲームプラットフォーム
          </div>
        </div>
      </footer>
    </div>
  );
}
