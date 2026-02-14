"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Resource {
  name: string;
  initial: number;
  min: number;
  max: number;
}

interface Action {
  id: string;
  label: string;
  effects: Record<string, number>;
  description: string;
}

interface WinCondition {
  resource: string;
  target: number;
}

interface GameResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  details: Array<{ question: number; correct: boolean; time: number }>;
}

interface SimulationGameProps {
  gameConfig: {
    title?: string;
    scenario: string;
    turns: number;
    resources: Resource[];
    actions: Action[];
    winCondition: WinCondition;
  };
  onFinish: (result: GameResult) => void;
}

export default function SimulationGame({
  gameConfig,
  onFinish,
}: SimulationGameProps) {
  const { scenario, turns, resources, actions, winCondition } = gameConfig;

  // Initialize resource state
  const [resourceValues, setResourceValues] = useState<Record<string, number>>(
    () => {
      const values: Record<string, number> = {};
      resources.forEach((r) => {
        values[r.name] = r.initial;
      });
      return values;
    }
  );

  const [currentTurn, setCurrentTurn] = useState(1);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [showEffects, setShowEffects] = useState(false);
  const [effectDeltas, setEffectDeltas] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<
    Array<{ turn: number; action: string; resources: Record<string, number> }>
  >([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [animatingBars, setAnimatingBars] = useState(false);
  const startTimeRef = useRef(Date.now());
  const details = useRef<Array<{ question: number; correct: boolean; time: number }>>([]);
  const turnStartTime = useRef(Date.now());

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  // Resource min/max lookup
  const resourceConfig = useCallback(
    (name: string): Resource => {
      return (
        resources.find((r) => r.name === name) || {
          name,
          initial: 0,
          min: 0,
          max: 100,
        }
      );
    },
    [resources]
  );

  const clampResource = useCallback(
    (name: string, value: number): number => {
      const config = resourceConfig(name);
      return Math.max(config.min, Math.min(config.max, value));
    },
    [resourceConfig]
  );

  const getResourcePercentage = useCallback(
    (name: string, value: number): number => {
      const config = resourceConfig(name);
      const range = config.max - config.min;
      if (range === 0) return 100;
      return Math.round(((value - config.min) / range) * 100);
    },
    [resourceConfig]
  );

  const getBarColor = useCallback((percentage: number): string => {
    if (percentage >= 70) return "from-green-400 to-green-500";
    if (percentage >= 40) return "from-amber-400 to-amber-500";
    return "from-red-400 to-red-500";
  }, []);

  const handleSelectAction = useCallback((action: Action) => {
    setSelectedAction(action);
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (!selectedAction || gameOver) return;

    const turnTime = Math.round((Date.now() - turnStartTime.current) / 1000);
    const newResources = { ...resourceValues };
    const deltas: Record<string, number> = {};

    // Apply effects
    for (const [resourceName, delta] of Object.entries(selectedAction.effects)) {
      if (resourceName in newResources) {
        const oldValue = newResources[resourceName];
        newResources[resourceName] = clampResource(
          resourceName,
          oldValue + delta
        );
        deltas[resourceName] = newResources[resourceName] - oldValue;
      }
    }

    setEffectDeltas(deltas);
    setShowEffects(true);
    setAnimatingBars(true);

    // Record in history
    setHistory((prev) => [
      ...prev,
      {
        turn: currentTurn,
        action: selectedAction.label,
        resources: { ...newResources },
      },
    ]);

    // Check if the action moved the win condition resource closer to target
    const winResource = winCondition.resource;
    const oldWinValue = resourceValues[winResource] || 0;
    const newWinValue = newResources[winResource] || 0;
    const closerToTarget =
      Math.abs(winCondition.target - newWinValue) <
      Math.abs(winCondition.target - oldWinValue);

    details.current.push({
      question: currentTurn,
      correct: closerToTarget,
      time: turnTime,
    });

    // Apply after animation delay
    setTimeout(() => {
      setResourceValues(newResources);
      setAnimatingBars(false);

      setTimeout(() => {
        setShowEffects(false);
        setEffectDeltas({});
        setSelectedAction(null);

        const isLastTurn = currentTurn >= turns;
        const hasWon = newResources[winCondition.resource] >= winCondition.target;

        if (isLastTurn || hasWon) {
          setGameOver(true);
          setWon(hasWon);

          const totalTime = Math.round(
            (Date.now() - startTimeRef.current) / 1000
          );
          const winResourceValue = newResources[winCondition.resource] || 0;
          const progress = Math.min(
            100,
            Math.round((winResourceValue / winCondition.target) * 100)
          );
          const score = hasWon ? Math.min(100, 70 + Math.round((turns - currentTurn) / turns * 30)) : progress;

          setTimeout(() => {
            onFinish({
              score,
              maxScore: 100,
              timeSeconds: totalTime,
              skills: {
                思考力: Math.round(score / 10),
                探究力: Math.min(10, Math.round(currentTurn * 1.5)),
                創造力: Math.round(
                  Math.max(0, 10 - totalTime / (turns * 5))
                ),
              },
              details: details.current,
            });
          }, 2000);
        } else {
          setCurrentTurn((prev) => prev + 1);
          turnStartTime.current = Date.now();
        }
      }, 300);
    }, 800);
  }, [
    selectedAction,
    gameOver,
    resourceValues,
    currentTurn,
    turns,
    winCondition,
    clampResource,
    onFinish,
  ]);

  const turnProgress = (currentTurn / turns) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-trail-dark">
              ターン {currentTurn} / {turns}
            </span>
            <span className="text-sm text-gray-400">{elapsedTime}秒</span>
          </div>

          {/* Turn progress */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500"
              style={{ width: `${turnProgress}%` }}
            />
          </div>

          {/* Win condition reminder */}
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-gray-400">目標:</span>
            <span className="text-xs font-bold text-trail-primary">
              {winCondition.resource} を {winCondition.target} にする
            </span>
            <span className="text-xs text-gray-400 ml-1">
              (現在: {resourceValues[winCondition.resource] ?? 0})
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Scenario box (shown on first turn) */}
        {currentTurn === 1 && !selectedAction && (
          <div className="bg-sky-50 rounded-xl p-4 mb-4 border border-sky-100">
            <p className="text-xs font-bold text-sky-600 mb-1">シナリオ</p>
            <p className="text-sm text-sky-800 leading-relaxed">{scenario}</p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver ? (
          <div className="text-center py-12">
            <div
              className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-5xl shadow-xl ${
                won
                  ? "bg-gradient-to-br from-amber-400 to-amber-500 animate-bounce"
                  : "bg-gradient-to-br from-gray-400 to-gray-500"
              }`}
            >
              {won ? "🎉" : "📊"}
            </div>
            <h2 className="text-2xl font-bold text-trail-dark mb-2">
              {won ? "目標達成！" : "シミュレーション終了"}
            </h2>
            <p className="text-gray-500 mb-2">
              {won
                ? `${currentTurn}ターンで目標を達成！`
                : `${turns}ターン終了 - 目標には届かなかった...`}
            </p>
            <p className="text-sm text-gray-400">結果を計算中...</p>
          </div>
        ) : (
          <>
            {/* Resource bars */}
            <div className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
                リソース状況
              </p>
              <div className="space-y-3">
                {resources.map((resource) => {
                  const value = resourceValues[resource.name] ?? 0;
                  const percentage = getResourcePercentage(resource.name, value);
                  const barColor = getBarColor(percentage);
                  const delta = effectDeltas[resource.name];
                  const isWinResource = resource.name === winCondition.resource;

                  return (
                    <div key={resource.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            isWinResource
                              ? "text-trail-primary font-bold"
                              : "text-trail-dark"
                          }`}
                        >
                          {isWinResource && "★ "}
                          {resource.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-trail-dark">
                            {value}
                          </span>
                          <span className="text-xs text-gray-400">
                            / {resource.max}
                          </span>
                          {showEffects && delta !== undefined && delta !== 0 && (
                            <span
                              className={`text-xs font-bold ml-1 animate-bounce ${
                                delta > 0 ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {delta > 0 ? `+${delta}` : delta}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {isWinResource && (
                        <div className="relative mt-0.5">
                          <div
                            className="absolute top-0 w-0.5 h-2 bg-trail-primary"
                            style={{
                              left: `${getResourcePercentage(
                                resource.name,
                                winCondition.target
                              )}%`,
                            }}
                          />
                          <div
                            className="absolute top-2 text-[9px] text-trail-primary font-bold -translate-x-1/2"
                            style={{
                              left: `${getResourcePercentage(
                                resource.name,
                                winCondition.target
                              )}%`,
                            }}
                          >
                            目標
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action selection */}
            {!showEffects && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-500 mb-2">
                  アクションを選択
                </p>

                {actions.map((action) => {
                  const isSelected = selectedAction?.id === action.id;

                  return (
                    <button
                      key={action.id}
                      onClick={() => handleSelectAction(action)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-trail-primary bg-trail-primary/5 shadow-md scale-[1.01]"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base font-bold text-trail-dark">
                          {action.label}
                        </span>
                        {isSelected && (
                          <span className="text-xs bg-trail-primary text-white px-2 py-0.5 rounded-full">
                            選択中
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {action.description}
                      </p>

                      {/* Effect preview */}
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(action.effects).map(
                          ([resource, effect]) => (
                            <span
                              key={resource}
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                effect > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {resource} {effect > 0 ? `+${effect}` : effect}
                            </span>
                          )
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Confirm button */}
                {selectedAction && (
                  <button
                    onClick={handleConfirmAction}
                    className="w-full py-4 bg-gradient-to-r from-trail-primary to-trail-secondary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4"
                  >
                    「{selectedAction.label}」を実行する
                  </button>
                )}
              </div>
            )}

            {/* Effect animation overlay */}
            {showEffects && selectedAction && (
              <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">
                  「{selectedAction.label}」を実行！
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {Object.entries(effectDeltas).map(([resource, delta]) =>
                    delta !== 0 ? (
                      <div
                        key={resource}
                        className={`text-lg font-bold animate-bounce ${
                          delta > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {resource} {delta > 0 ? `+${delta}` : delta}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* History (collapsible) */}
        {history.length > 0 && !gameOver && (
          <details className="mt-6">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
              行動履歴を見る ({history.length}ターン)
            </summary>
            <div className="mt-2 space-y-1">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2"
                >
                  <span className="font-bold">ターン{h.turn}:</span>{" "}
                  {h.action}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
