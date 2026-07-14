const PercentageRing = ({ value }: { value: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
      <svg className="h-11 w-11 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          strokeWidth="3"
          fill="none"
          className="stroke-slate-100"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-sky-500 transition-all duration-500"
        />
      </svg>
      <span className="absolute text-[11px] font-semibold text-slate-700">
        {safeValue}%
      </span>
    </div>
  );
};

export default PercentageRing;
