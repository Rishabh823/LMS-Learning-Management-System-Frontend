"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { OrgGroupCount } from "../types/dashboard.types";

const GroupsOverviewChart = ({ groups }: { groups: OrgGroupCount[] }) => {
  const chartData = groups.map((g) => ({
    name: g.groupName,
    Students: g.totalStudents,
    Trainers: g.totalTrainers,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 rounded-md border border-slate-100 bg-white p-4 shadow-sm lg:grid-cols-[1fr_320px]">
      <div>
        <p className="mb-2 text-sm font-semibold text-blue-600">
          Groups Overview
        </p>
        <div className="h-64 w-full overflow-x-auto">
          <div className="h-full min-w-120">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={40}
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
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="Students"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={14}
                />
                <Bar
                  dataKey="Trainers"
                  fill="#a855f7"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={14}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-3 py-2 font-medium">Group</th>
                <th className="px-3 py-2 font-medium">Students</th>
                <th className="px-3 py-2 font-medium">Trainers</th>
              </tr>
            </thead>
            <tbody>
              {groups.slice(0, 6).map((g) => (
                <tr key={g.groupId} className="border-t border-slate-50">
                  <td className="px-3 py-2 text-slate-700">{g.groupName}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {g.totalStudents}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {g.totalTrainers}
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    No groups found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Link
          href="/groups"
          className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
        >
          View All Groups <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default GroupsOverviewChart;
