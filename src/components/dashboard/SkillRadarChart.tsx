"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SkillValues {
  思考力: number;
  探究力: number;
  創造力: number;
}

interface SkillRadarChartProps {
  skills: SkillValues;
  previousSkills?: SkillValues;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { height: 220, fontSize: 11 },
  md: { height: 300, fontSize: 13 },
  lg: { height: 380, fontSize: 14 },
};

export default function SkillRadarChart({
  skills,
  previousSkills,
  size = "md",
}: SkillRadarChartProps) {
  const { height, fontSize } = sizeMap[size];

  const data = [
    {
      skill: "思考力",
      current: skills.思考力,
      previous: previousSkills?.思考力 ?? 0,
      fullMark: 100,
    },
    {
      skill: "探究力",
      current: skills.探究力,
      previous: previousSkills?.探究力 ?? 0,
      fullMark: 100,
    },
    {
      skill: "創造力",
      current: skills.創造力,
      previous: previousSkills?.創造力 ?? 0,
      fullMark: 100,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: "#334155", fontSize, fontWeight: 600 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          axisLine={false}
        />
        {previousSkills && (
          <Radar
            name="前回"
            dataKey="previous"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        )}
        <Radar
          name="今回"
          dataKey="current"
          stroke="#40916C"
          fill="#40916C"
          fillOpacity={0.25}
          strokeWidth={2.5}
        />
        {previousSkills && (
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="line"
          />
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
}
