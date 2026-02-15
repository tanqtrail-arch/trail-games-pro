'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  sampleGamesMap,
  categoryColors,
  getGradeRange,
} from '@/data/sample-games';
import type { GameTemplateType } from '@/types';

// ---------------------------------------------------------------------------
// Radar chart (pure CSS/SVG — no extra deps)
// ---------------------------------------------------------------------------

function SkillRadarChart({
  skills,
}: {
  skills: { 思考力: number; 探究力: number; 創造力: number };
}) {
  const max = 5;
  const cx = 100;
  const cy = 100;
  const r = 70;

  const angles = [-90, 30, 150].map((deg) => (deg * Math.PI) / 180);
  const labels = ['思考力', '探究力', '創造力'] as const;
  const values = [skills.思考力, skills.探究力, skills.創造力];

  const gridLevels = [1, 2, 3, 4, 5];

  const dataPoints = values.map((val, i) => {
    const ratio = val / max;
    const x = cx + r * ratio * Math.cos(angles[i]);
    const y = cy + r * ratio * Math.sin(angles[i]);
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      {gridLevels.map((level) => (
        <circle
          key={level}
          cx={cx}
          cy={cy}
          r={(r * level) / max}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
      ))}
      {angles.map((angle, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + r * Math.cos(angle)}
          y2={cy + r * Math.sin(angle)}
          stroke="#d1d5db"
          strokeWidth="0.5"
        />
      ))}
      <polygon
        points={dataPoints.join(' ')}
        fill="rgba(22, 163, 74, 0.2)"
        stroke="#16A34A"
        strokeWidth="2"
      />
      {values.map((val, i) => {
        const ratio = val / max;
        const x = cx + r * ratio * Math.cos(angles[i]);
        const y = cy + r * ratio * Math.sin(angles[i]);
        return <circle key={i} cx={x} cy={y} r="4" fill="#16A34A" />;
      })}
      {labels.map((label, i) => {
        const labelR = r + 20;
        const x = cx + labelR * Math.cos(angles[i]);
        const y = cy + labelR * Math.sin(angles[i]);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-600 font-medium"
            fontSize="11"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Template label helper
// ---------------------------------------------------------------------------

const templateLabels: Record<GameTemplateType, string> = {
  quiz: 'クイズ',
  card: 'カード',
  maze: '迷路',
  simulation: 'シミュレーション',
  puzzle: 'パズル',
  iframe: '外部ゲーム',
};

// ---------------------------------------------------------------------------
// Game detail section
// ---------------------------------------------------------------------------

function GameInfo({
  game,
}: {
  game: NonNullable<ReturnType<typeof sampleGamesMap.get>>;
}) {
  const colors = categoryColors[game.category];

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/games" className="hover:text-trail-primary transition-colors">
          ゲーム一覧
        </Link>
        <span>/</span>
        <span className="text-gray-600">{game.title}</span>
      </nav>

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`badge ${colors.bg} ${colors.text}`}>
            {game.category}
          </span>
          <span className="badge bg-gray-100 text-gray-600">
            {getGradeRange(game.grade_min, game.grade_max)}
          </span>
          <span className="badge bg-gray-100 text-gray-600">
            {templateLabels[game.template.type]}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-trail-dark">
          {game.title}
        </h1>
      </div>

      <p className="text-gray-500 leading-relaxed">{game.description}</p>

      <div className="card">
        <h3 className="text-sm font-bold text-gray-500 mb-4 text-center">
          このゲームで育つスキル
        </h3>
        <SkillRadarChart skills={game.skill_tags} />
        <div className="flex justify-center gap-6 mt-4">
          {(['思考力', '探究力', '創造力'] as const).map((skill) => (
            <div key={skill} className="text-center">
              <div className="text-lg font-black text-trail-primary">
                {game.skill_tags[skill]}
              </div>
              <div className="text-xs text-gray-400">{skill}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-bold text-gray-500 mb-3">
          スコア表示タイプ
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {game.score_display_config.type === 'rank' && '&#127942;'}
            {game.score_display_config.type === 'stars' && '&#11088;'}
            {game.score_display_config.type === 'title' && '&#127915;'}
            {game.score_display_config.type === 'points' && '&#128175;'}
          </span>
          <div>
            <div className="font-bold text-trail-dark capitalize">
              {game.score_display_config.type === 'rank' && 'ランク表示 (S/A/B/C/D)'}
              {game.score_display_config.type === 'stars' && '星評価 (最大5つ星)'}
              {game.score_display_config.type === 'title' && '称号表示'}
              {game.score_display_config.type === 'points' && 'ポイント表示'}
            </div>
            <div className="text-xs text-gray-400">
              スコアに応じて結果が変わります
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Game engine placeholder
// ---------------------------------------------------------------------------

function GameEnginePlaceholder({
  game,
}: {
  game: NonNullable<ReturnType<typeof sampleGamesMap.get>>;
}) {
  const colors = categoryColors[game.category];

  return (
    <div
      className={`bg-gradient-to-br ${colors.gradient} rounded-2xl shadow-xl overflow-hidden`}
    >
      <div className="aspect-[4/3] md:aspect-[16/10] flex flex-col items-center justify-center p-8 text-white text-center">
        <div className="text-6xl mb-4">
          {game.template.type === 'quiz' && '&#10067;'}
          {game.template.type === 'card' && '&#127183;'}
          {game.template.type === 'maze' && '&#128739;'}
          {game.template.type === 'simulation' && '&#127961;'}
          {game.template.type === 'puzzle' && '&#129513;'}
        </div>
        <h2 className="text-2xl font-black mb-2">{game.title}</h2>
        <p className="text-white/70 text-sm mb-6 max-w-md">
          {templateLabels[game.template.type]}形式 /{' '}
          {getGradeRange(game.grade_min, game.grade_max)}対象
        </p>
        <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all border border-white/30">
          &#9654; ゲームを開始する
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main client component
// ---------------------------------------------------------------------------

export default function GameDetailClient({ gameId }: { gameId: string }) {
  const game = useMemo(() => sampleGamesMap.get(gameId), [gameId]);

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">&#128533;</div>
        <h1 className="text-2xl font-black text-trail-dark mb-2">
          ゲームが見つかりません
        </h1>
        <p className="text-gray-500 mb-6">
          指定されたゲームID「{gameId}」は存在しないか、公開されていません。
        </p>
        <Link
          href="/games"
          className="inline-block px-6 py-3 bg-trail-primary text-white rounded-xl font-bold hover:opacity-90 transition-all"
        >
          ゲーム一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 order-1 lg:order-2">
          <GameEnginePlaceholder game={game} />
        </div>
        <div className="w-full lg:w-96 order-2 lg:order-1 shrink-0">
          <GameInfo game={game} />
        </div>
      </div>
    </div>
  );
}
