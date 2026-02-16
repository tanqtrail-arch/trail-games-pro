"use client";

import { useState, useCallback, useRef } from "react";
import { calculateCoinsEarned } from "@/lib/level";
import { useAuth } from "@/lib/auth-context";
import QuizGame from "./templates/QuizGame";
import CardGame from "./templates/CardGame";
import MazeGame from "./templates/MazeGame";
import SimulationGame from "./templates/SimulationGame";
import PuzzleGame from "./templates/PuzzleGame";
import IframeGame from "./templates/IframeGame";
import FractionGame from "./templates/FractionGame";
import MentalMathGame from "./templates/MentalMathGame";
import ResultScreen from "./ResultScreen";

type GameState = "intro" | "playing" | "finished";
type TemplateType = "quiz" | "card" | "maze" | "simulation" | "puzzle" | "iframe" | "fraction" | "mental-math";

export interface GameResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  details: Array<{ question: number; correct: boolean; time: number }>;
}

export interface ScoreDisplayConfig {
  type: "rank" | "points" | "stars" | "title";
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
  /** true の場合イントロ画面をスキップして直接ゲームを開始する */
  autoStart?: boolean;
}

// =============================================================================
// Config resolvers — convert GameWithTemplate data into the shape each
// template component expects.  All resolvers receive the FULL game object and
// return a flat config the component can destructure directly.
// =============================================================================

/** Flatten template into top-level fields so components can destructure directly. */
function flattenTemplate(gameConfig: any): any {
  const tpl = gameConfig?.template;
  if (!tpl) return gameConfig;
  return { ...gameConfig, ...tpl };
}

/** QuizGame expects { questions[].correctIndex, .timeLimit } */
function buildQuizConfig(gameConfig: any) {
  const flat = flattenTemplate(gameConfig);
  return {
    ...flat,
    questions: (flat.questions || []).map((q: any) => ({
      ...q,
      correctIndex: q.correctIndex ?? q.correct_answer_index ?? 0,
      timeLimit: q.timeLimit ?? q.time_limit,
    })),
  };
}

/** MazeGame expects { title, nodes, edges, startNode, goalNode } */
function buildMazeConfig(gameConfig: any) {
  const tpl = gameConfig?.template;
  if (tpl?.nodes && tpl?.edges) {
    return {
      title: gameConfig.title,
      nodes: tpl.nodes,
      edges: tpl.edges,
      startNode: tpl.startNode,
      goalNode: tpl.goalNode,
    };
  }
  return gameConfig;
}

/** CardGame expects { cards[].{id, front, back, value, category}, mode, matchPairs } */
function buildCardConfig(gameConfig: any) {
  const flat = flattenTemplate(gameConfig);
  const cards = (flat.cards || []).map((c: any, i: number) => ({
    id: c.id || `card-${i}`,
    front: c.front || "",
    back: c.back || "",
    value: c.value ?? i,
    category: c.category || "default",
  }));
  return {
    ...flat,
    cards,
    mode: flat.mode || "matching",
    matchPairs: flat.matchPairs ?? flat.pairs ?? Math.min(cards.length, 6),
  };
}

/** SimulationGame expects { scenario, turns, resources[], actions[], winCondition } */
function buildSimulationConfig(gameConfig: any) {
  const flat = flattenTemplate(gameConfig);
  const initialParams: Record<string, number> = flat.initial_params || {};
  const successConditions: Record<string, number> = flat.success_conditions || {};
  const resourceNames = Object.keys(initialParams);

  const resources = resourceNames.map((name) => ({
    name,
    initial: initialParams[name],
    min: 0,
    max: Math.max(initialParams[name] * 3, 100),
  }));

  // Generate actions from resources when not provided
  const actions: any[] = flat.actions || resourceNames.map((name, i) => {
    const others = resourceNames.filter((n) => n !== name);
    const effects: Record<string, number> = { [name]: 15 };
    if (others.length > 0) effects[others[0]] = -5;
    return {
      id: `action-${i}`,
      label: `${name}を強化`,
      effects,
      description: `${name}を改善します`,
    };
  });

  // Add a balanced action if we auto-generated
  if (!flat.actions && resourceNames.length > 0) {
    actions.push({
      id: "action-balanced",
      label: "バランス改善",
      effects: Object.fromEntries(resourceNames.map((n) => [n, 5])),
      description: "すべてを少しずつ改善します",
    });
  }

  const firstCond = Object.entries(successConditions)[0];
  const winCondition = firstCond
    ? { resource: firstCond[0], target: firstCond[1] as number }
    : { resource: resourceNames[0] || "", target: 70 };

  return {
    ...flat,
    turns: flat.turns ?? flat.max_steps ?? 5,
    resources,
    actions,
    winCondition,
  };
}

/** PuzzleGame expects { puzzleType, puzzles[].{question, options[], correctIndex, hint?} } */
function buildPuzzleConfig(gameConfig: any) {
  const flat = flattenTemplate(gameConfig);
  const puzzleType = flat.puzzleType || (flat.puzzle_type === "number_sequence" ? "sequence" : flat.puzzle_type) || "logic";
  const solution: Array<number | string> = flat.solution || [];
  const hints: string[] = flat.hints || [];

  // If component-ready puzzles already exist, use them
  if (flat.puzzles && Array.isArray(flat.puzzles) && flat.puzzles.length > 0) {
    return { ...flat, puzzleType };
  }

  // Generate puzzles from solution/hints
  const puzzles = solution.map((answer, i) => {
    const numAnswer = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    const offsets = [3, -2, 5, -4, 7];
    const wrongAnswers = [1, 2, 3].map((j) => numAnswer + offsets[(i + j) % offsets.length]);
    const allOptions = [numAnswer, ...wrongAnswers].map(String);
    // Shuffle but track correct index
    const shuffled = allOptions
      .map((val, idx) => ({ val, sort: idx === 0 ? -1 : Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.val);
    const correctIndex = shuffled.indexOf(String(numAnswer));

    return {
      question: hints[i] || `次の答えは？`,
      options: shuffled,
      correctIndex,
      hint: hints[i],
    };
  });

  return {
    ...flat,
    puzzleType,
    puzzles: puzzles.length > 0 ? puzzles : [{ question: "パズル", options: ["A", "B", "C"], correctIndex: 0 }],
  };
}

/**
 * Resolve game config for any template type.
 * Converts the GameWithTemplate data structure into the flat shape
 * each template component expects.
 */
function resolveGameConfig(gameConfig: any, templateType: string): any {
  switch (templateType) {
    case "quiz":
      return buildQuizConfig(gameConfig);
    case "maze":
      return buildMazeConfig(gameConfig);
    case "card":
      return buildCardConfig(gameConfig);
    case "simulation":
      return buildSimulationConfig(gameConfig);
    case "puzzle":
      return buildPuzzleConfig(gameConfig);
    default:
      // fraction, iframe, mental-math — these already handle nested access
      return flattenTemplate(gameConfig);
  }
}

export default function GameEngine({
  gameId,
  gameConfig,
  templateType,
  scoreDisplayConfig,
  skillTags,
  autoStart = false,
}: GameEngineProps) {
  const [gameState, setGameState] = useState<GameState>(autoStart ? "playing" : "intro");
  const [result, setResult] = useState<GameResult | null>(null);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const { user, addCoins } = useAuth();

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

      // Calculate coins earned
      const coins = calculateCoinsEarned(
        gameResult.score,
        gameResult.maxScore,
        gameResult.timeSeconds,
        gameResult.skills
      );
      setCoinsEarned(coins);
      addCoins(coins);

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
    [gameId, addCoins]
  );

  const handleReplay = useCallback(() => {
    setResult(null);
    setCoinsEarned(0);
    setSubmitError(null);
    setGameState("intro");
  }, []);

  const templateComponents: Record<TemplateType, React.ComponentType<any>> = {
    quiz: QuizGame,
    card: CardGame,
    maze: MazeGame,
    simulation: SimulationGame,
    puzzle: PuzzleGame,
    iframe: IframeGame,
    fraction: FractionGame,
    "mental-math": MentalMathGame,
  };

  // ---- Intro Screen ----
  if (gameState === "intro") {
    const templateLabels: Record<TemplateType, string> = {
      quiz: "クイズ",
      card: "カードゲーム",
      maze: "探検",
      simulation: "シミュレーション",
      puzzle: "パズル",
      iframe: "外部ゲーム",
      fraction: "分数ガンマン",
      "mental-math": "暗算チャレンジ",
    };

    const templateIcons: Record<TemplateType, string> = {
      quiz: "?",
      card: "🂠",
      maze: "🧭",
      simulation: "📊",
      puzzle: "🧩",
      iframe: "🌐",
      fraction: "🔫",
      "mental-math": "🧮",
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

    // Convert raw GameWithTemplate data into the flat shape each template expects
    const resolvedConfig = resolveGameConfig(gameConfig, templateType);

    return (
      <div className="min-h-screen bg-gray-50">
        <TemplateComponent gameConfig={resolvedConfig} onFinish={handleFinish} />
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
        coinsEarned={coinsEarned}
        totalCoins={user?.coins ?? 0}
      />
    );
  }

  return null;
}
