"use client";

import { useState, useCallback, useRef } from "react";
import QuizGame from "./templates/QuizGame";
import CardGame from "./templates/CardGame";
import MazeGame from "./templates/MazeGame";
import SimulationGame from "./templates/SimulationGame";
import PuzzleGame from "./templates/PuzzleGame";
import ResultScreen from "./ResultScreen";

type GameState = "intro" | "playing" | "finished";
type TemplateType = "quiz" | "card" | "maze" | "simulation" | "puzzle";

export interface GameResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  details: Array<{ question: number; correct: boolean; time: number }>;
}

export interface ScoreDisplayConfig {
  type: "rank" | "points" | "stars";
  ranks?: { threshold: number; label: string; color: string }[];
  maxStars?: number;
}

export interface SkillTags {
  思考力: number;
  探究力: number;
  創造力: number;
}

interface GameEngineProps {
  gameId: string;
  gameConfig: any;
  templateType: TemplateType;
  scoreDisplayConfig: ScoreDisplayConfig;
  skillTags: SkillTags;
}

export default function GameEngine({
  gameId,
  gameConfig,
  templateType,
  scoreDisplayConfig,
  skillTags,
}: GameEngineProps) {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [result, setResult] = useState<GameResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);

  const gameTitle = gameConfig?.title || "ゲーム";

  const handleStart = useCallback(() => {
    startTimeRef.current = Date.now();
    setGameState("playing");
  }, []);

  const handleFinish = useCallback(
    async (gameResult: GameResult) => {
      setResult(gameResult);
      setSubmitting(true);
      setSubmitError(null);

      try {
        const response = await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId,
            score: gameResult.score,
            maxScore: gameResult.maxScore,
            timeSeconds: gameResult.timeSeconds,
            skills: gameResult.skills,
            details: gameResult.details,
          }),
        });

        if (!response.ok) {
          throw new Error("スコアの送信に失敗しました");
        }
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "エラーが発生しました"
        );
      } finally {
        setSubmitting(false);
        setGameState("finished");
      }
    },
    [gameId]
  );

  const handleReplay = useCallback(() => {
    setResult(null);
    setSubmitError(null);
    setGameState("intro");
  }, []);

  const templateComponents: Record<TemplateType, React.ComponentType<any>> = {
    quiz: QuizGame,
    card: CardGame,
    maze: MazeGame,
    simulation: SimulationGame,
    puzzle: PuzzleGame,
  };

  // ---- Intro Screen ----
  if (gameState === "intro") {
    const templateLabels: Record<TemplateType, string> = {
      quiz: "クイズ",
      card: "カードゲーム",
      maze: "探検",
      simulation: "シミュレーション",
      puzzle: "パズル",
    };

    const templateIcons: Record<TemplateType, string> = {
      quiz: "?",
      card: "🂠",
      maze: "🧭",
      simulation: "📊",
      puzzle: "🧩",
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-trail-primary/10 via-trail-secondary/10 to-trail-accent/10 p-4">
        <div className="w-full max-w-md">
          {/* Decorative floating elements */}
          <div className="relative">
            <div className="absolute -top-8 -left-4 w-16 h-16 bg-trail-accent/20 rounded-full animate-bounce" />
            <div
              className="absolute -top-4 -right-6 w-12 h-12 bg-trail-primary/20 rounded-full animate-bounce"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="absolute top-20 -right-3 w-8 h-8 bg-trail-success/20 rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-trail-primary/10">
            {/* Header gradient bar */}
            <div className="h-2 bg-gradient-to-r from-trail-primary via-trail-secondary to-trail-accent" />

            <div className="p-8 text-center">
              {/* Game type icon */}
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-trail-primary to-trail-secondary rounded-2xl flex items-center justify-center text-4xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                <span role="img" aria-label={templateLabels[templateType]}>
                  {templateIcons[templateType]}
                </span>
              </div>

              {/* Template type badge */}
              <div className="inline-block px-3 py-1 mb-3 text-xs font-bold text-trail-secondary bg-trail-secondary/10 rounded-full">
                {templateLabels[templateType]}
              </div>

              {/* Game title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-trail-dark mb-3 leading-tight">
                {gameTitle}
              </h1>

              {/* Description */}
              {gameConfig?.description && (
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  {gameConfig.description}
                </p>
              )}

              {/* Skill tags */}
              <div className="flex justify-center gap-2 mb-8">
                {skillTags.思考力 > 0 && (
                  <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                    思考力 +{skillTags.思考力}
                  </span>
                )}
                {skillTags.探究力 > 0 && (
                  <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
                    探究力 +{skillTags.探究力}
                  </span>
                )}
                {skillTags.創造力 > 0 && (
                  <span className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
                    創造力 +{skillTags.創造力}
                  </span>
                )}
              </div>

              {/* Start button */}
              <button
                onClick={handleStart}
                className="group relative w-full py-4 px-8 bg-gradient-to-r from-trail-primary to-trail-secondary text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-trail-primary/30"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  スタート
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
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
                <div className="absolute inset-0 bg-gradient-to-r from-trail-secondary to-trail-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Bottom decoration */}
          <p className="text-center text-xs text-gray-400 mt-4">
            探究教室 TRAIL
          </p>
        </div>
      </div>
    );
  }

  // ---- Playing Screen ----
  if (gameState === "playing") {
    const TemplateComponent = templateComponents[templateType];

    if (!TemplateComponent) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-xl text-red-500 font-bold">
              未対応のゲームタイプです: {templateType}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <TemplateComponent gameConfig={gameConfig} onFinish={handleFinish} />
      </div>
    );
  }

  // ---- Finished / Result Screen ----
  if (gameState === "finished" && result) {
    return (
      <ResultScreen
        score={result.score}
        maxScore={result.maxScore}
        skills={result.skills}
        scoreDisplayConfig={scoreDisplayConfig}
        timeSeconds={result.timeSeconds}
        gameTitle={gameTitle}
        onReplay={handleReplay}
        submitting={submitting}
        submitError={submitError}
      />
    );
  }

  return null;
}
