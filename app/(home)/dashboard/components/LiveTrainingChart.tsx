"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { OrgLiveTrainingsCountData } from "../types/dashboard.types";
import Link from "next/link";

const BAR_COLORS = ["#94a3b8", "#94a3b8", "#f59e0b", "#2563eb"];

const LiveTrainingChart = ({
  liveTrainings,
}: {
  liveTrainings?: OrgLiveTrainingsCountData;
}) => {
  const data = [
    { stage: "Planned", value: liveTrainings?.plannedTrainings ?? 0 },
    { stage: "In Progress", value: liveTrainings?.inProgressTrainings ?? 0 },
    { stage: "Completed", value: liveTrainings?.completedTrainings ?? 0 },
    { stage: "Total", value: liveTrainings?.totalTrainings ?? 0 },
  ];

  return (
    <div className="rounded-md border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">
          Live Training Status
        </p>
        <Link
          href="/courses"
          className="rounded-lg border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
        >
          View Details
        </Link>
      </div>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                borderRadius: 8,
                borderColor: "#e2e8f0",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveTrainingChart;
