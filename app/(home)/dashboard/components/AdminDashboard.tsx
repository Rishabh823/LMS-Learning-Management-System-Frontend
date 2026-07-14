"use client";

import {
  Building2,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Users,
  Video,
  FileText,
  Plus,
} from "lucide-react";
import Button from "@/ui/Button";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import StatCard from "./StatCard";
import MiniStatCard from "./MiniStatCard";
import EmptyStateCard from "./EmptyStateCard";
import CourseStatusChart from "./CourseStatusChart";
import ExamStatusChart from "./ExamStatusChart";
import LiveTrainingChart from "./LiveTrainingChart";
import GroupsOverviewChart from "./GroupsOverviewChart";
import Link from "next/link";

const AdminDashboard = ({ role }: { role: string }) => {
  const {
    stats,
    courses,
    notStartedCourses,
    exams,
    liveTrainings,
    groups,
    students,
    trainers,
    quizzes,
  } = useAdminDashboard(role);

  const isAdmin = role === "ADMIN";

  const statCards = [
    isAdmin && {
      key: "orgs",
      icon: Building2,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      strokeColor: "#a855f7",
      label: "Total Organizations",
      value: stats.totalOrganizations,
      sparkline: 0,
    },
    {
      key: "courses",
      icon: BookOpen,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      strokeColor: "#2563eb",
      label: "Total Courses",
      value: stats.totalCourses,
      sparkline: 1,
    },
    {
      key: "exams",
      icon: ClipboardCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      strokeColor: "#10b981",
      label: "Total Exams",
      value: stats.totalExams,
      sparkline: 2,
    },
    isAdmin && {
      key: "trainers",
      icon: GraduationCap,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      strokeColor: "#f59e0b",
      label: "Total Trainers",
      value: stats.totalTrainers,
      sparkline: 0,
    },
    isAdmin && {
      key: "users",
      icon: Users,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
      strokeColor: "#0ea5e9",
      label: "Total Users",
      value: stats.totalUsers,
      sparkline: 1,
    },
    {
      key: "live-trainings",
      icon: Video,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      strokeColor: "#f43f5e",
      label: "Live Trainings",
      value: stats.totalLiveTrainings,
      sparkline: 2,
    },
    {
      key: "external-exams",
      icon: FileText,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      strokeColor: "#8b5cf6",
      label: "External Exams",
      value: "—",
      sparkline: 0,
    },
  ].filter(Boolean) as {
    key: string;
    icon: typeof Building2;
    iconBg: string;
    iconColor: string;
    strokeColor: string;
    label: string;
    value: string | number;
    sparkline: number;
  }[];

  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {statCards.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
            strokeColor={card.strokeColor}
            label={card.label}
            value={card.value}
            sparkline={card.sparkline}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CourseStatusChart courses={courses} notStarted={notStartedCourses} />
        <ExamStatusChart exams={exams} />
        <LiveTrainingChart liveTrainings={liveTrainings} />
      </div>

      {/* Mini stats + recently added */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStatCard
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          title="Students"
          rows={[
            { label: "Active Students", value: students?.activeStudents ?? 0 },
            {
              label: "Inactive Students",
              value: students?.inactiveStudents ?? 0,
            },
          ]}
        />
        <MiniStatCard
          icon={FileText}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          title="Quizzes"
          rows={[
            { label: "Total Quizzes", value: quizzes?.totalQuizzes ?? 0 },
            {
              label: "Total Submissions",
              value: quizzes?.totalSubmissions ?? 0,
            },
          ]}
        />
        <MiniStatCard
          icon={GraduationCap}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          title="Trainers"
          rows={[
            { label: "Active Trainers", value: trainers?.activeTrainers ?? 0 },
            {
              label: "Inactive Trainers",
              value: trainers?.inactiveTrainers ?? 0,
            },
          ]}
        />
        <EmptyStateCard
          title="Recently Added"
          message="No recent activity feed is available yet."
        />
      </div>

      {/* Groups + external exams */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <GroupsOverviewChart groups={groups} />
        </div>
        <EmptyStateCard
          title="External Exam Analytics"
          message="No external exams are added."
          action={
            <Link
              href="/external-exams"
              className="mt-1 flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <Plus size={14} /> Create External Exam
            </Link>
          }
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
