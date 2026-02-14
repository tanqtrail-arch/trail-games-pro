"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface QuizQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  timeLimit?: number;
}

interface GameResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  details: Array<{ question: number; correct: boolean; time: number }>;
}

interface QuizGameProps {
  gameConfig: {
    title?: string;
    questions: QuizQuestion[];
  };
  onFinish: (result: GameResult) => void;
}

type AnswerState = "waiting" | "correct" | "incorrect";

export default function QuizGame({ gameConfig, onFinish }: QuizGameProps) {
  const { questions } = gameConfig;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Timing
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const gameStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Results accumulator
  const [details, setDetails] = useState<
    Array<{ question: number; correct: boolean; time: number }>
  >([]);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    const hasTimeLimit = currentQuestion?.timeLimit && currentQuestion.timeLimit > 0;

    if (answerState !== "waiting") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setQuestionStartTime(Date.now());
    setElapsedTime(0);

    if (hasTimeLimit) {
      setCountdown(currentQuestion.timeLimit!);
    } else {
      setCountdown(null);
    }

    timerRef.current = setInterval(() => {
      if (hasTimeLimit) {
        setCountdown((prev) => {
          if (prev !== null && prev <= 1) {
            // Time's up - auto-submit wrong
            handleTimeUp();
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, answerState]);

  const handleTimeUp = useCallback(() => {
    if (answerState !== "waiting") return;
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    setSelectedIndex(-1);
    setAnswerState("incorrect");
    setShowExplanation(true);
    setDetails((prev) => [
      ...prev,
      { question: currentIndex + 1, correct: false, time: Math.round(timeTaken) },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerState, questionStartTime, currentIndex]);

  const handleAnswer = useCallback(
    (choiceIndex: number) => {
      if (answerState !== "waiting") return;

      const timeTaken = (Date.now() - questionStartTime) / 1000;
      const isCorrect = choiceIndex === currentQuestion.correctIndex;

      setSelectedIndex(choiceIndex);
      setAnswerState(isCorrect ? "correct" : "incorrect");

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      setDetails((prev) => [
        ...prev,
        {
          question: currentIndex + 1,
          correct: isCorrect,
          time: Math.round(timeTaken),
        },
      ]);

      // Show explanation after brief feedback
      setTimeout(() => {
        setShowExplanation(true);
      }, 600);
    },
    [answerState, questionStartTime, currentQuestion, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex >= totalQuestions - 1) {
      // Game finished
      const totalTime = Math.round((Date.now() - gameStartTimeRef.current) / 1000);
      const finalCorrect = correctCount + (answerState === "correct" ? 0 : 0);
      // correctCount is already updated in handleAnswer
      const score = Math.round((correctCount / totalQuestions) * 100);

      const result: GameResult = {
        score,
        maxScore: 100,
        timeSeconds: totalTime,
        skills: {
          思考力: Math.round((correctCount / totalQuestions) * 10),
          探究力: Math.min(10, Math.round(totalQuestions * 1.5)),
          創造力: Math.round(Math.max(0, 10 - totalTime / totalQuestions / 3)),
        },
        details: [
          ...details,
        ],
      };

      onFinish(result);
      return;
    }

    // Transition to next question
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setAnswerState("waiting");
      setSelectedIndex(null);
      setShowExplanation(false);
      setTransitioning(false);
    }, 300);
  }, [currentIndex, totalQuestions, correctCount, details, onFinish, answerState]);

  const choiceColors = [
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-amber-500 to-amber-600",
    "from-purple-500 to-purple-600",
  ];

  const choiceLabels = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      {/* Top bar: progress + timer */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          {/* Question counter */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-trail-dark">
              問{currentIndex + 1} / {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              {countdown !== null && answerState === "waiting" ? (
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    countdown <= 5
                      ? "bg-red-100 text-red-600 animate-pulse"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  残り {countdown}秒
                </span>
              ) : (
                <span className="text-sm text-gray-400">
                  {elapsedTime}秒
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-trail-primary to-trail-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Correct counter dots */}
          <div className="flex gap-1 mt-2 justify-center flex-wrap">
            {details.map((d, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  d.correct ? "bg-trail-success" : "bg-trail-danger"
                }`}
              />
            ))}
            {Array.from({
              length: totalQuestions - details.length,
            }).map((_, i) => (
              <div key={`empty-${i}`} className="w-3 h-3 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>

      {/* Question area */}
      <div
        className={`flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 transition-all duration-300 ${
          transitioning ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
        }`}
      >
        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <p className="text-lg sm:text-xl font-bold text-trail-dark leading-relaxed">
            {currentQuestion.question}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          {currentQuestion.choices.map((choice, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectChoice = idx === currentQuestion.correctIndex;
            const answered = answerState !== "waiting";

            let buttonStyle = "";
            if (answered) {
              if (isCorrectChoice) {
                buttonStyle =
                  "ring-4 ring-green-300 bg-green-50 border-green-400 scale-[1.02]";
              } else if (isSelected && !isCorrectChoice) {
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
                    : "border-gray-200 hover:border-trail-primary hover:shadow-md hover:scale-[1.01] active:scale-[0.99] bg-white"
                }`}
              >
                {/* Choice label badge */}
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                    answered
                      ? isCorrectChoice
                        ? "bg-green-500"
                        : isSelected
                        ? "bg-red-500"
                        : "bg-gray-300"
                      : `bg-gradient-to-br ${choiceColors[idx % choiceColors.length]}`
                  }`}
                >
                  {answered && isCorrectChoice
                    ? "○"
                    : answered && isSelected && !isCorrectChoice
                    ? "×"
                    : choiceLabels[idx]}
                </span>

                <span
                  className={`text-base sm:text-lg font-medium ${
                    answered && !isCorrectChoice && !isSelected
                      ? "text-gray-400"
                      : "text-trail-dark"
                  }`}
                >
                  {choice}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation */}
        {answerState !== "waiting" && (
          <div
            className={`transition-all duration-500 ${
              showExplanation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Correct/Incorrect banner */}
            <div
              className={`text-center py-3 px-4 rounded-xl mb-4 font-bold text-lg ${
                answerState === "correct"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {answerState === "correct" ? "正解！すごい！" : "残念..."}
            </div>

            {/* Explanation */}
            {showExplanation && currentQuestion.explanation && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                <p className="text-sm font-bold text-blue-700 mb-1">解説</p>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next button */}
            {showExplanation && (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-gradient-to-r from-trail-primary to-trail-secondary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {currentIndex >= totalQuestions - 1 ? "結果を見る" : "次の問題へ"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Shake animation keyframes */}
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
      `}</style>
    </div>
  );
}
