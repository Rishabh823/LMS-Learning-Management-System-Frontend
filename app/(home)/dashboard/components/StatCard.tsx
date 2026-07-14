import type { LucideIcon } from "lucide-react";

const SPARKLINES = [
  "M0,22 C10,20 20,10 30,14 C40,18 50,8 60,10 C70,12 80,4 90,6 L100,2",
  "M0,10 C10,15 20,20 30,14 C40,8 50,18 60,20 C70,22 80,12 90,16 L100,10",
  "M0,18 C10,14 20,22 30,10 C40,2 50,14 60,8 C70,4 80,16 90,10 L100,6",
];

const StatCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  strokeColor,
  label,
  value,
  sparkline = 0,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  strokeColor: string;
  label: string;
  value: string | number;
  sparkline?: number;
}) => (
  <div className="flex min-w-0 flex-col rounded-md border border-slate-100 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
    <svg
      className="mt-3 h-8 w-full"
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
    >
      <path
        d={SPARKLINES[sparkline % SPARKLINES.length]}
        stroke={strokeColor}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default StatCard;
