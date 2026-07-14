import type { ReactNode } from "react";

const F = ({
  label,
  icon,
  children,
}: {
  label?: string;
  icon?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700">{label}</label>
    )}
    <div className="flex items-center gap-2 rounded-md border border-sky-200 bg-white px-3 py-2.5 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
      {icon && <i className={"bi bi-" + icon + " text-slate-400"} />}
      {children}
    </div>
  </div>
);

export default F;
