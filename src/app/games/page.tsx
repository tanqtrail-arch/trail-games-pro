'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { SubjectCategory, GameTemplateType } from '@/types';
import {
  sampleGames,
  categoryColors,
  getGradeRange,
} from '@/data/sample-games';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_CATEGORIES: Array<SubjectCategory | 'すべて'> = [
  'すべて',
  '理科',
  '社会',
  '算数',
  '美術',
];

const ALL_TEMPLATES: Array<{ value: GameTemplateType | 'all'; label: string }> = [
  { value: 'all', label: 'すべて' },
  { value: 'quiz', label: 'クイズ' },
  { value: 'card', label: 'カード' },
  { value: 'maze', label: '迷路' },
  { value: 'simulation', label: 'シミュレーション' },
  { value: 'puzzle', label: 'パズル' },
];

const GRADE_FILTERS = [
  { value: 'all', label: 'すべての学年' },
  { value: 'lower-elementary', label: '小1〜小3' },
  { value: 'upper-elementary', label: '小4〜小6' },
  { value: 'junior-high', label: '中1〜中3' },
];

// ---------------------------------------------------------------------------
// Skill indicator
// ---------------------------------------------------------------------------

function SkillDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < value ? 'bg-trail-primary' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template type badge
// ---------------------------------------------------------------------------

function TemplateBadge({ type }: { type: GameTemplateType }) {
  const labels: Record<GameTemplateType, { label: string; emoji: string }> = {
    quiz: { label: 'クイズ', emoji: '?' },
    card: { label: 'カード', emoji: '&#127183;' },
    maze: { label: '迷路', emoji: '&#128739;' },
    simulation: { label: 'シミュレーション', emoji: '&#127961;' },
    puzzle: { label: 'パズル', emoji: '&#129513;' },
  };
  const info = labels[type];
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
      <span dangerouslySetInnerHTML={{ __html: info.emoji }} />
      {info.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Game card
// ---------------------------------------------------------------------------

function GameCard({
  game,
}: {
  game: (typeof sampleGames)[number];
}) {
  const colors = categoryColors[game.category];

  return (
    <Link href={`/games/${game.id}`} className="card-game group">
      {/* Thumbnail placeholder */}
      <div
        className={`h-40 bg-gradient-to-br ${colors.gradient} flex items-center justify-center relative overflow-hidden`}
      >
        <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform">
          {game.category === '理科' && '\uD83E\uDDA0'}
          {game.category === '社会' && '\uD83C\uDF0E'}
          {game.category === '算数' && '\uD83D\uDD22'}
          {game.category === '美術' && '\uD83C\uDFA8'}
        </span>
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 badge ${colors.bg} ${colors.text} text-xs`}
        >
          {game.category}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-trail-dark group-hover:text-trail-primary transition-colors line-clamp-1">
            {game.title}
          </h3>
        </div>

        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {game.description}
        </p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
            {getGradeRange(game.grade_min, game.grade_max)}
          </span>
          <TemplateBadge type={game.template.type} />
        </div>

        {/* Skill indicators */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-12">思考力</span>
            <SkillDots value={game.skill_tags.思考力} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-12">探究力</span>
            <SkillDots value={game.skill_tags.探究力} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-12">創造力</span>
            <SkillDots value={game.skill_tags.創造力} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    SubjectCategory | 'すべて'
  >('すべて');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<
    GameTemplateType | 'all'
  >('all');

  const filteredGames = useMemo(() => {
    return sampleGames.filter((game) => {
      // Category filter
      if (
        selectedCategory !== 'すべて' &&
        game.category !== selectedCategory
      ) {
        return false;
      }

      // Grade filter
      if (selectedGrade !== 'all') {
        const gradeRanges: Record<string, [number, number]> = {
          'lower-elementary': [1, 3],
          'upper-elementary': [4, 6],
          'junior-high': [7, 9],
        };
        const range = gradeRanges[selectedGrade];
        if (range) {
          const [min, max] = range;
          // Game overlaps with selected grade range
          if (game.grade_max < min || game.grade_min > max) {
            return false;
          }
        }
      }

      // Template filter
      if (selectedTemplate !== 'all' && game.template.type !== selectedTemplate) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedGrade, selectedTemplate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-trail-dark mb-2">
          &#127918; ゲーム一覧
        </h1>
        <p className="text-gray-500">
          好きなゲームを選んで、探究の旅に出かけよう
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Category filter */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              教科
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-trail-primary text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grade filter */}
          <div className="w-full md:w-48">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              学年
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-trail-primary/30 focus:border-trail-primary"
            >
              {GRADE_FILTERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Template filter */}
          <div className="w-full md:w-48">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              ゲーム形式
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) =>
                setSelectedTemplate(e.target.value as GameTemplateType | 'all')
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-trail-primary/30 focus:border-trail-primary"
            >
              {ALL_TEMPLATES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-4">
        {filteredGames.length} 件のゲームが見つかりました
      </p>

      {/* Game grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">&#128270;</div>
          <p className="text-gray-500 font-medium mb-2">
            条件に合うゲームが見つかりませんでした
          </p>
          <p className="text-gray-400 text-sm">
            フィルターを変更してみてください
          </p>
        </div>
      )}
    </div>
  );
}
