"use client";

import { useState } from "react";
import DailyView from "@/components/dashboard/DailyView";
import WeeklyView from "@/components/dashboard/WeeklyView";
import MonthlyView from "@/components/dashboard/MonthlyView";
import QuarterlyView from "@/components/dashboard/QuarterlyView";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                         */
/* ------------------------------------------------------------------ */

const child = {
  name: "ゆうた",
  level: 12,
  grade: "小学4年生",
  plan: "free" as "free" | "premium",
  avatar: "🧒",
};

const tabs = [
  { key: "daily", label: "デイリー" },
  { key: "weekly", label: "1週間" },
  { key: "monthly", label: "1ヶ月" },
  { key: "quarterly", label: "3ヶ月" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function ParentDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("daily");

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* ---- Header ---- */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-trail-primary to-trail-secondary flex items-center justify-center text-3xl shadow-md">
                {child.avatar}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-trail-dark">
                  保護者ダッシュボード
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-gray-600">
                    {child.name}くん
                  </span>
                  <span className="text-xs text-gray-400">
                    {child.grade}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-trail-accent/10 text-trail-accent text-xs font-bold">
                    Lv.{child.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Date display */}
            <p className="text-sm text-gray-400 font-medium">
              {new Date().toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ---- Free plan upgrade banner ---- */}
        {child.plan === "free" && (
          <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-trail-primary via-teal-500 to-trail-secondary p-5 sm:p-6 text-white shadow-lg">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white/90 mb-1">
                  現在フリープランをご利用中です
                </p>
                <p className="text-lg sm:text-xl font-black">
                  有料プランにアップグレードして詳細レポートを見る
                </p>
                <p className="text-sm text-white/70 mt-1">
                  週間・月間レポート、AI分析コメント、全国ランキングなど全機能が使えます
                </p>
              </div>
              <button className="flex-shrink-0 px-6 py-3 bg-white text-trail-primary font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all text-sm">
                月額980円でアップグレード
              </button>
            </div>
          </div>
        )}

        {/* ---- Report buttons ---- */}
        <div className="mb-6 flex flex-wrap gap-2">
          <a
            href="/reports/parent/weekly"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-trail-primary bg-white border border-trail-primary/20 rounded-lg hover:bg-trail-primary/5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            週間レポート
          </a>
          <a
            href="/reports/parent/monthly"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-trail-primary to-trail-secondary rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            月間成長レポート
          </a>
        </div>

        {/* ---- Time period tabs ---- */}
        <div className="mb-6">
          <div className="flex gap-1 p-1 bg-white rounded-xl shadow-sm border border-gray-100 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-trail-primary to-trail-secondary text-white shadow-md"
                    : "text-gray-500 hover:text-trail-primary hover:bg-trail-primary/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ---- Tab content ---- */}
        <div>
          {activeTab === "daily" && <DailyView />}
          {activeTab === "weekly" && <WeeklyView />}
          {activeTab === "monthly" && <MonthlyView />}
          {activeTab === "quarterly" && <QuarterlyView />}
        </div>
      </div>
    </div>
  );
}
