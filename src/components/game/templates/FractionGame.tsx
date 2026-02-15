"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FractionQuestion {
  numerator: number;
  denominator: number;
  choices: string[];
  correct_answer_index: number;
  explanation: string;
  time_limit: number;
}

interface GameResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  details: Array<{ question: number; correct: boolean; time: number }>;
}

interface FractionGameProps {
  gameConfig: any;
  onFinish: (result: GameResult) => void;
}

type AnswerState = "waiting" | "correct" | "incorrect" | "explanation";

// ---------------------------------------------------------------------------
// SVG helper: generate a pie-slice path
// ---------------------------------------------------------------------------

function pieSlicePath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const gap = endAngle - startAngle;
  // Near-full circle
  if (gap >= Math.PI * 2 - 0.01) {
    return [
      `M ${cx - r} ${cy}`,
      `A ${r} ${r} 0 1 1 ${cx + r} ${cy}`,
      `A ${r} ${r} 0 1 1 ${cx - r} ${cy}`,
      "Z",
    ].join(" ");
  }
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const large = gap > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FractionGame({ gameConfig, onFinish }: FractionGameProps) {
  // Extract questions - handle both nested (template.questions) and flat shapes
  const questions: FractionQuestion[] = useMemo(() => {
    const tpl = gameConfig?.template;
    if (tpl?.questions) return tpl.questions;
    if (gameConfig?.questions) return gameConfig.questions;
    return [];
  }, [gameConfig]);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [destroying, setDestroying] = useState(false);
  const [showBang, setShowBang] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Timer
  const [countdown, setCountdown] = useState<number | null>(null);
  const questionStartRef = useRef<number>(Date.now());
  const gameStartRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Results
  const [details, setDetails] = useState<
    Array<{ question: number; correct: boolean; time: number }>
  >([]);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  // ------ Timer effect ------
  useEffect(() => {
    if (answerState !== "waiting" || !currentQ) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    questionStartRef.current = Date.now();
    const tl = currentQ.time_limit;
    if (tl > 0) setCountdown(tl);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev !== null && prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, answerState]);

  // ------ Handlers ------

  const handleTimeUp = useCallback(() => {
    if (answerState !== "waiting") return;
    const t = Math.round((Date.now() - questionStartRef.current) / 1000);
    setSelectedIndex(-1);
    setAnswerState("incorrect");
    setTimeout(() => setAnswerState("explanation"), 900);
    setDetails((prev) => [
      ...prev,
      { question: currentIndex + 1, correct: false, time: t },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerState, currentIndex]);

  const handleAnswer = useCallback(
    (idx: number) => {
      if (answerState !== "waiting" || !currentQ) return;
      const t = Math.round((Date.now() - questionStartRef.current) / 1000);
      const isCorrect = idx === currentQ.correct_answer_index;

      setSelectedIndex(idx);

      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        setAnswerState("correct");
        setShowBang(true);
        setTimeout(() => setDestroying(true), 150);
        setTimeout(() => setAnswerState("explanation"), 1200);
      } else {
        setAnswerState("incorrect");
        setTimeout(() => setAnswerState("explanation"), 900);
      }

      setDetails((prev) => [
        ...prev,
        { question: currentIndex + 1, correct: isCorrect, time: t },
      ]);
    },
    [answerState, currentQ, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex >= total - 1) {
      const totalTime = Math.round(
        (Date.now() - gameStartRef.current) / 1000
      );
      const score = Math.round((correctCount / total) * 100);
      onFinish({
        score,
        maxScore: 100,
        timeSeconds: totalTime,
        skills: {
          思考力: Math.round((correctCount / total) * 10),
          探究力: Math.min(10, Math.round(total * 1.5)),
          創造力: Math.round(
            Math.max(0, 10 - totalTime / total / 3)
          ),
        },
        details,
      });
      return;
    }

    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setAnswerState("waiting");
      setSelectedIndex(null);
      setDestroying(false);
      setShowBang(false);
      setTransitioning(false);
    }, 300);
  }, [currentIndex, total, correctCount, details, onFinish]);

  // ------ Derived values for pie chart ------

  if (!currentQ) return null;

  const { numerator, denominator } = currentQ;

  // SVG params
  const cx = 130;
  const cy = 130;
  const r = 110;

  // Direction each segment flies when destroyed
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const destroyDirs = useMemo(() => {
    return Array.from({ length: denominator }).map((_, i) => {
      const midAngle =
        ((i + 0.5) / denominator) * Math.PI * 2 - Math.PI / 2;
      const dist = 180 + Math.random() * 80;
      return {
        tx: Math.cos(midAngle) * dist,
        ty: Math.sin(midAngle) * dist,
        rot: (Math.random() - 0.5) * 360,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, denominator]);

  // Filled segment color palette (warm tones)
  const fillColors = [
    "#F59E0B", "#FB923C", "#F97316", "#FBBF24",
    "#F59E0B", "#FB923C", "#F97316", "#FBBF24",
    "#F59E0B", "#FB923C", "#F97316", "#FBBF24",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex flex-col">
      {/* ======= Top bar ======= */}
      <div className="sticky top-0 z-10 bg-amber-900/95 backdrop-blur-sm px-4 py-3 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-amber-100">
              {currentIndex + 1} / {total}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-amber-200">
                {correctCount} HIT
              </span>
              {countdown !== null && answerState === "waiting" && (
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    countdown <= 5
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-amber-800 text-amber-100"
                  }`}
                >
                  {countdown}s
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-amber-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dot indicators */}
          <div className="flex gap-1 mt-2 justify-center flex-wrap">
            {details.map((d, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  d.correct ? "bg-green-400" : "bg-red-400"
                }`}
              />
            ))}
            {Array.from({ length: total - details.length }).map((_, i) => (
              <div
                key={`e-${i}`}
                className="w-3 h-3 rounded-full bg-amber-700/60"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ======= Main area ======= */}
      <div
        className={`flex-1 flex flex-col items-center max-w-2xl mx-auto w-full px-4 pt-4 pb-8 transition-all duration-300 ${
          transitioning
            ? "opacity-0 scale-95"
            : "opacity-100 scale-100"
        }`}
      >
        {/* Question prompt */}
        <div className="text-center mb-3">
          <p className="text-lg sm:text-xl font-black text-amber-900 tracking-wide">
            この円グラフが表す分数は？
          </p>
        </div>

        {/* Pie chart area */}
        <div className="relative mb-5 select-none">
          <svg
            width="260"
            height="260"
            viewBox="0 0 260 260"
            className="drop-shadow-xl"
          >
            {/* Background circle */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="#FFFBEB"
              stroke="#B45309"
              strokeWidth="3"
              style={{
                opacity: destroying ? 0 : 1,
                transition: "opacity 0.4s",
              }}
            />

            {/* Segments */}
            {Array.from({ length: denominator }).map((_, i) => {
              const startAngle =
                (i / denominator) * Math.PI * 2 - Math.PI / 2;
              const endAngle =
                ((i + 1) / denominator) * Math.PI * 2 - Math.PI / 2;
              const isFilled = i < numerator;

              const isDestroying = destroying && isFilled;
              const dir = destroyDirs[i];

              return (
                <path
                  key={`seg-${i}`}
                  d={pieSlicePath(cx, cy, r - 2, startAngle, endAngle)}
                  fill={isFilled ? fillColors[i % fillColors.length] : "transparent"}
                  stroke={isFilled ? "#92400E" : "transparent"}
                  strokeWidth="1"
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transform: isDestroying
                      ? `translate(${dir.tx}px, ${dir.ty}px) rotate(${dir.rot}deg) scale(0.4)`
                      : "translate(0,0) rotate(0deg) scale(1)",
                    opacity: isDestroying ? 0 : 1,
                    transition:
                      "transform 0.7s cubic-bezier(.2,.8,.3,1), opacity 0.7s ease-out",
                  }}
                />
              );
            })}

            {/* Grid lines */}
            {Array.from({ length: denominator }).map((_, i) => {
              const angle =
                (i / denominator) * Math.PI * 2 - Math.PI / 2;
              return (
                <line
                  key={`gl-${i}`}
                  x1={cx}
                  y1={cy}
                  x2={cx + r * Math.cos(angle)}
                  y2={cy + r * Math.sin(angle)}
                  stroke="#92400E"
                  strokeWidth="2"
                  style={{
                    opacity: destroying ? 0 : 1,
                    transition: "opacity 0.3s",
                  }}
                />
              );
            })}

            {/* Center dot */}
            <circle
              cx={cx}
              cy={cy}
              r="4"
              fill="#92400E"
              style={{
                opacity: destroying ? 0 : 1,
                transition: "opacity 0.3s",
              }}
            />

            {/* Outer ring */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#78350F"
              strokeWidth="3"
              style={{
                opacity: destroying ? 0 : 1,
                transition: "opacity 0.3s",
              }}
            />

            {/* Crosshair (visible while waiting) */}
            {answerState === "waiting" && (
              <g opacity="0.25" stroke="#78350F" strokeWidth="1.5">
                <line x1={cx - r - 10} y1={cy} x2={cx + r + 10} y2={cy} />
                <line x1={cx} y1={cy - r - 10} x2={cx} y2={cy + r + 10} />
                <circle cx={cx} cy={cy} r={r + 15} fill="none" strokeDasharray="6 4" />
              </g>
            )}
          </svg>

          {/* BANG! overlay */}
          {showBang && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="text-5xl sm:text-6xl font-black text-red-600 animate-scale-up"
                style={{
                  textShadow:
                    "3px 3px 0 #FDE047, -3px -3px 0 #FDE047, 3px -3px 0 #FDE047, -3px 3px 0 #FDE047",
                }}
              >
                BANG!
              </span>
            </div>
          )}

          {/* MISS overlay */}
          {answerState === "incorrect" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-4xl sm:text-5xl font-black text-gray-500 animate-shake-once">
                MISS...
              </span>
            </div>
          )}
        </div>

        {/* ======= Choices (2x2 grid) ======= */}
        {answerState !== "explanation" && (
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
            {currentQ.choices.map((choice, idx) => {
              const isSelected = selectedIndex === idx;
              const isCorrectChoice =
                idx === currentQ.correct_answer_index;
              const answered = answerState !== "waiting";

              let cls =
                "bg-white border-2 border-amber-300 hover:border-amber-500 hover:shadow-lg active:scale-95";
              if (answered) {
                if (isCorrectChoice) {
                  cls =
                    "bg-green-50 border-2 border-green-500 ring-4 ring-green-200 scale-[1.03]";
                } else if (isSelected && !isCorrectChoice) {
                  cls =
                    "bg-red-50 border-2 border-red-500 ring-4 ring-red-200 animate-shake-once";
                } else {
                  cls = "bg-gray-100 border-2 border-gray-200 opacity-40";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                  className={`${cls} rounded-xl py-5 px-3 text-center transition-all duration-200 transform`}
                >
                  <span className="text-2xl sm:text-3xl font-black text-amber-900">
                    {choice}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ======= Explanation ======= */}
        {answerState === "explanation" && (
          <div className="w-full max-w-sm animate-fade-in">
            {/* Result banner */}
            <div
              className={`text-center py-3 px-4 rounded-xl mb-3 font-bold text-lg ${
                selectedIndex === currentQ.correct_answer_index
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedIndex === currentQ.correct_answer_index
                ? "命中！正解！"
                : `はずれ... 正解は ${currentQ.choices[currentQ.correct_answer_index]}`}
            </div>

            {/* Explanation card */}
            <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
              <p className="text-sm font-bold text-amber-700 mb-1">
                解説
              </p>
              <p className="text-sm text-amber-900 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {currentIndex >= total - 1
                ? "結果を見る"
                : "次の的へ"}
            </button>
          </div>
        )}
      </div>

      {/* ======= Keyframes ======= */}
      <style jsx global>{`
        @keyframes shake-once {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-5px); }
          30%, 60%, 90% { transform: translateX(5px); }
        }
        .animate-shake-once {
          animation: shake-once 0.5s ease-in-out;
        }
        @keyframes scale-up {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scale-up 0.4s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}
