import { Building2, BuildingIcon, UserPlus } from "lucide-react";

const StatCards = ({
  total,
  onAddClick,
}: {
  total: number;
  onAddClick?: () => void;
}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="relative overflow-hidden rounded-2xl border-l-4 border-blue-500 bg-blue-50/60 p-5">
      <Building2 className="absolute -right-2 -bottom-2 h-20 w-20 text-blue-200/60" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm">
          <BuildingIcon size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">
            Total Organizations
          </p>
          <p className="text-2xl font-bold text-blue-700">{total}</p>
        </div>
      </div>
      <p className="relative mt-2 text-xs text-slate-500">
        All registered organizations
      </p>
    </div>

    <button
      type="button"
      onClick={onAddClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-purple-50/60 p-5 text-left transition-colors hover:bg-purple-100/60"
    >
      <UserPlus className="absolute -right-2 -bottom-2 h-20 w-20 text-purple-200/60" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white shadow-sm">
          <UserPlus size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-purple-700">
            Add New Organization
          </p>
        </div>
      </div>
      <p className="relative mt-2 text-xs text-slate-500">
        Register a new organization
      </p>
    </button>
  </div>
);

export default StatCards;
