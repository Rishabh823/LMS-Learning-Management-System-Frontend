const UsageBar = ({
  label,
  used,
  limit,
}: {
  label: string;
  used: number | null;
  limit: number | null;
}) => {
  const unlimited = limit == null;
  const pct =
    !unlimited && used != null
      ? Math.min(100, Math.round((used / Math.max(limit, 1)) * 100))
      : 0;
  const isNearLimit = pct >= 90;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="text-slate-400">
          {used != null ? used.toLocaleString("en-IN") : "—"} /{" "}
          {unlimited ? "Unlimited" : limit.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        {!unlimited && used != null && (
          <div
            className={`h-full rounded-full transition-all ${
              isNearLimit ? "bg-red-500" : "bg-sky-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default UsageBar;
