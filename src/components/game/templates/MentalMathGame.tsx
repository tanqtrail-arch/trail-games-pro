"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MentalMathLevel {
  fromQuestion: number;
  toQuestion: number;
  operations: ("+" | "-" | "×" | "÷")[];
  minNumber: number;
  maxNumber: number;
}

interface MentalMathConfig {
  totalQuestions: number;
  timePerQuestion: number;
  levels: MentalMathLevel[];
}

interface GameResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  details: Array<{ question: number; correct: boolean; time: number }>;
}

interface MentalMathGameProps {
  gameConfig: {
    title?: string;
    template?: MentalMathConfig;
  };
  onFinish: (result: GameResult) => void;
}

interface Problem {
  left: number;
  operator: string;
  right: number;
  answer: number;
}

type AnswerState = "waiting" | "correct" | "incorrect" | "timeout";

// ---------------------------------------------------------------------------
// Problem generation
// ---------------------------------------------------------------------------

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(level: MentalMathLevel): Problem {
  const op = level.operations[randInt(0, level.operations.length - 1)];

  let left: number;
  let right: number;
  let answer: number;

  switch (op) {
    case "+": {
      left = randInt(level.minNumber, level.maxNumber);
      right = randInt(level.minNumber, level.maxNumber);
      answer = left + right;
      break;
    }
    case "-": {
      // Ensure non-negative result for kids
      left = randInt(level.minNumber, level.maxNumber);
      right = randInt(level.minNumber, left);
      answer = left - right;
      break;
    }
    case "×": {
      left = randInt(level.minNumber, level.maxNumber);
      right = randInt(level.minNumber, Math.min(level.maxNumber, 12));
      answer = left * right;
      break;
    }
    case "÷": {
      // Generate a valid division: pick right, pick answer, then left = right * answer
      right = randInt(Math.max(1, level.minNumber), Math.min(level.maxNumber, 12));
      const quotient = randInt(1, level.maxNumber);
      left = right * quotient;
      answer = quotient;
      break;
    }
    default: {
      left = randInt(level.minNumber, level.maxNumber);
      right = randInt(level.minNumber, level.maxNumber);
      answer = left + right;
    }
  }

  return { left, operator: op, right, answer };
}

function getLevelForQuestion(
  questionNum: number,
  levels: MentalMathLevel[]
): MentalMathLevel {
  for (const level of levels) {
    if (questionNum >= level.fromQuestion && questionNum <= level.toQuestion) {
      return level;
    }
  }
  return levels[levels.length - 1];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MentalMathGame({
  gameConfig,
  onFinish,
}: MentalMathGameProps) {
  const config = gameConfig.template ?? {
    totalQuestions: 10,
    timePerQuestion: 15,
    levels: [
      {
        fromQuestion: 1,
        toQuestion: 10,
        operations: ["+", "-"] as ("+" | "-")[],
        minNumber: 1,
        maxNumber: 20,
      },
    ],
  };

  const { totalQuestions, timePerQuestion, levels } = config;

  // Game state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("waiting");
  const [inputValue, setInputValue] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  // Timer
  const [countdown, setCountdown] = useState(timePerQuestion);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameStartTimeRef = useRef<number>(Date.now());

  // Results
  const [details, setDetails] = useState<
    Array<{ question: number; correct: boolean; time: number }>
  >([]);
  const [correctCount, setCorrectCount] = useState(0);

  // Generate all problems upfront
  const problems = useMemo(() => {
    return Array.from({ length: totalQuestions }, (_, i) => {
      const level = getLevelForQuestion(i + 1, levels);
      return generateProblem(level);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalQuestions]);

  const currentProblem = problems[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (answerState !== "waiting") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setCountdown(timePerQuestion);
    setQuestionStartTime(Date.now());

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, answerState]);

  const handleTimeout = useCallback(() => {
    if (answerState !== "waiting") return;
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    setAnswerState("timeout");
    setCombo(0);
    setDetails((prev) => [
      ...prev,
      { question: currentIndex + 1, correct: false, time: Math.round(timeTaken) },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerState, questionStartTime, currentIndex]);

  const handleSubmit = useCallback(() => {
    if (answerState !== "waiting" || inputValue === "") return;

    const timeTaken = (Date.now() - questionStartTime) / 1000;
    const userAnswer = parseInt(inputValue, 10);
    const isCorrect = userAnswer === currentProblem.answer;

    setAnswerState(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setCombo((prev) => {
        const newCombo = prev + 1;
        setMaxCombo((mc) => Math.max(mc, newCombo));
        return newCombo;
      });
    } else {
      setCombo(0);
    }

    setDetails((prev) => [
      ...prev,
      { question: currentIndex + 1, correct: isCorrect, time: Math.round(timeTaken) },
    ]);
  }, [answerState, inputValue, questionStartTime, currentProblem, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex >= totalQuestions - 1) {
      // Game over
      const totalTime = Math.round(
        (Date.now() - gameStartTimeRef.current) / 1000
      );
      const score = Math.round((correctCount / totalQuestions) * 100);

      const result: GameResult = {
        score,
        maxScore: 100,
        timeSeconds: totalTime,
        skills: {
          思考力: Math.round((correctCount / totalQuestions) * 10),
          探究力: Math.min(10, Math.round(totalQuestions * 0.8)),
          創造力: Math.round(
            Math.max(0, 10 - totalTime / totalQuestions / 3)
          ),
        },
        details,
      };
      onFinish(result);
      return;
    }

    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setAnswerState("waiting");
      setInputValue("");
      setTransitioning(false);
    }, 300);
  }, [currentIndex, totalQuestions, correctCount, details, onFinish]);

  const handleKeypad = useCallback(
    (key: string) => {
      if (answerState !== "waiting") return;

      if (key === "del") {
        setInputValue((prev) => prev.slice(0, -1));
      } else if (key === "neg") {
        setInputValue((prev) =>
          prev.startsWith("-") ? prev.slice(1) : "-" + prev
        );
      } else if (key === "ok") {
        handleSubmit();
      } else {
        // Limit to 6 digits
        setInputValue((prev) => (prev.length < 6 ? prev + key : prev));
      }
    },
    [answerState, handleSubmit]
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (answerState !== "waiting") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      if (e.key >= "0" && e.key <= "9") {
        handleKeypad(e.key);
      } else if (e.key === "Backspace") {
        handleKeypad("del");
      } else if (e.key === "-") {
        handleKeypad("neg");
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answerState, handleKeypad, handleSubmit, handleNext]);

  // Timer bar width
  const timerPercent = (countdown / timePerQuestion) * 100;
  const timerColor =
    countdown <= 3
      ? "bg-red-500"
      : countdown <= 5
      ? "bg-amber-500"
      : "bg-trail-primary";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto">
          {/* Question counter + combo */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-trail-dark">
              問{currentIndex + 1} / {totalQuestions}
            </span>
            <div className="flex items-center gap-3">
              {combo >= 2 && answerState === "waiting" && (
                <span className="text-sm font-bold text-amber-500 animate-pulse">
                  {combo}コンボ
                </span>
              )}
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${
                  countdown <= 3
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : countdown <= 5
                    ? "bg-amber-100 text-amber-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {countdown}秒
              </span>
            </div>
          </div>

          {/* Timer bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full ${timerColor} rounded-full transition-all duration-1000 ease-linear`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>

          {/* Progress dots */}
          <div className="flex gap-1 justify-center flex-wrap">
            {details.map((d, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  d.correct ? "bg-green-500" : "bg-red-400"
                }`}
              />
            ))}
            {Array.from({ length: totalQuestions - details.length }).map(
              (_, i) => (
                <div
                  key={`e-${i}`}
                  className="w-3 h-3 rounded-full bg-gray-200"
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Main area */}
      <div
        className={`flex-1 flex flex-col items-center max-w-lg mx-auto w-full px-4 pt-6 transition-all duration-300 ${
          transitioning
            ? "opacity-0 translate-x-8"
            : "opacity-100 translate-x-0"
        }`}
      >
        {/* Problem display */}
        <div className="w-full bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 text-center">
          <div className="text-5xl sm:text-6xl font-black text-trail-dark tracking-wider mb-4 font-mono">
            {currentProblem.left}{" "}
            <span className="text-trail-primary">{currentProblem.operator}</span>{" "}
            {currentProblem.right}
          </div>
          <div className="text-3xl text-gray-400 font-bold">= ?</div>
        </div>

        {/* Answer input display */}
        <div className="w-full mb-4">
          <div
            className={`w-full h-20 rounded-2xl border-4 flex items-center justify-center text-4xl font-black font-mono transition-all duration-300 ${
              answerState === "correct"
                ? "border-green-400 bg-green-50 text-green-600"
                : answerState === "incorrect" || answerState === "timeout"
                ? "border-red-400 bg-red-50 text-red-600"
                : "border-indigo-300 bg-white text-trail-dark"
            }`}
          >
            {answerState === "correct" ? (
              <span className="flex items-center gap-2">
                <span className="text-green-500 text-3xl">&#10003;</span>
                {currentProblem.answer}
              </span>
            ) : answerState === "incorrect" ? (
              <span className="flex items-center gap-2">
                <span className="text-red-500 text-3xl">&#10007;</span>
                <span className="line-through text-red-400">{inputValue}</span>
                <span className="text-trail-dark ml-2">
                  {currentProblem.answer}
                </span>
              </span>
            ) : answerState === "timeout" ? (
              <span className="flex items-center gap-2">
                <span className="text-red-400 text-2xl">時間切れ</span>
                <span className="text-trail-dark ml-2">
                  答え: {currentProblem.answer}
                </span>
              </span>
            ) : (
              <span>
                {inputValue || (
                  <span className="text-gray-300">タップして入力</span>
                )}
                <span className="animate-pulse text-indigo-400">|</span>
              </span>
            )}
          </div>
        </div>

        {/* Feedback + Next */}
        {answerState !== "waiting" ? (
          <div className="w-full mb-4">
            <div
              className={`text-center py-3 px-4 rounded-xl mb-4 font-bold text-lg ${
                answerState === "correct"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {answerState === "correct"
                ? combo >= 3
                  ? `すごい！${combo}コンボ！`
                  : "正解！"
                : answerState === "timeout"
                ? "時間切れ..."
                : "おしい！"}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 bg-gradient-to-r from-trail-primary to-trail-secondary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {currentIndex >= totalQuestions - 1 ? "結果を見る" : "次の問題へ"}
            </button>
          </div>
        ) : (
          /* Number pad */
          <div className="w-full grid grid-cols-3 gap-2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "neg", "0", "del"].map(
              (key) => (
                <button
                  key={key}
                  onClick={() => handleKeypad(key)}
                  className={`h-14 sm:h-16 rounded-xl font-bold text-xl sm:text-2xl transition-all duration-150 active:scale-95 ${
                    key === "del"
                      ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      : key === "neg"
                      ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      : "bg-white border-2 border-gray-200 text-trail-dark hover:border-indigo-300 hover:bg-indigo-50 shadow-sm"
                  }`}
                >
                  {key === "del" ? (
                    <span className="text-lg">&#9003;</span>
                  ) : key === "neg" ? (
                    "+/-"
                  ) : (
                    key
                  )}
                </button>
              )
            )}
            {/* Submit button - full width */}
            <button
              onClick={handleSubmit}
              disabled={inputValue === ""}
              className={`col-span-3 h-14 sm:h-16 rounded-xl font-bold text-xl transition-all duration-200 ${
                inputValue === ""
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-trail-primary text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
              }`}
            >
              こたえあわせ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
