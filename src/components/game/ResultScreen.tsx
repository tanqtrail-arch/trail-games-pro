"use client";

import { useState, useEffect, useMemo } from "react";

interface ScoreDisplayConfig {
  type: "rank" | "points" | "stars" | "title";
  ranks?: { threshold: number; label: string; color: string }[];
  rules?: { min_percent: number; label: string; color: string }[];
  maxStars?: number;
  max_stars?: number;
}

interface ResultScreenProps {
  score: number;
  maxScore: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  scoreDisplayConfig: ScoreDisplayConfig;
  timeSeconds: number;
  gameTitle: string;
  onReplay: () => void;
  submitting?: boolean;
  submitError?: string | null;
}

// ---- SVG Radar Chart ----
function RadarChart({
  skills,
}: {
  skills: { 思考力: number; 探究力: number; 創造力: number };
}) {
  const labels = ["思考力", "探究力", "創造力"];
  const values = [skills.思考力, skills.探究力, skills.創造力];
  const maxValue = 10;

  // Center and sizing
  const cx = 100;
  const cy = 100;
  const radius = 70;
  const levels = 5;

  // Calculate points for each axis (3 axes, 120 degrees apart)
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 3 - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Grid levels
  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const levelValue = ((i + 1) / levels) * maxValue;
    return labels.map((_, j) => getPoint(j, levelValue));
  });

  // Data polygon
  const dataPoints = values.map((v, i) => getPoint(i, v));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Label positions (slightly beyond the outer ring)
  const labelPoints = labels.map((_, i) => getPoint(i, maxValue + 2.5));

  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56">
        {/* Grid levels */}
        {gridLevels.map((points, level) => (
          <polygon
            key={level}
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {labels.map((_, i) => {
          const p = getPoint(i, maxValue);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="#d1d5db"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={
            animated
              ? dataPoints.map((p) => `${p.x},${p.y}`).join(" ")
              : `${cx},${cy} ${cx},${cy} ${cx},${cy}`
          }
          fill="rgba(45, 106, 79, 0.2)"
          stroke="#2D6A4F"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={animated ? p.x : cx}
            cy={animated ? p.y : cy}
            r="4"
            fill="#2D6A4F"
            stroke="white"
            strokeWidth="2"
            className="transition-all duration-700 ease-out"
          />
        ))}

        {/* Labels */}
        {labelPoints.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-gray-700"
            fontSize="11"
          >
            {labels[i]}
          </text>
        ))}

        {/* Value labels */}
        {dataPoints.map((p, i) => (
          <text
            key={`val-${i}`}
            x={animated ? p.x : cx}
            y={animated ? p.y - 12 : cy - 12}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-teal-600 transition-all duration-700 ease-out"
            fontSize="10"
          >
            {values[i]}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ---- Star Display ----
function StarDisplay({
  score,
  maxScore,
  maxStars = 5,
}: {
  score: number;
  maxScore: number;
  maxStars: number;
}) {
  const percentage = score / maxScore;
  const filledStars = Math.round(percentage * maxStars);

  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <span
          key={i}
          className={`text-3xl sm:text-4xl transition-all duration-300 ${
            i < filledStars ? "scale-110" : "opacity-30 grayscale"
          }`}
          style={{ animationDelay: `${i * 150}ms` }}
        >
          {i < filledStars ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

// ---- Score Display ----
function ScoreDisplay({
  score,
  maxScore,
  config,
}: {
  score: number;
  maxScore: number;
  config: ScoreDisplayConfig;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = Math.round((score / maxScore) * 100);

  // Animate score counter
  useEffect(() => {
    const duration = 1200;
    const steps = 30;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(score, Math.round(increment * step));
      setAnimatedScore(current);
      if (step >= steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const isHighScore = percentage >= 80;

  switch (config.type) {
    case "rank": {
      const defaultRanks = [
        { threshold: 90, label: "S", color: "#7FB3D3" },
        { threshold: 80, label: "A", color: "#52B788" },
        { threshold: 60, label: "B", color: "#3B82F6" },
        { threshold: 40, label: "C", color: "#8B5CF6" },
        { threshold: 0, label: "D", color: "#6B7280" },
      ];
      const ranks = config.ranks || defaultRanks;
      const rank = ranks.find((r) => percentage >= r.threshold) || ranks[ranks.length - 1];

      return (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">ランク</p>
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-2xl text-5xl font-black text-white shadow-xl mb-3"
            style={{
              backgroundColor: rank.color,
              animation: isHighScore ? "pulse 2s infinite" : undefined,
            }}
          >
            {rank.label}
          </div>
          <p className="text-2xl font-bold text-trail-dark">
            {animatedScore}
            <span className="text-base text-gray-400"> / {maxScore}点</span>
          </p>
        </div>
      );
    }

    case "stars":
      return (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">スコア</p>
          <StarDisplay
            score={score}
            maxScore={maxScore}
            maxStars={config.maxStars || 5}
          />
          <p className="text-2xl font-bold text-trail-dark mt-2">
            {animatedScore}
            <span className="text-base text-gray-400"> / {maxScore}点</span>
          </p>
        </div>
      );

    case "title": {
      const titleRules = config.rules || [];
      const titleRule =
        titleRules.find((r) => percentage >= r.min_percent) ||
        titleRules[titleRules.length - 1];

      return (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">称号</p>
          {titleRule ? (
            <div
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-2xl sm:text-3xl font-black text-white shadow-xl mb-3"
              style={{
                backgroundColor: titleRule.color,
                animation: isHighScore ? "pulse 2s infinite" : undefined,
              }}
            >
              {titleRule.label}
            </div>
          ) : null}
          <p className="text-2xl font-bold text-trail-dark">
            {animatedScore}
            <span className="text-base text-gray-400"> / {maxScore}点</span>
          </p>
        </div>
      );
    }

    case "points":
    default:
      return (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">スコア</p>
          <p className="text-5xl sm:text-6xl font-black text-trail-dark mb-1">
            {animatedScore}
            <span className="text-xl text-gray-400">点</span>
          </p>
          <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-trail-primary to-trail-secondary rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
  }
}

// ---- Confetti decoration (CSS only) ----
function Confetti() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 3}s`,
      color: [
        "#7FB3D3",
        "#EF4444",
        "#52B788",
        "#3B82F6",
        "#8B5CF6",
        "#EC4899",
      ][i % 6],
      size: 6 + Math.random() * 6,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute animate-[confettiFall_linear_forwards]"
          style={{
            left: p.left,
            top: "-20px",
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          <div
            className="rounded-sm animate-spin"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ---- Main ResultScreen ----
export default function ResultScreen({
  score,
  maxScore,
  skills,
  scoreDisplayConfig,
  timeSeconds,
  gameTitle,
  onReplay,
  submitting,
  submitError,
}: ResultScreenProps) {
  const percentage = Math.round((score / maxScore) * 100);
  const isHighScore = percentage >= 80;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}分${secs}秒`;
    }
    return `${secs}秒`;
  };

  // Share text
  const shareText = encodeURIComponent(
    `「${gameTitle}」で${score}点を獲得しました！ #探究教室TRAIL`
  );
  const shareUrl = encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-amber-50 relative">
      {/* Confetti for high scores */}
      {isHighScore && <Confetti />}

      <div
        className={`max-w-md mx-auto px-4 py-8 relative z-10 transition-all duration-700 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header celebration */}
        <div className="text-center mb-6">
          <div
            className={`inline-block text-5xl mb-3 ${
              isHighScore ? "animate-bounce" : ""
            }`}
          >
            {percentage >= 90
              ? "🏆"
              : percentage >= 70
              ? "🎉"
              : percentage >= 50
              ? "👏"
              : "💪"}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-trail-dark mb-1">
            {percentage >= 90
              ? "すばらしい！天才だ！"
              : percentage >= 70
              ? "よくできました！"
              : percentage >= 50
              ? "がんばったね！"
              : "また挑戦しよう！"}
          </h1>
          <p className="text-sm text-gray-500">{gameTitle}</p>
        </div>

        {/* Score display card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4 border border-gray-100">
          <ScoreDisplay
            score={score}
            maxScore={maxScore}
            config={scoreDisplayConfig}
          />

          {/* Time */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            クリア時間: {formatTime(timeSeconds)}
          </div>

          {/* Submission status */}
          {submitting && (
            <p className="text-center text-xs text-gray-400 mt-2 animate-pulse">
              スコアを保存中...
            </p>
          )}
          {submitError && (
            <p className="text-center text-xs text-red-500 mt-2">
              {submitError}
            </p>
          )}
        </div>

        {/* Skills radar chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4 border border-gray-100">
          <h2 className="text-sm font-bold text-gray-500 mb-3 text-center uppercase tracking-wide">
            スキル分析
          </h2>
          <RadarChart skills={skills} />
        </div>

        {/* ====== チラ見せ Section - THE CONVERSION POINT ====== */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-4 border border-gray-100">
          {/* Section header */}
          <div className="bg-gradient-to-r from-trail-primary to-trail-secondary px-4 py-3">
            <p className="text-white text-sm font-bold text-center">
              もっと詳しく見てみよう
            </p>
          </div>

          {/* Teaser items */}
          <div className="divide-y divide-gray-100">
            {/* 1. Problem analysis */}
            <div className="p-4 relative">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">📊</span>
                <span className="text-sm font-bold text-trail-dark">
                  どの問題でつまずいた？
                </span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  限定
                </span>
              </div>
              {/* Blurred preview */}
              <div className="relative overflow-hidden rounded-lg">
                <div className="blur-sm select-none pointer-events-none">
                  <div className="flex gap-1 mb-1">
                    <div className="h-4 bg-green-200 rounded" style={{ width: "80%" }} />
                    <div className="h-4 bg-red-200 rounded" style={{ width: "20%" }} />
                  </div>
                  <div className="flex gap-1 mb-1">
                    <div className="h-4 bg-green-200 rounded" style={{ width: "60%" }} />
                    <div className="h-4 bg-red-200 rounded" style={{ width: "40%" }} />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-4 bg-green-200 rounded" style={{ width: "90%" }} />
                    <div className="h-4 bg-red-200 rounded" style={{ width: "10%" }} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. Peer comparison */}
            <div className="p-4 relative">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">👥</span>
                <span className="text-sm font-bold text-trail-dark">
                  同学年との比較
                </span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  限定
                </span>
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <div className="blur-sm select-none pointer-events-none">
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-600">あなたの順位</p>
                    <p className="text-2xl font-bold text-trail-primary">
                      上位 23%
                    </p>
                    <p className="text-xs text-gray-400">1,247人中 287位</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 3. Recommended next game */}
            <div className="p-4 relative">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">🎯</span>
                <span className="text-sm font-bold text-trail-dark">
                  次におすすめのゲーム
                </span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  限定
                </span>
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <div className="blur-sm select-none pointer-events-none">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        もっと難しいクイズ
                      </p>
                      <p className="text-xs text-gray-400">
                        思考力アップに最適！
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Most prominent element */}
          <div className="p-4 bg-gradient-to-b from-amber-50 to-amber-100 border-t border-amber-200">
            <a
              href="/parent/register"
              className="group block w-full py-4 px-6 bg-gradient-to-r from-trail-accent to-orange-500 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
            >
              <span className="flex items-center justify-center gap-2">
                詳しいレポートは保護者アカウントで
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </a>
            <p className="text-xs text-amber-700/60 text-center mt-2">
              無料で登録できます
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-4 border border-gray-100">
          <p className="text-sm font-bold text-gray-500 text-center mb-3">
            結果をシェアしよう！
          </p>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-black text-white font-bold text-sm rounded-xl text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xでシェア
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-[#06C755] text-white font-bold text-sm rounded-xl text-center hover:bg-[#05b34c] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              LINEで送る
            </a>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={onReplay}
            className="w-full py-4 bg-gradient-to-r from-trail-primary to-trail-secondary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            もう一度プレイ
          </button>

          <a
            href="/games"
            className="block w-full py-3 text-center text-trail-primary font-medium text-sm hover:text-trail-secondary transition-colors"
          >
            ゲーム一覧に戻る
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-8">
          探究教室 TRAIL
        </p>
      </div>

      {/* Confetti animation */}
      <style jsx global>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
