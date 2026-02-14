"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Card {
  id: string;
  front: string;
  back: string;
  value: number;
  category: string;
}

interface GameResult {
  score: number;
  maxScore: number;
  timeSeconds: number;
  skills: { 思考力: number; 探究力: number; 創造力: number };
  details: Array<{ question: number; correct: boolean; time: number }>;
}

interface CardGameProps {
  gameConfig: {
    title?: string;
    cards: Card[];
    mode: "matching" | "battle" | "sort";
    matchPairs?: number;
  };
  onFinish: (result: GameResult) => void;
}

interface CardState {
  id: string;
  pairId: string;
  front: string;
  back: string;
  flipped: boolean;
  matched: boolean;
}

// ---- Matching Mode Component ----
function MatchingMode({
  cards,
  matchPairs,
  onFinish,
}: {
  cards: Card[];
  matchPairs: number;
  onFinish: (result: GameResult) => void;
}) {
  const [boardCards, setBoardCards] = useState<CardState[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [matchAnimation, setMatchAnimation] = useState<string | null>(null);
  const startTimeRef = useRef(Date.now());
  const totalPairs = matchPairs || Math.min(cards.length, 6);
  const details = useRef<Array<{ question: number; correct: boolean; time: number }>>([]);
  const lastActionTime = useRef(Date.now());

  // Initialize board
  useEffect(() => {
    const selectedCards = cards.slice(0, totalPairs);
    const pairs: CardState[] = [];

    selectedCards.forEach((card) => {
      pairs.push({
        id: `${card.id}-a`,
        pairId: card.id,
        front: card.front,
        back: card.back,
        flipped: false,
        matched: false,
      });
      pairs.push({
        id: `${card.id}-b`,
        pairId: card.id,
        front: card.front,
        back: card.back,
        flipped: false,
        matched: false,
      });
    });

    // Shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    setBoardCards(pairs);
  }, [cards, totalPairs]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = useCallback(
    (index: number) => {
      if (isChecking) return;
      if (boardCards[index].flipped || boardCards[index].matched) return;
      if (flippedIndices.length >= 2) return;

      const newCards = [...boardCards];
      newCards[index] = { ...newCards[index], flipped: true };
      setBoardCards(newCards);

      const newFlipped = [...flippedIndices, index];
      setFlippedIndices(newFlipped);

      if (newFlipped.length === 2) {
        setIsChecking(true);
        setAttempts((prev) => prev + 1);
        const timeSinceLastAction = (Date.now() - lastActionTime.current) / 1000;

        const card1 = newCards[newFlipped[0]];
        const card2 = newCards[newFlipped[1]];

        if (card1.pairId === card2.pairId) {
          // Match found
          details.current.push({
            question: attempts + 1,
            correct: true,
            time: Math.round(timeSinceLastAction),
          });

          setTimeout(() => {
            setBoardCards((prev) =>
              prev.map((c) =>
                c.pairId === card1.pairId ? { ...c, matched: true } : c
              )
            );
            setMatchAnimation(card1.pairId);
            setTimeout(() => setMatchAnimation(null), 600);
            setMatchedCount((prev) => prev + 1);
            setFlippedIndices([]);
            setIsChecking(false);
            lastActionTime.current = Date.now();
          }, 500);
        } else {
          // No match
          details.current.push({
            question: attempts + 1,
            correct: false,
            time: Math.round(timeSinceLastAction),
          });

          setTimeout(() => {
            setBoardCards((prev) =>
              prev.map((c, i) =>
                newFlipped.includes(i) ? { ...c, flipped: false } : c
              )
            );
            setFlippedIndices([]);
            setIsChecking(false);
            lastActionTime.current = Date.now();
          }, 1000);
        }
      }
    },
    [boardCards, flippedIndices, isChecking, attempts]
  );

  // Check win condition
  useEffect(() => {
    if (matchedCount === totalPairs && totalPairs > 0 && boardCards.length > 0) {
      const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      const perfectAttempts = totalPairs;
      const efficiency = Math.max(0, Math.min(100, Math.round((perfectAttempts / Math.max(1, attempts)) * 100)));

      setTimeout(() => {
        onFinish({
          score: efficiency,
          maxScore: 100,
          timeSeconds: totalTime,
          skills: {
            思考力: Math.round(efficiency / 10),
            探究力: Math.min(10, totalPairs),
            創造力: Math.round(Math.max(0, 10 - totalTime / 10)),
          },
          details: details.current,
        });
      }, 800);
    }
  }, [matchedCount, totalPairs, attempts, boardCards.length, onFinish]);

  const gridCols =
    boardCards.length <= 8
      ? "grid-cols-4"
      : boardCards.length <= 12
      ? "grid-cols-4"
      : "grid-cols-4 sm:grid-cols-6";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-trail-dark">
              ペア: {matchedCount} / {totalPairs}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              試行: {attempts}回
            </span>
            <span className="text-sm text-gray-400">{elapsedTime}秒</span>
          </div>
        </div>
        {/* Progress */}
        <div className="max-w-2xl mx-auto mt-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-trail-secondary to-trail-accent rounded-full transition-all duration-500"
              style={{ width: `${(matchedCount / totalPairs) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        <div className={`grid ${gridCols} gap-3`}>
          {boardCards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.matched || card.flipped}
              className={`aspect-square rounded-xl transition-all duration-300 transform ${
                card.matched
                  ? matchAnimation === card.pairId
                    ? "scale-110 ring-4 ring-green-400"
                    : "opacity-30 scale-95"
                  : card.flipped
                  ? "rotate-y-0"
                  : "hover:scale-105 active:scale-95"
              }`}
              style={{ perspective: "600px" }}
            >
              <div
                className={`w-full h-full relative transition-transform duration-500 ${
                  card.flipped || card.matched ? "" : ""
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform:
                    card.flipped || card.matched
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                }}
              >
                {/* Card back (face down) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-trail-primary to-trail-secondary shadow-lg flex items-center justify-center border-2 border-white/30"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-white text-2xl font-bold">?</span>
                  <div className="absolute inset-2 border border-white/20 rounded-lg" />
                </div>

                {/* Card front (face up) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-xl shadow-lg flex items-center justify-center p-2 border-2 ${
                    card.matched
                      ? "bg-green-50 border-green-300"
                      : "bg-white border-gray-200"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-sm sm:text-base font-bold text-trail-dark text-center leading-tight">
                    {card.front}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Battle Mode Component ----
function BattleMode({
  cards,
  onFinish,
}: {
  cards: Card[];
  onFinish: (result: GameResult) => void;
}) {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [opponentCards, setOpponentCards] = useState<Card[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundResult, setRoundResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [playerCard, setPlayerCard] = useState<Card | null>(null);
  const [opponentCard, setOpponentCard] = useState<Card | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(Date.now());
  const details = useRef<Array<{ question: number; correct: boolean; time: number }>>([]);
  const totalRounds = Math.min(Math.floor(cards.length / 2), 5);

  useEffect(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setPlayerCards(shuffled.slice(0, totalRounds));
    setOpponentCards(shuffled.slice(totalRounds, totalRounds * 2));
  }, [cards, totalRounds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const playCard = useCallback(
    (cardIndex: number) => {
      if (showResult || currentRound >= totalRounds) return;

      const pCard = playerCards[cardIndex];
      const oCard = opponentCards[currentRound];
      setPlayerCard(pCard);
      setOpponentCard(oCard);

      let result: "win" | "lose" | "draw";
      if (pCard.value > oCard.value) {
        result = "win";
        setPlayerScore((prev) => prev + 1);
      } else if (pCard.value < oCard.value) {
        result = "lose";
        setOpponentScore((prev) => prev + 1);
      } else {
        result = "draw";
      }

      setRoundResult(result);
      setShowResult(true);
      details.current.push({
        question: currentRound + 1,
        correct: result === "win",
        time: Math.round((Date.now() - startTimeRef.current) / 1000),
      });

      setTimeout(() => {
        setShowResult(false);
        setRoundResult(null);
        setPlayerCard(null);
        setOpponentCard(null);
        setCurrentRound((prev) => prev + 1);

        // Remove played card
        setPlayerCards((prev) => prev.filter((_, i) => i !== cardIndex));

        if (currentRound + 1 >= totalRounds) {
          const finalPlayerScore = playerScore + (result === "win" ? 1 : 0);
          const score = Math.round((finalPlayerScore / totalRounds) * 100);
          setTimeout(() => {
            onFinish({
              score,
              maxScore: 100,
              timeSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
              skills: {
                思考力: Math.round(score / 10),
                探究力: Math.min(10, totalRounds * 2),
                創造力: 5,
              },
              details: details.current,
            });
          }, 500);
        }
      }, 2000);
    },
    [
      showResult,
      currentRound,
      totalRounds,
      playerCards,
      opponentCards,
      playerScore,
      onFinish,
    ]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold text-trail-primary">
            あなた: {playerScore}
          </span>
          <span className="text-sm font-bold text-gray-500">
            ラウンド {Math.min(currentRound + 1, totalRounds)} / {totalRounds}
          </span>
          <span className="text-sm font-bold text-trail-danger">
            相手: {opponentScore}
          </span>
        </div>
      </div>

      {/* Battle area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {showResult && playerCard && opponentCard ? (
          <div className="w-full text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Player card */}
              <div className="w-32 h-44 bg-blue-100 rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center p-3 shadow-lg">
                <p className="text-xs text-blue-500 mb-1">あなた</p>
                <p className="text-sm font-bold text-trail-dark mb-2">
                  {playerCard.front}
                </p>
                <p className="text-2xl font-bold text-trail-primary">
                  {playerCard.value}
                </p>
              </div>

              <span className="text-2xl font-bold text-gray-400">VS</span>

              {/* Opponent card */}
              <div className="w-32 h-44 bg-red-100 rounded-xl border-2 border-red-300 flex flex-col items-center justify-center p-3 shadow-lg">
                <p className="text-xs text-red-500 mb-1">相手</p>
                <p className="text-sm font-bold text-trail-dark mb-2">
                  {opponentCard.front}
                </p>
                <p className="text-2xl font-bold text-trail-danger">
                  {opponentCard.value}
                </p>
              </div>
            </div>

            <div
              className={`text-2xl font-bold py-3 px-6 rounded-xl inline-block ${
                roundResult === "win"
                  ? "bg-green-100 text-green-700"
                  : roundResult === "lose"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {roundResult === "win"
                ? "勝ち！"
                : roundResult === "lose"
                ? "負け..."
                : "引き分け"}
            </div>
          </div>
        ) : currentRound < totalRounds ? (
          <div className="w-full">
            <p className="text-center text-lg font-bold text-trail-dark mb-6">
              カードを選んで出そう！
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {playerCards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => playCard(idx)}
                  className="w-28 h-40 bg-white rounded-xl border-2 border-trail-primary/30 flex flex-col items-center justify-center p-3 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <p className="text-xs text-gray-500 mb-1">{card.category}</p>
                  <p className="text-sm font-bold text-trail-dark mb-2">
                    {card.front}
                  </p>
                  <p className="text-xl font-bold text-trail-primary">
                    {card.value}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---- Sort Mode Component ----
function SortMode({
  cards,
  onFinish,
}: {
  cards: Card[];
  onFinish: (result: GameResult) => void;
}) {
  const correctOrder = [...cards].sort((a, b) => a.value - b.value);
  const [sortedCards, setSortedCards] = useState<Card[]>(() =>
    [...cards].sort(() => Math.random() - 0.5)
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCardTap = useCallback(
    (index: number) => {
      if (isCorrect) return;

      if (selectedIndex === null) {
        setSelectedIndex(index);
      } else {
        // Swap cards
        const newCards = [...sortedCards];
        [newCards[selectedIndex], newCards[index]] = [
          newCards[index],
          newCards[selectedIndex],
        ];
        setSortedCards(newCards);
        setSelectedIndex(null);
        setAttempts((prev) => prev + 1);

        // Check if sorted correctly
        const correct = newCards.every(
          (card, i) => card.id === correctOrder[i].id
        );
        if (correct) {
          setIsCorrect(true);
          const totalTime = Math.round(
            (Date.now() - startTimeRef.current) / 1000
          );
          const score = Math.max(
            10,
            100 - (attempts + 1 - cards.length) * 5
          );

          setTimeout(() => {
            onFinish({
              score: Math.min(100, Math.max(0, score)),
              maxScore: 100,
              timeSeconds: totalTime,
              skills: {
                思考力: Math.round(Math.min(100, score) / 10),
                探究力: 6,
                創造力: Math.round(
                  Math.max(0, 10 - totalTime / 10)
                ),
              },
              details: [
                {
                  question: 1,
                  correct: true,
                  time: totalTime,
                },
              ],
            });
          }, 1000);
        }
      }
    },
    [selectedIndex, sortedCards, correctOrder, attempts, cards.length, isCorrect, onFinish]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold text-trail-dark">
            並べ替え: 小さい順
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">入替: {attempts}回</span>
            <span className="text-sm text-gray-400">{elapsedTime}秒</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        <p className="text-center text-lg font-bold text-trail-dark mb-2">
          カードを2枚タップして入れ替えよう
        </p>
        <p className="text-center text-sm text-gray-500 mb-6">
          値が小さい順に並べてね
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {sortedCards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardTap(idx)}
              className={`w-24 h-36 rounded-xl border-2 flex flex-col items-center justify-center p-3 shadow-md transition-all duration-200 ${
                isCorrect
                  ? "bg-green-50 border-green-400 scale-105"
                  : selectedIndex === idx
                  ? "bg-trail-primary/10 border-trail-primary scale-110 shadow-xl"
                  : "bg-white border-gray-200 hover:border-trail-primary hover:shadow-lg hover:scale-105 active:scale-95"
              }`}
            >
              <p className="text-xs text-gray-400 mb-1">{card.category}</p>
              <p className="text-sm font-bold text-trail-dark mb-2">
                {card.front}
              </p>
              <p className="text-lg font-bold text-trail-primary">
                {card.value}
              </p>
            </button>
          ))}
        </div>

        {isCorrect && (
          <div className="mt-6 text-center">
            <p className="text-xl font-bold text-green-600 animate-bounce">
              正解！完璧な順番だね！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Main CardGame Component ----
export default function CardGame({ gameConfig, onFinish }: CardGameProps) {
  const { cards, mode, matchPairs } = gameConfig;

  switch (mode) {
    case "battle":
      return <BattleMode cards={cards} onFinish={onFinish} />;
    case "sort":
      return <SortMode cards={cards} onFinish={onFinish} />;
    case "matching":
    default:
      return (
        <MatchingMode
          cards={cards}
          matchPairs={matchPairs || Math.min(cards.length, 6)}
          onFinish={onFinish}
        />
      );
  }
}
