"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { OrgCoursesCountData } from "../types/dashboard.types";
import Link from "next/link";

const SEGMENT_COLORS = {
  ongoing: "#2563eb",
  planned: "#10b981",
  completed: "#6366f1",
  notStarted: "#e2e8f0",
};

const CourseStatusChart = ({
  courses,
  notStarted,
}: {
  courses?: OrgCoursesCountData;
  notStarted: number;
}) => {
  const total = courses?.totalCourses ?? 0;
  const segments = [
    { key: "ongoing", label: "Ongoing", value: courses?.ongoingCourses ?? 0 },
    { key: "planned", label: "Planned", value: courses?.plannedCourses ?? 0 },
    {
      key: "completed",
      label: "Completed",
      value: courses?.completedCourses ?? 0,
    },
    { key: "notStarted", label: "Not Started", value: notStarted },
  ];

  return (
    <div className="rounded-md border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Course Status</p>
        <Link
          href="/courses"
          className="rounded-lg border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
        >
          View Details
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                nameKey="label"
                innerRadius="70%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
              >
                {segments.map((s) => (
                  <Cell
                    key={s.key}
                    fill={SEGMENT_COLORS[s.key as keyof typeof SEGMENT_COLORS]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-slate-900">{total}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {segments.map((s) => (
            <div key={s.key} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    SEGMENT_COLORS[s.key as keyof typeof SEGMENT_COLORS],
                }}
              />
              <span className="flex-1 text-slate-600">{s.label}</span>
              <span className="font-semibold text-slate-800">
                {s.value}
                {total > 0 && (
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    ({Math.round((s.value / total) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseStatusChart;
