'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { SubjectCategory } from '@/types';
import { getTitleForLevel } from '@/lib/level';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RankingPlayer {
  rank: number;
  name: string;
  grade: string;
  level: number;
  xp: number;
  category?: SubjectCategory;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockRankings: RankingPlayer[] = [
  { rank: 1, name: 'たく***', grade: '小5', level: 42, xp: 12850 },
  { rank: 2, name: 'みさ***', grade: '小6', level: 38, xp: 10420 },
  { rank: 3, name: 'りく***', grade: '中1', level: 35, xp: 9300 },
  { rank: 4, name: 'はる***', grade: '小4', level: 31, xp: 8100 },
  { rank: 5, name: 'そう***', grade: '中2', level: 28, xp: 7200 },
  { rank: 6, name: 'あか***', grade: '小5', level: 25, xp: 6500 },
  { rank: 7, name: 'ゆい***', grade: '小3', level: 22, xp: 5800 },
  { rank: 8, name: 'こう***', grade: '中1', level: 20, xp: 5100 },
  { rank: 9, name: 'さく***', grade: '小6', level: 18, xp: 4500 },
  { rank: 10, name: 'れん***', grade: '小4', level: 16, xp: 3900 },
  { rank: 11, name: 'あお***', grade: '小5', level: 14, xp: 3400 },
  { rank: 12, name: 'ひな***', grade: '中2', level: 13, xp: 3100 },
  { rank: 13, name: 'かい***', grade: '小3', level: 11, xp: 2700 },
  { rank: 14, name: 'めい***', grade: '小6', level: 10, xp: 2400 },
  { rank: 15, name: 'とも***', grade: '中1', level: 9, xp: 2100 },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_TABS: Array<SubjectCategory | '総合'> = [
  '総合',
  '理科',
  '社会',
  '算数',
  '美術',
];

const PERIOD_OPTIONS = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '今週' },
  { value: 'month', label: '今月' },
  { value: 'all', label: '全期間' },
];

const GRADE_OPTIONS = [
  { value: 'all', label: 'すべての学年' },
  { value: 'lower', label: '小1〜小3' },
  { value: 'upper', label: '小4〜小6' },
  { value: 'junior', label: '中1〜中3' },
];

// ---------------------------------------------------------------------------
// Rank display component
// ---------------------------------------------------------------------------

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
        1
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-black text-lg shadow-md">
        2
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-black text-lg shadow-md">
        3
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
      {rank}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top 3 podium cards
// ---------------------------------------------------------------------------

function TopThreeCards({ players }: { players: RankingPlayer[] }) {
  const top3 = players.slice(0, 3);
  if (top3.length === 0) return null;

  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ['h-28', 'h-36', 'h-24'];
  const podiumColors = [
    'from-gray-300 to-gray-400',
    'from-yellow-300 to-yellow-500',
    'from-amber-500 to-amber-700',
  ];

  return (
    <div className="flex items-end justify-center gap-3 mb-8 md:mb-12">
      {podiumOrder.map((player, i) => {
        const isCenter = i === 1 || top3.length < 3;
        return (
          <div
            key={player.rank}
            className={`flex flex-col items-center ${isCenter ? 'z-10' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`${
                isCenter ? 'w-16 h-16' : 'w-12 h-12'
              } rounded-full bg-gradient-to-br ${
                podiumColors[i] || podiumColors[2]
              } flex items-center justify-center text-white font-black shadow-lg mb-2 ${
                isCenter ? 'text-xl' : 'text-base'
              }`}
            >
              {player.rank}
            </div>
            {/* Name & info */}
            <div className="text-center mb-2">
              <div
                className={`font-bold text-trail-dark ${
                  isCenter ? 'text-base' : 'text-sm'
                }`}
              >
                {player.name}
              </div>
              <div className="text-xs text-gray-400">{player.grade}</div>
              <div className="text-xs text-trail-primary font-medium">
                Lv.{player.level}
              </div>
            </div>
            {/* Podium bar */}
            <div
              className={`w-20 md:w-28 ${podiumHeights[i]} bg-gradient-to-t ${podiumColors[i]} rounded-t-xl flex items-center justify-center`}
            >
              <span className="text-white/80 font-bold text-sm">
                {player.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function RankingsPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    SubjectCategory | '総合'
  >('総合');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // For the mock data, filtering is simulated
  const filteredRankings = useMemo(() => {
    let result = [...mockRankings];

    if (selectedGrade !== 'all') {
      const gradeMap: Record<string, string[]> = {
        lower: ['小1', '小2', '小3'],
        upper: ['小4', '小5', '小6'],
        junior: ['中1', '中2', '中3'],
      };
      const grades = gradeMap[selectedGrade] || [];
      if (grades.length > 0) {
        result = result.filter((p) => grades.includes(p.grade));
      }
    }

    // Re-assign ranks after filtering
    return result.map((p, i) => ({ ...p, rank: i + 1 }));
  }, [selectedCategory, selectedPeriod, selectedGrade]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-trail-dark mb-2">
          &#127942; ランキング
        </h1>
        <p className="text-gray-500">
          探究の達人たちの成績をチェックしよう
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_TABS.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-trail-primary text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Period filter */}
        <div className="flex gap-2 bg-white rounded-xl border border-gray-200 p-1">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedPeriod(option.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPeriod === option.value
                  ? 'bg-trail-primary/10 text-trail-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Grade filter */}
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-trail-primary/30 focus:border-trail-primary"
        >
          {GRADE_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      {/* Top 3 podium */}
      {filteredRankings.length >= 3 && (
        <TopThreeCards players={filteredRankings} />
      )}

      {/* Rankings list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[3rem_1fr_4rem_5rem_5rem] md:grid-cols-[3.5rem_1fr_5rem_6rem_6rem_6rem] gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-400">
          <div className="text-center">順位</div>
          <div>プレイヤー</div>
          <div className="text-center">学年</div>
          <div className="text-center hidden md:block">称号</div>
          <div className="text-center">レベル</div>
          <div className="text-center">XP</div>
        </div>

        {/* Rows */}
        {filteredRankings.length > 0 ? (
          filteredRankings.map((player) => (
            <div
              key={player.rank}
              className={`grid grid-cols-[3rem_1fr_4rem_5rem_5rem] md:grid-cols-[3.5rem_1fr_5rem_6rem_6rem_6rem] gap-2 px-4 py-3 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                player.rank <= 3 ? 'bg-yellow-50/30' : ''
              }`}
            >
              <div className="flex justify-center">
                <RankBadge rank={player.rank} />
              </div>
              <div className="font-medium text-trail-dark text-sm truncate">
                {player.name}
              </div>
              <div className="text-center text-xs text-gray-500">
                {player.grade}
              </div>
              <div className="text-center text-xs text-trail-secondary font-medium hidden md:block truncate">
                {getTitleForLevel(player.level)}
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-trail-primary">
                  Lv.{player.level}
                </span>
              </div>
              <div className="text-center text-sm font-medium text-gray-600">
                {player.xp.toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">&#128566;</div>
            <p>該当するランキングデータがありません</p>
          </div>
        )}
      </div>

      {/* CTA for non-logged-in */}
      <div className="mt-8 bg-gradient-to-r from-trail-primary/5 to-trail-secondary/5 rounded-2xl p-6 md:p-8 text-center border border-trail-primary/10">
        <h3 className="text-lg font-bold text-trail-dark mb-2">
          ランキングに参加しよう!
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          ランキングに参加するには会員登録が必要です。無料でアカウントを作成して、自分の順位をチェックしよう。
        </p>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 bg-gradient-to-r from-trail-primary to-trail-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
        >
          無料で会員登録
        </Link>
      </div>
    </div>
  );
}
