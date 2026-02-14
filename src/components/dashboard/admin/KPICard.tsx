"use client";

import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: "up" | "down" | "flat";
  trendValue?: string;
  subtitle?: string;
  color?: "blue" | "purple" | "amber" | "green" | "red" | "slate";
  icon?: string;
}

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  blue: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  purple: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  green: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
  slate: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
  },
};

const trendArrow: Record<string, { icon: string; color: string }> = {
  up: { icon: "\u2191", color: "text-emerald-600" },
  down: { icon: "\u2193", color: "text-red-500" },
  flat: { icon: "\u2192", color: "text-slate-400" },
};

export default function KPICard({
  title,
  value,
  trend,
  trendValue,
  subtitle,
  color = "blue",
  icon,
}: KPICardProps) {
  const colors = colorMap[color] || colorMap.blue;
  const trendInfo = trend ? trendArrow[trend] : null;

  return (
    <div
      className={`rounded-xl border ${colors.border} ${colors.bg} p-5 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`text-2xl sm:text-3xl font-bold ${colors.text}`}>
              {value}
            </span>
            {trendInfo && trendValue && (
              <span
                className={`inline-flex items-center gap-0.5 text-sm font-semibold ${trendInfo.color}`}
              >
                <span className="text-base">{trendInfo.icon}</span>
                {trendValue}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>
          )}
        </div>
        {icon && (
          <span className="text-2xl ml-2 flex-shrink-0" role="img">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
