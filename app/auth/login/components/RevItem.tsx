const RevItem = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex items-center justify-between border-b border-sky-50 py-2 text-sm last:border-none">
    <span className="text-slate-500">{label}</span>
    <strong className="font-semibold text-slate-800">{value || "—"}</strong>
  </div>
);

export default RevItem;
