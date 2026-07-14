import type { LucideIcon } from "lucide-react";

const MiniStatCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  rows,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  rows: { label: string; value: number | string }[];
}) => (
  <div className="rounded-md border border-slate-100 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center gap-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon size={15} className={iconColor} />
      </div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
    </div>
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="text-sm text-slate-500">{row.label}</span>
          <span className="text-sm font-semibold text-slate-900">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default MiniStatCard;
