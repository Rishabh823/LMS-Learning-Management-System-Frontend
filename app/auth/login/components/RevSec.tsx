import type { ReactNode } from "react";

const RevSec = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-lg border border-sky-100 bg-sky-50/40 p-4">
    <h4 className="mb-2 text-sm font-semibold text-sky-700">{title}</h4>
    <div>{children}</div>
  </div>
);

export default RevSec;
