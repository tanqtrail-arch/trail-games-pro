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

interface SubjectValues {
  理科: number;
  社会: number;
  算数: number;
  美術: number;
}

interface SubjectChartProps {
  subjects: SubjectValues;
  previousSubjects?: SubjectValues;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { height: 220, fontSize: 11 },
  md: { height: 300, fontSize: 13 },
  lg: { height: 380, fontSize: 14 },
};

export default function SubjectChart({
  subjects,
  previousSubjects,
  size = "md",
}: SubjectChartProps) {
  const { height, fontSize } = sizeMap[size];

  const data = [
    {
      subject: "理科",
      current: subjects.理科,
      previous: previousSubjects?.理科 ?? 0,
      fullMark: 100,
    },
    {
      subject: "社会",
      current: subjects.社会,
      previous: previousSubjects?.社会 ?? 0,
      fullMark: 100,
    },
    {
      subject: "算数",
      current: subjects.算数,
      previous: previousSubjects?.算数 ?? 0,
      fullMark: 100,
    },
    {
      subject: "美術",
      current: subjects.美術,
      previous: previousSubjects?.美術 ?? 0,
      fullMark: 100,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#334155", fontSize, fontWeight: 600 }}
        />
        <PolarRadiusAxis
          angle={45}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          axisLine={false}
        />
        {previousSubjects && (
          <Radar
            name="前月"
            dataKey="previous"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        )}
        <Radar
          name="今月"
          dataKey="current"
          stroke="#DDA15E"
          fill="#DDA15E"
          fillOpacity={0.25}
          strokeWidth={2.5}
        />
        {previousSubjects && (
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            iconType="line"
          />
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
}
