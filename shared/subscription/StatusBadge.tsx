const STATUS_STYLES: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-600",
  ACTIVE: "bg-emerald-50 text-emerald-600",
  FAILED: "bg-red-50 text-red-600",
  CANCELLED: "bg-red-50 text-red-600",
  EXPIRED: "bg-red-50 text-red-600",
  PENDING: "bg-amber-50 text-amber-600",
  REFUNDED: "bg-slate-100 text-slate-500",
  INACTIVE: "bg-slate-100 text-slate-500",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
      STATUS_STYLES[status?.toUpperCase()] || "bg-slate-100 text-slate-500"
    }`}
  >
    {status}
  </span>
);

export default StatusBadge;
