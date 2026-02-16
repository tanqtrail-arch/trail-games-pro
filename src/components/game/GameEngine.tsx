"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import QuizGame from "./templates/QuizGame";
import CardGame from "./templates/CardGame";
import MazeGame from "./templates/MazeGame";
import SimulationGame from "./templates/SimulationGame";
import PuzzleGame from "./templates/PuzzleGame";
import IframeGame from "./templates/IframeGame";
import FractionGame from "./templates/FractionGame";
import ResultScreen from "./ResultScreen";

type GameState = "intro" | "playing" | "finished";
type TemplateType = "quiz" | "card" | "maze" | "simulation" | "puzzle" | "iframe" | "fraction";

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

// ---------------------------------------------------------------------------
// Config converters — translate the full game object into the shape each
// template component expects.
// ---------------------------------------------------------------------------

/** QuizGame expects { title?, questions: [{ question, choices, correctIndex, explanation, timeLimit? }] } */
function buildQuizConfig(gameConfig: any) {
  const tpl = gameConfig?.template;
  if (!tpl?.questions) return gameConfig;
  return {
    title: gameConfig.title,
    questions: tpl.questions.map((q: any) => ({
      question: q.question,
      choices: q.choices,
      correctIndex: q.correct_answer_index ?? q.correctIndex ?? 0,
      explanation: q.explanation ?? "",
      timeLimit: q.time_limit ?? q.timeLimit,
    })),
  };
}

/** CardGame expects { title?, cards: [{ id, front, back, value, category }], mode, matchPairs? } */
function buildCardConfig(gameConfig: any) {
  const tpl = gameConfig?.template;
  if (!tpl?.cards) return gameConfig;
  return {
    title: gameConfig.title,
    cards: tpl.cards.map((c: any, i: number) => ({
      id: c.id ?? `card-${i}`,
      front: c.front,
      back: c.back,
      value: c.value ?? i,
      category: c.category ?? gameConfig.category ?? "",
    })),
    mode: tpl.match_rules === "exact" ? "matching" : (tpl.mode ?? "matching"),
    matchPairs: tpl.pairs ?? tpl.matchPairs,
  };
}

/** MazeGame expects { title?, nodes, edges, startNode, goalNode } */
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

/** SimulationGame expects { title?, scenario, turns, resources[], actions[], winCondition } */
function buildSimulationConfig(gameConfig: any) {
  const tpl = gameConfig?.template;
  if (!tpl) return gameConfig;

  // Convert initial_params → resources array
  const resources = Object.entries(tpl.initial_params || {}).map(
    ([name, value]) => ({
      name,
      initial: value as number,
      min: 0,
      max: name === "予算" ? 2000 : name === "人口" ? 1000 : 100,
    })
  );

  // If the template already has actions use those, otherwise generate defaults
  const actions = tpl.actions ?? [
    { id: "solar", label: "太陽光発電を設置", effects: { 環境: 10, 経済: 5, 予算: -150 }, description: "クリーンエネルギーで環境改善" },
    { id: "recycle", label: "リサイクル施設を建設", effects: { 環境: 8, 住民満足度: 5, 予算: -120 }, description: "ゴミを減らして資源を有効活用" },
    { id: "factory", label: "工場を誘致", effects: { 経済: 15, 環境: -8, 人口: 20, 予算: -100 }, description: "雇用を生み出し経済を活性化" },
    { id: "park", label: "公園を整備", effects: { 住民満足度: 12, 環境: 5, 予算: -80 }, description: "緑豊かな公園で住民の憩いの場を" },
    { id: "school", label: "学校を増設", effects: { 住民満足度: 8, 経済: 3, 人口: 15, 予算: -200 }, description: "教育環境を充実させる" },
    { id: "market", label: "商店街を活性化", effects: { 経済: 10, 住民満足度: 8, 予算: -90 }, description: "地元の商店街を盛り上げよう" },
  ];

  // Convert success_conditions → single winCondition (pick first entry)
  const entries = Object.entries(tpl.success_conditions || {});
  const winCondition =
    entries.length > 0
      ? { resource: entries[0][0], target: entries[0][1] as number }
      : { resource: "環境", target: 70 };

  return {
    title: gameConfig.title,
    scenario: tpl.scenario,
    turns: tpl.max_steps ?? tpl.turns ?? 5,
    resources,
    actions,
    winCondition,
  };
}

/** PuzzleGame expects { title?, puzzleType, puzzles: [{ question, options, correctIndex, hint? }] } */
function buildPuzzleConfig(gameConfig: any) {
  const tpl = gameConfig?.template;
  if (!tpl) return gameConfig;

  // Already in the expected format
  if (tpl.puzzles) {
    return { title: gameConfig.title, puzzleType: tpl.puzzleType ?? "sequence", puzzles: tpl.puzzles };
  }

  // Convert number-sequence data into puzzle objects
  const puzzleTypeMap: Record<string, string> = {
    number_sequence: "sequence",
    logic: "logic",
    pattern: "pattern",
  };
  const puzzleType = puzzleTypeMap[tpl.puzzle_type] || tpl.puzzle_type || "sequence";

  const puzzles = generateSequencePuzzles(tpl.solution, tpl.hints);

  return { title: gameConfig.title, puzzleType, puzzles };
}

/** Generate number-sequence puzzles from solution array + hints */
function generateSequencePuzzles(
  solutions: number[] | undefined,
  hints: string[] | undefined
) {
  if (!solutions || solutions.length === 0) return [];

  // Sequence templates keyed by pattern description
  const sequenceBuilders: Array<{
    build: () => { seq: number[]; answer: number };
  }> = [
    { build: () => ({ seq: [2, 4, 6, 8], answer: 10 }) },
    { build: () => ({ seq: [3, 6, 9, 12], answer: 15 }) },
    { build: () => ({ seq: [1, 2, 4, 8, 16], answer: 32 }) },
    { build: () => ({ seq: [4, 8, 12, 20], answer: 32 }) },
    { build: () => ({ seq: [1, 3, 6, 10, 15], answer: 21 }) },
  ];

  return solutions.map((answer, i) => {
    // Try to use a matching builder, otherwise create a simple +N pattern
    const builder = sequenceBuilders[i];
    let seq: number[];
    if (builder && builder.build().answer === answer) {
      seq = builder.build().seq;
    } else {
      // Generate a simple additive sequence ending at answer
      const step = Math.max(1, Math.floor(answer / 5));
      seq = Array.from({ length: 4 }, (_, j) => answer - step * (4 - j));
    }

    const seqStr = seq.join(", ");

    // Build 4 options around the answer
    const options = shuffleOptions(answer);

    return {
      question: `次の数列の「？」に入る数は？\n${seqStr}, ?`,
      options: options.map(String),
      correctIndex: options.indexOf(answer),
      hint: hints?.[i],
    };
  });
}

function shuffleOptions(answer: number): number[] {
  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5 || 1;
    opts.add(answer + offset);
  }
  const arr = Array.from(opts);
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Route the full game object through the correct converter for the given
 * template type.
 */
function buildTemplateConfig(gameConfig: any, templateType: string) {
  switch (templateType) {
    case "quiz":
      return buildQuizConfig(gameConfig);
    case "card":
      return buildCardConfig(gameConfig);
    case "maze":
      return buildMazeConfig(gameConfig);
    case "simulation":
      return buildSimulationConfig(gameConfig);
    case "puzzle":
      return buildPuzzleConfig(gameConfig);
    case "iframe":
      return gameConfig; // IframeGame expects the full game object
    default:
      return gameConfig;
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
    iframe: IframeGame,
    fraction: FractionGame,
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
    };

    const templateIcons: Record<TemplateType, string> = {
      quiz: "?",
      card: "🂠",
      maze: "🧭",
      simulation: "📊",
      puzzle: "🧩",
      iframe: "🌐",
      fraction: "🔫",
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

    // Convert the full game object into the shape the template expects
    const resolvedConfig = buildTemplateConfig(gameConfig, templateType);

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
      />
    );
  }

  return null;
}
