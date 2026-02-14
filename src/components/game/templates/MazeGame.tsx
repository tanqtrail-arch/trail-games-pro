"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

interface MazeNode {
  id: string;
  text: string;
  question?: string;
  choices?: string[];
  correctIndex?: number;
}

interface MazeEdge {
  from: string;
  to: string;
  label?: string;
}

interface GameResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  details: Array<{ question: number; correct: boolean; time: number }>;
}

interface MazeGameProps {
  gameConfig: {
    title?: string;
    nodes: MazeNode[];
    edges: MazeEdge[];
    startNode: string;
    goalNode: string;
  };
  onFinish: (result: GameResult) => void;
}

export default function MazeGame({ gameConfig, onFinish }: MazeGameProps) {
  const { nodes, edges, startNode, goalNode } = gameConfig;

  const [currentNodeId, setCurrentNodeId] = useState(startNode);
  const [pathHistory, setPathHistory] = useState<string[]>([startNode]);
  const [stepCount, setStepCount] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [pendingMoveTarget, setPendingMoveTarget] = useState<string | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set([startNode]));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [animating, setAnimating] = useState(false);

  const startTimeRef = useRef(Date.now());
  const details = useRef<Array<{ question: number; correct: boolean; time: number }>>([]);
  const questionStartTime = useRef(Date.now());

  // Build adjacency map
  const adjacencyMap = useMemo(() => {
    const map: Record<string, Array<{ to: string; label?: string }>> = {};
    for (const edge of edges) {
      if (!map[edge.from]) map[edge.from] = [];
      map[edge.from].push({ to: edge.to, label: edge.label });
    }
    return map;
  }, [edges]);

  const nodeMap = useMemo(() => {
    const map: Record<string, MazeNode> = {};
    for (const node of nodes) {
      map[node.id] = node;
    }
    return map;
  }, [nodes]);

  const currentNode = nodeMap[currentNodeId];
  const availableEdges = adjacencyMap[currentNodeId] || [];
  const isGoal = currentNodeId === goalNode;

  // Timer
  useEffect(() => {
    if (isGoal) return;
    const timer = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isGoal]);

  // Check if reached goal
  useEffect(() => {
    if (isGoal && !showQuestion) {
      const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000);

      // Calculate shortest path length for scoring
      const minSteps = calculateMinSteps(startNode, goalNode, adjacencyMap);
      const stepEfficiency = Math.max(0, Math.min(100, Math.round((minSteps / Math.max(1, stepCount)) * 100)));
      const questionBonus = questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 30) : 0;
      const score = Math.min(100, Math.round(stepEfficiency * 0.7 + questionBonus));

      setTimeout(() => {
        onFinish({
          score,
          maxScore: 100,
          timeSeconds: totalTime,
          skills: {
            思考力: Math.round((questionsCorrect / Math.max(1, questionsAnswered)) * 10),
            探究力: Math.min(10, Math.round((visitedNodes.size / nodes.length) * 10)),
            創造力: Math.round(Math.max(0, 10 - stepCount / 3)),
          },
          details: details.current,
        });
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoal]);

  const handleMove = useCallback(
    (targetNodeId: string) => {
      if (animating || isGoal) return;

      const targetNode = nodeMap[targetNodeId];

      // If target node has a question and hasn't been visited
      if (
        targetNode?.question &&
        targetNode.choices &&
        typeof targetNode.correctIndex === "number" &&
        !visitedNodes.has(targetNodeId)
      ) {
        setPendingMoveTarget(targetNodeId);
        setShowQuestion(true);
        questionStartTime.current = Date.now();
        return;
      }

      // Direct move
      executeMove(targetNodeId);
    },
    [animating, isGoal, nodeMap, visitedNodes]
  );

  const executeMove = useCallback(
    (targetNodeId: string) => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentNodeId(targetNodeId);
        setPathHistory((prev) => [...prev, targetNodeId]);
        setStepCount((prev) => prev + 1);
        setVisitedNodes((prev) => {
          const next = new Set(Array.from(prev));
          next.add(targetNodeId);
          return next;
        });
        setAnimating(false);
      }, 300);
    },
    []
  );

  const handleAnswer = useCallback(
    (choiceIndex: number) => {
      if (answerFeedback || !pendingMoveTarget) return;

      const targetNode = nodeMap[pendingMoveTarget];
      const isCorrect = choiceIndex === targetNode?.correctIndex;
      const timeTaken = Math.round((Date.now() - questionStartTime.current) / 1000);

      setSelectedAnswer(choiceIndex);
      setQuestionsAnswered((prev) => prev + 1);

      if (isCorrect) {
        setQuestionsCorrect((prev) => prev + 1);
        setAnswerFeedback("correct");
        details.current.push({
          question: questionsAnswered + 1,
          correct: true,
          time: timeTaken,
        });

        // Allow passage
        setTimeout(() => {
          setShowQuestion(false);
          setAnswerFeedback(null);
          setSelectedAnswer(null);
          executeMove(pendingMoveTarget!);
          setPendingMoveTarget(null);
        }, 1200);
      } else {
        setAnswerFeedback("incorrect");
        details.current.push({
          question: questionsAnswered + 1,
          correct: false,
          time: timeTaken,
        });

        // Block passage - go back
        setTimeout(() => {
          setShowQuestion(false);
          setAnswerFeedback(null);
          setSelectedAnswer(null);
          setPendingMoveTarget(null);
        }, 1500);
      }
    },
    [answerFeedback, pendingMoveTarget, nodeMap, questionsAnswered, executeMove]
  );

  // Calculate visited percentage
  const visitedPercentage = Math.round((visitedNodes.size / nodes.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧭</span>
              <span className="text-sm font-bold text-trail-dark">
                探検中
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {stepCount} 歩
              </span>
              <span className="text-xs text-gray-400">{elapsedTime}秒</span>
            </div>
          </div>

          {/* Exploration progress */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${visitedPercentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              探索 {visitedPercentage}%
            </span>
          </div>

          {/* Mini path breadcrumb */}
          <div className="mt-2 flex items-center gap-1 overflow-x-auto pb-1">
            {pathHistory.slice(-5).map((nodeId, i) => (
              <div key={`${nodeId}-${i}`} className="flex items-center gap-1">
                {i > 0 && (
                  <svg className="w-3 h-3 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                    nodeId === currentNodeId
                      ? "bg-emerald-100 text-emerald-700 font-bold"
                      : "text-gray-400"
                  }`}
                >
                  {nodeMap[nodeId]?.text?.slice(0, 8) || nodeId}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Goal reached */}
        {isGoal ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-5xl shadow-xl animate-bounce">
              🏆
            </div>
            <h2 className="text-2xl font-bold text-trail-dark mb-2">
              ゴールに到着！
            </h2>
            <p className="text-gray-500 mb-2">
              {stepCount}歩で到着 ・ {questionsCorrect}/{questionsAnswered} 問正解
            </p>
            <p className="text-sm text-gray-400">結果を計算中...</p>
          </div>
        ) : (
          <>
            {/* Current node card */}
            <div
              className={`bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-emerald-100 transition-all duration-300 ${
                animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {/* Node indicator */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                  現在地
                </span>
              </div>

              <p className="text-lg font-bold text-trail-dark leading-relaxed">
                {currentNode?.text || "不明な場所"}
              </p>
            </div>

            {/* Question overlay */}
            {showQuestion && pendingMoveTarget && nodeMap[pendingMoveTarget] && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-[scaleIn_0.3s_ease-out]">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🔒</span>
                    <span className="text-sm font-bold text-amber-600">
                      この道を通るには問題に答えよう！
                    </span>
                  </div>

                  <p className="text-base font-bold text-trail-dark mb-4">
                    {nodeMap[pendingMoveTarget].question}
                  </p>

                  <div className="space-y-2">
                    {nodeMap[pendingMoveTarget].choices?.map((choice, idx) => {
                      const answered = answerFeedback !== null;
                      const isCorrectChoice =
                        idx === nodeMap[pendingMoveTarget!].correctIndex;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={answered}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                            answered
                              ? isCorrectChoice
                                ? "bg-green-50 border-green-400 ring-2 ring-green-300"
                                : selectedAnswer === idx
                                ? "bg-red-50 border-red-400"
                                : "opacity-50 border-gray-200"
                              : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 active:scale-[0.98]"
                          }`}
                        >
                          <span className="text-sm font-medium">{choice}</span>
                        </button>
                      );
                    })}
                  </div>

                  {answerFeedback && (
                    <div
                      className={`mt-4 text-center py-2 rounded-xl font-bold ${
                        answerFeedback === "correct"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {answerFeedback === "correct"
                        ? "正解！通れるよ！"
                        : "不正解...別の道を探そう"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Available paths */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-500 mb-2">
                どの道を進む？
              </p>

              {availableEdges.length > 0 ? (
                availableEdges.map((edge, idx) => {
                  const targetNode = nodeMap[edge.to];
                  const alreadyVisited = visitedNodes.has(edge.to);
                  const isGoalPath = edge.to === goalNode;

                  return (
                    <button
                      key={`${edge.to}-${idx}`}
                      onClick={() => handleMove(edge.to)}
                      disabled={animating}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md active:scale-[0.98] flex items-center gap-3 ${
                        isGoalPath
                          ? "border-amber-300 bg-amber-50 hover:border-amber-400"
                          : alreadyVisited
                          ? "border-gray-200 bg-gray-50 hover:border-gray-300"
                          : "border-emerald-200 bg-white hover:border-emerald-400"
                      }`}
                    >
                      {/* Direction icon */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isGoalPath
                            ? "bg-amber-200 text-amber-700"
                            : alreadyVisited
                            ? "bg-gray-200 text-gray-500"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {isGoalPath ? (
                          <span className="text-lg">🏁</span>
                        ) : targetNode?.question && !alreadyVisited ? (
                          <span className="text-lg">❓</span>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {edge.label && (
                          <p className="text-xs text-gray-400 mb-0.5">
                            {edge.label}
                          </p>
                        )}
                        <p className="text-sm font-bold text-trail-dark truncate">
                          {targetNode?.text?.slice(0, 30) || edge.to}
                        </p>
                        {alreadyVisited && (
                          <p className="text-xs text-gray-400">訪問済み</p>
                        )}
                        {targetNode?.question && !alreadyVisited && (
                          <p className="text-xs text-amber-600 font-medium">
                            クイズあり
                          </p>
                        )}
                      </div>

                      <svg
                        className="w-5 h-5 text-gray-300 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    行き止まりだ...戻ろう
                  </p>
                  {pathHistory.length > 1 && (
                    <button
                      onClick={() => {
                        const prevNode = pathHistory[pathHistory.length - 2];
                        setCurrentNodeId(prevNode);
                        setPathHistory((prev) => [...prev, prevNode]);
                        setStepCount((prev) => prev + 1);
                      }}
                      className="mt-3 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      一歩戻る
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Helper: BFS shortest path
function calculateMinSteps(
  start: string,
  goal: string,
  adjacencyMap: Record<string, Array<{ to: string }>>
): number {
  const queue: Array<{ node: string; steps: number }> = [
    { node: start, steps: 0 },
  ];
  const visited = new Set<string>([start]);

  while (queue.length > 0) {
    const { node, steps } = queue.shift()!;
    if (node === goal) return steps;

    const neighbors = adjacencyMap[node] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.to)) {
        visited.add(neighbor.to);
        queue.push({ node: neighbor.to, steps: steps + 1 });
      }
    }
  }

  return Infinity;
}
