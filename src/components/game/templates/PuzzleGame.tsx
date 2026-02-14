"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Puzzle {
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
}

interface GameResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  details: Array<{ question: number; correct: boolean; time: number }>;
}

interface PuzzleGameProps {
  gameConfig: {
    title?: string;
    puzzleType: "sequence" | "logic" | "pattern";
    puzzles: Puzzle[];
  };
  onFinish: (result: GameResult) => void;
}

type AnswerState = "waiting" | "correct" | "incorrect";

export default function PuzzleGame({ gameConfig, onFinish }: PuzzleGameProps) {
  const { puzzleType, puzzles } = gameConfig;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startTimeRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());
  const details = useRef<Array<{ question: number; correct: boolean; time: number }>>([]);

  const currentPuzzle = puzzles[currentIndex];
  const totalPuzzles = puzzles.length;
  const progress = ((currentIndex + 1) / totalPuzzles) * 100;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset hint on new question
  useEffect(() => {
    setHintVisible(false);
    setHintsUsed(0);
    questionStartRef.current = Date.now();
  }, [currentIndex]);

  const handleShowHint = useCallback(() => {
    if (!hintVisible && currentPuzzle?.hint) {
      setHintVisible(true);
      setHintsUsed(1);
      setTotalHintsUsed((prev) => prev + 1);
    }
  }, [hintVisible, currentPuzzle]);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answerState !== "waiting") return;

      const timeTaken = Math.round((Date.now() - questionStartRef.current) / 1000);
      const isCorrect = optionIndex === currentPuzzle.correctIndex;

      setSelectedIndex(optionIndex);
      setAnswerState(isCorrect ? "correct" : "incorrect");

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      details.current.push({
        question: currentIndex + 1,
        correct: isCorrect,
        time: timeTaken,
      });
    },
    [answerState, currentPuzzle, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex >= totalPuzzles - 1) {
      // Finish game
      const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000);

      // Score: base from correct answers, minus hint penalty
      const baseScore = Math.round((correctCount / totalPuzzles) * 100);
      const hintPenalty = totalHintsUsed * 5;
      const score = Math.max(0, baseScore - hintPenalty);

      onFinish({
        score,
        maxScore: 100,
        timeSeconds: totalTime,
        skills: {
          思考力: Math.round((correctCount / totalPuzzles) * 10),
          探究力: Math.min(10, totalPuzzles * 2),
          創造力: Math.round(
            Math.max(0, 10 - totalHintsUsed * 2)
          ),
        },
        details: details.current,
      });
      return;
    }

    // Transition to next puzzle
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setAnswerState("waiting");
      setSelectedIndex(null);
      setTransitioning(false);
    }, 300);
  }, [currentIndex, totalPuzzles, correctCount, totalHintsUsed, onFinish]);

  // Puzzle type specific styling
  const puzzleTypeConfig = {
    sequence: {
      label: "数列パズル",
      icon: "🔢",
      bgGradient: "from-teal-50",
      accentColor: "teal",
      headerBg: "from-teal-500 to-teal-600",
    },
    logic: {
      label: "論理パズル",
      icon: "🧠",
      bgGradient: "from-violet-50",
      accentColor: "violet",
      headerBg: "from-violet-500 to-violet-600",
    },
    pattern: {
      label: "パターン認識",
      icon: "🔍",
      bgGradient: "from-teal-50",
      accentColor: "teal",
      headerBg: "from-teal-500 to-teal-600",
    },
  };

  const typeConfig = puzzleTypeConfig[puzzleType] || puzzleTypeConfig.logic;

  const optionLabels = ["ア", "イ", "ウ", "エ", "オ", "カ"];

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-b ${typeConfig.bgGradient} to-white`}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{typeConfig.icon}</span>
              <span className="text-sm font-bold text-trail-dark">
                {typeConfig.label} - 問{currentIndex + 1}/{totalPuzzles}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {totalHintsUsed > 0 && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  ヒント{totalHintsUsed}回
                </span>
              )}
              <span className="text-sm text-gray-400">{elapsedTime}秒</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${typeConfig.headerBg} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Result dots */}
          <div className="flex gap-1 mt-2 justify-center flex-wrap">
            {details.current.map((d, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  d.correct ? "bg-trail-success" : "bg-trail-danger"
                }`}
              />
            ))}
            {Array.from({ length: totalPuzzles - details.current.length }).map(
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-3 h-3 rounded-full bg-gray-200"
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Puzzle content */}
      <div
        className={`flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 transition-all duration-300 ${
          transitioning
            ? "opacity-0 translate-x-8"
            : "opacity-100 translate-x-0"
        }`}
      >
        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100 relative">
          {/* Puzzle type badge */}
          <div
            className={`inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-gradient-to-r ${typeConfig.headerBg} rounded-full`}
          >
            {typeConfig.label}
          </div>

          <p className="text-lg sm:text-xl font-bold text-trail-dark leading-relaxed whitespace-pre-wrap">
            {currentPuzzle.question}
          </p>

          {/* Pattern visualization for pattern type */}
          {puzzleType === "pattern" && (
            <div className="mt-4 flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-400">
                パターンを見つけよう
              </span>
            </div>
          )}

          {/* Sequence visualization for sequence type */}
          {puzzleType === "sequence" && (
            <div className="mt-4 flex items-center justify-center gap-1 py-3 bg-gray-50 rounded-xl overflow-x-auto">
              <span className="text-sm text-gray-400">
                規則を見つけよう
              </span>
            </div>
          )}
        </div>

        {/* Hint section */}
        {currentPuzzle.hint && answerState === "waiting" && (
          <div className="mb-4">
            {!hintVisible ? (
              <button
                onClick={handleShowHint}
                className="w-full py-3 px-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-700 font-medium text-sm hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
              >
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                ヒントを見る（-5点）
              </button>
            ) : (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">💡</span>
                  <span className="text-xs font-bold text-amber-700">
                    ヒント
                  </span>
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {currentPuzzle.hint}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentPuzzle.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectOption = idx === currentPuzzle.correctIndex;
            const answered = answerState !== "waiting";

            let buttonStyle = "";
            if (answered) {
              if (isCorrectOption) {
                buttonStyle =
                  "ring-4 ring-green-300 bg-green-50 border-green-400 scale-[1.02]";
              } else if (isSelected && !isCorrectOption) {
                buttonStyle =
                  "ring-4 ring-red-300 bg-red-50 border-red-400 animate-[shake_0.5s_ease-in-out]";
              } else {
                buttonStyle = "opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answered}
                className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                  answered
                    ? buttonStyle
                    : "border-gray-200 hover:border-trail-secondary hover:shadow-md hover:scale-[1.01] active:scale-[0.99] bg-white"
                }`}
              >
                {/* Label */}
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    answered
                      ? isCorrectOption
                        ? "bg-green-500 text-white"
                        : isSelected
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-500"
                      : `bg-gradient-to-br ${typeConfig.headerBg} text-white`
                  }`}
                >
                  {answered && isCorrectOption
                    ? "○"
                    : answered && isSelected && !isCorrectOption
                    ? "×"
                    : optionLabels[idx] || String(idx + 1)}
                </span>

                <span
                  className={`text-base font-medium ${
                    answered && !isCorrectOption && !isSelected
                      ? "text-gray-400"
                      : "text-trail-dark"
                  }`}
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answerState !== "waiting" && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <div
              className={`text-center py-3 px-4 rounded-xl mb-4 font-bold text-lg ${
                answerState === "correct"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {answerState === "correct"
                ? hintVisible
                  ? "正解！ヒントを使ったけどすごい！"
                  : "正解！ノーヒントで素晴らしい！"
                : "不正解...次はきっと解けるよ！"}
            </div>

            {/* Show the correct answer explanation for wrong answers */}
            {answerState === "incorrect" && (
              <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-100">
                <p className="text-sm text-emerald-700">
                  正解は{" "}
                  <span className="font-bold">
                    {optionLabels[currentPuzzle.correctIndex]}:{" "}
                    {currentPuzzle.options[currentPuzzle.correctIndex]}
                  </span>{" "}
                  でした
                </p>
              </div>
            )}

            {/* Next button */}
            <button
              onClick={handleNext}
              className={`w-full py-4 bg-gradient-to-r ${typeConfig.headerBg} text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
            >
              {currentIndex >= totalPuzzles - 1 ? "結果を見る" : "次のパズルへ"}
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
