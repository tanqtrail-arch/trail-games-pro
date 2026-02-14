"use client";

import React from "react";

interface FunnelStage {
  label: string;
  value: number;
  percentage: number;
}

interface FunnelChartProps {
  stages: FunnelStage[];
}

const stageColors = [
  { bg: "bg-emerald-500", text: "text-white" },
  { bg: "bg-emerald-400", text: "text-white" },
  { bg: "bg-amber-500", text: "text-white" },
  { bg: "bg-amber-500", text: "text-white" },
];

export default function FunnelChart({ stages }: FunnelChartProps) {
  const maxValue = stages.length > 0 ? stages[0].value : 1;

  return (
    <div className="w-full space-y-2">
      {stages.map((stage, index) => {
        const widthPercent = Math.max(
          (stage.value / maxValue) * 100,
          20
        );
        const colors = stageColors[index % stageColors.length];

        return (
          <div key={stage.label} className="relative">
            {/* Connector arrow between stages */}
            {index > 0 && (
              <div className="flex justify-center -mt-1 mb-1">
                <svg
                  width="20"
                  height="12"
                  viewBox="0 0 20 12"
                  className="text-slate-300"
                >
                  <path
                    d="M10 12 L0 0 L20 0 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Funnel bar */}
              <div className="flex-1 flex justify-center">
                <div
                  className={`${colors.bg} ${colors.text} rounded-lg py-3 px-4 text-center transition-all duration-300 relative overflow-hidden`}
                  style={{ width: `${widthPercent}%` }}
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="relative z-10">
                    <div className="font-bold text-sm sm:text-base">
                      {stage.label}
                    </div>
                    <div className="text-xs sm:text-sm opacity-90">
                      {stage.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Percentage label */}
              <div className="w-16 text-right flex-shrink-0">
                {index > 0 ? (
                  <span className="text-sm font-semibold text-slate-600">
                    {stage.percentage}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">100%</span>
                )}
              </div>
            </div>

            {/* Conversion rate between stages */}
            {index < stages.length - 1 && (
              <div className="flex justify-center mt-1">
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  転換率{" "}
                  {(
                    (stages[index + 1].value / stage.value) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
