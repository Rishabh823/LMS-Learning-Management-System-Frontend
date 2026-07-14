import type { ReactNode } from "react";
import { BarChart3 } from "lucide-react";

const EmptyStateCard = ({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col rounded-md border border-slate-100 bg-white p-4 shadow-sm">
    <p className="mb-4 text-sm font-semibold text-blue-600">{title}</p>
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-6 text-center">
      <BarChart3 size={32} className="text-slate-200" />
      <p className="text-sm text-slate-400">{message}</p>
      {action}
    </div>
  </div>
);

export default EmptyStateCard;
