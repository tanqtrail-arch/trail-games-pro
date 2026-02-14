'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTitleForLevel } from '@/lib/level';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlayHistory {
  id: string;
  gameTitle: string;
  category: string;
  score: number;
  maxScore: number;
  playedAt: string;
}

// ---------------------------------------------------------------------------
// Mock profile data
// ---------------------------------------------------------------------------

const mockProfile = {
  name: 'たくま',
  grade: '小5',
  level: 42,
  xp: 12850,
  xpForCurrentLevel: 12000,
  xpForNextLevel: 14000,
  totalPlays: 187,
  totalPlayTime: 32400, // seconds
  averageScore: 78,
  subjectSkills: {
    理科: 82,
    社会: 75,
    算数: 90,
    美術: 45,
  },
  coreSkills: {
    思考力: 85,
    探究力: 72,
    創造力: 68,
  },
  achievements: [
    { id: '1', name: '初めての探究', emoji: '&#127775;', unlocked: true },
    { id: '2', name: '連続7日', emoji: '&#128293;', unlocked: true },
    { id: '3', name: '全教科制覇', emoji: '&#127752;', unlocked: true },
    { id: '4', name: 'レベル10達成', emoji: '&#11088;', unlocked: true },
    { id: '5', name: 'レベル25達成', emoji: '&#127942;', unlocked: true },
    { id: '6', name: 'Sランク獲得', emoji: '&#128081;', unlocked: true },
    { id: '7', name: 'レベル50達成', emoji: '&#128142;', unlocked: false },
    { id: '8', name: '1000回プレイ', emoji: '&#127881;', unlocked: false },
  ],
  recentPlays: [
    {
      id: '1',
      gameTitle: '歴史人物クイズ',
      category: '社会',
      score: 4,
      maxScore: 5,
      playedAt: '2026-02-14T10:30:00Z',
    },
    {
      id: '2',
      gameTitle: '数字パターンパズル',
      category: '算数',
      score: 85,
      maxScore: 100,
      playedAt: '2026-02-13T15:00:00Z',
    },
    {
      id: '3',
      gameTitle: 'エコタウンをつくろう',
      category: '理科',
      score: 230,
      maxScore: 300,
      playedAt: '2026-02-12T11:00:00Z',
    },
    {
      id: '4',
      gameTitle: '元素カードバトル',
      category: '理科',
      score: 7,
      maxScore: 8,
      playedAt: '2026-02-11T14:30:00Z',
    },
    {
      id: '5',
      gameTitle: '江戸時代タイムトラベル',
      category: '社会',
      score: 5,
      maxScore: 6,
      playedAt: '2026-02-10T09:00:00Z',
    },
  ] as PlayHistory[],
};

// ---------------------------------------------------------------------------
// Radar chart component (3-axis for core skills)
// ---------------------------------------------------------------------------

function TripleRadarChart({
  skills,
  labels,
  maxValue = 100,
}: {
  skills: number[];
  labels: string[];
  maxValue?: number;
}) {
  const cx = 100;
  const cy = 100;
  const r = 70;
  const angles = [-90, 30, 150].map((deg) => (deg * Math.PI) / 180);

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const dataPoints = skills.map((val, i) => {
    const ratio = Math.min(val / maxValue, 1);
    const x = cx + r * ratio * Math.cos(angles[i]);
    const y = cy + r * ratio * Math.sin(angles[i]);
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto">
      {gridLevels.map((level) => (
        <circle
          key={level}
          cx={cx}
          cy={cy}
          r={r * level}
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
        fill="rgba(64, 145, 108, 0.15)"
        stroke="#40916C"
        strokeWidth="2"
      />
      {skills.map((val, i) => {
        const ratio = Math.min(val / maxValue, 1);
        const x = cx + r * ratio * Math.cos(angles[i]);
        const y = cy + r * ratio * Math.sin(angles[i]);
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#40916C" />;
      })}
      {labels.map((label, i) => {
        const labelR = r + 22;
        const x = cx + labelR * Math.cos(angles[i]);
        const y = cy + labelR * Math.sin(angles[i]);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-600 font-medium"
            fontSize="10"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Quad radar chart (4-axis for subjects)
// ---------------------------------------------------------------------------

function QuadRadarChart({
  skills,
  labels,
  maxValue = 100,
}: {
  skills: number[];
  labels: string[];
  maxValue?: number;
}) {
  const cx = 100;
  const cy = 100;
  const r = 70;
  const angles = [-90, 0, 90, 180].map((deg) => (deg * Math.PI) / 180);

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const dataPoints = skills.map((val, i) => {
    const ratio = Math.min(val / maxValue, 1);
    const x = cx + r * ratio * Math.cos(angles[i]);
    const y = cy + r * ratio * Math.sin(angles[i]);
    return `${x},${y}`;
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[180px] mx-auto">
      {gridLevels.map((level) => {
        const pts = angles
          .map((a) => `${cx + r * level * Math.cos(a)},${cy + r * level * Math.sin(a)}`)
          .join(' ');
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        );
      })}
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
        fill="rgba(221, 161, 94, 0.15)"
        stroke="#DDA15E"
        strokeWidth="2"
      />
      {skills.map((val, i) => {
        const ratio = Math.min(val / maxValue, 1);
        const x = cx + r * ratio * Math.cos(angles[i]);
        const y = cy + r * ratio * Math.sin(angles[i]);
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#DDA15E" />;
      })}
      {labels.map((label, i) => {
        const labelR = r + 22;
        const x = cx + labelR * Math.cos(angles[i]);
        const y = cy + labelR * Math.sin(angles[i]);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-600 font-medium"
            fontSize="10"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// XP progress bar
// ---------------------------------------------------------------------------

function XpProgressBar({
  current,
  min,
  max,
}: {
  current: number;
  min: number;
  max: number;
}) {
  const range = max - min;
  const progress = range > 0 ? Math.min(((current - min) / range) * 100, 100) : 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{current.toLocaleString()} XP</span>
        <span>{max.toLocaleString()} XP</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-trail-primary to-trail-secondary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category color helper
// ---------------------------------------------------------------------------

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    理科: 'bg-emerald-100 text-emerald-700',
    社会: 'bg-amber-100 text-amber-700',
    算数: 'bg-blue-100 text-blue-700',
    美術: 'bg-pink-100 text-pink-700',
  };
  return map[category] || 'bg-gray-100 text-gray-700';
}

// ---------------------------------------------------------------------------
// Format relative time
// ---------------------------------------------------------------------------

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'たった今';
  if (diffMin < 60) return `${diffMin}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString('ja-JP');
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const [isAuthenticated] = useState(false);

  const profile = mockProfile;
  const title = getTitleForLevel(profile.level);
  const totalPlayHours = Math.floor(profile.totalPlayTime / 3600);
  const totalPlayMinutes = Math.floor((profile.totalPlayTime % 3600) / 60);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-trail-dark mb-2">
          &#128100; マイページ
        </h1>
        <p className="text-gray-500">あなたの探究の記録をチェックしよう</p>
      </div>

      {/* Login overlay for non-authenticated */}
      {!isAuthenticated && (
        <div className="absolute inset-0 z-30 flex items-start justify-center pt-32">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 text-center max-w-md mx-4 border border-gray-200">
            <div className="text-5xl mb-4">&#128274;</div>
            <h2 className="text-xl font-black text-trail-dark mb-2">
              ログインが必要です
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              マイページを見るにはログインしてください。
              まだアカウントをお持ちでない方は、無料で登録できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-trail-primary to-trail-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 bg-white text-trail-primary rounded-xl font-bold border-2 border-trail-primary hover:bg-trail-primary/5 transition-all"
              >
                無料で登録
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Profile content (blurred when not authenticated) */}
      <div className={!isAuthenticated ? 'filter blur-sm pointer-events-none select-none' : ''}>
        {/* Level display */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Level circle */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-trail-primary to-trail-secondary flex items-center justify-center shadow-xl">
                <div className="text-center text-white">
                  <div className="text-xs font-medium opacity-80">Lv</div>
                  <div className="text-4xl font-black leading-none">
                    {profile.level}
                  </div>
                </div>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full border-4 border-trail-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
            </div>

            {/* Level info */}
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-gray-400 mb-1">称号</div>
              <div className="text-2xl font-black text-trail-dark mb-1">
                {title}
              </div>
              <div className="text-sm text-gray-500 mb-3">
                {profile.name} / {profile.grade}
              </div>
              <XpProgressBar
                current={profile.xp}
                min={profile.xpForCurrentLevel}
                max={profile.xpForNextLevel}
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center">
            <div className="stat-number">{profile.totalPlays}</div>
            <div className="text-xs text-gray-400 mt-1">総プレイ回数</div>
          </div>
          <div className="card text-center">
            <div className="stat-number">
              {totalPlayHours}
              <span className="text-base">h</span>
              {totalPlayMinutes}
              <span className="text-base">m</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">総プレイ時間</div>
          </div>
          <div className="card text-center">
            <div className="stat-number">
              {profile.averageScore}
              <span className="text-base">%</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">平均スコア</div>
          </div>
        </div>

        {/* Skill charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Subject skills */}
          <div className="card">
            <h3 className="text-sm font-bold text-gray-500 mb-4 text-center">
              教科別スキル
            </h3>
            <QuadRadarChart
              skills={[
                profile.subjectSkills.理科,
                profile.subjectSkills.算数,
                profile.subjectSkills.社会,
                profile.subjectSkills.美術,
              ]}
              labels={['理科', '算数', '社会', '美術']}
            />
            <div className="flex justify-center gap-4 mt-4">
              {Object.entries(profile.subjectSkills).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="text-sm font-black text-trail-secondary">
                    {val}
                  </div>
                  <div className="text-xs text-gray-400">{key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Core skills */}
          <div className="card">
            <h3 className="text-sm font-bold text-gray-500 mb-4 text-center">
              三大スキル
            </h3>
            <TripleRadarChart
              skills={[
                profile.coreSkills.思考力,
                profile.coreSkills.探究力,
                profile.coreSkills.創造力,
              ]}
              labels={['思考力', '探究力', '創造力']}
            />
            <div className="flex justify-center gap-6 mt-4">
              {Object.entries(profile.coreSkills).map(([key, val]) => (
                <div key={key} className="text-center">
                  <div className="text-sm font-black text-trail-primary">
                    {val}
                  </div>
                  <div className="text-xs text-gray-400">{key}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent play history */}
        <div className="card mb-6">
          <h3 className="text-sm font-bold text-gray-500 mb-4">
            最近のプレイ履歴
          </h3>
          <div className="space-y-3">
            {profile.recentPlays.map((play) => {
              const percent =
                play.maxScore > 0
                  ? Math.round((play.score / play.maxScore) * 100)
                  : 0;
              return (
                <div
                  key={play.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span
                    className={`badge text-xs ${getCategoryColor(play.category)}`}
                  >
                    {play.category}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-trail-dark text-sm truncate">
                      {play.gameTitle}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatRelativeTime(play.playedAt)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-trail-primary">
                      {percent}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {play.score}/{play.maxScore}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievement badges */}
        <div className="card">
          <h3 className="text-sm font-bold text-gray-500 mb-4">
            &#127942; アチーブメント
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.achievements.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                  badge.unlocked
                    ? 'bg-trail-primary/5 border-trail-primary/20'
                    : 'bg-gray-50 border-gray-100 opacity-40'
                }`}
              >
                <span
                  className="text-3xl mb-2"
                  dangerouslySetInnerHTML={{ __html: badge.emoji }}
                />
                <span
                  className={`text-xs font-medium text-center ${
                    badge.unlocked ? 'text-trail-dark' : 'text-gray-400'
                  }`}
                >
                  {badge.name}
                </span>
                {!badge.unlocked && (
                  <span className="text-[10px] text-gray-400 mt-1">未達成</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
