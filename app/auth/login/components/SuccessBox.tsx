const SuccessBox = ({
  icon,
  color,
  title,
  desc,
  onAction,
}: {
  icon: string;
  color: string;
  title: string;
  desc: string;
  onAction: () => void;
}) => (
  <div className="flex flex-col items-center px-4 py-10 text-center">
    <div
      className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
      style={{ backgroundColor: color + "1a", color }}
    >
      <i className={"bi bi-" + icon} />
    </div>
    <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-600">{desc}</p>
    <button
      className="mt-8 w-full max-w-xs rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
      style={{ backgroundColor: color }}
      onClick={onAction}
    >
      Go to Sign In
    </button>
  </div>
);

export default SuccessBox;
