import { Users, UserCheck, UserPlus } from "lucide-react";

const StatCards = ({
  total,
  active,
  onAddClick,
  canAdd = true,
}: {
  total: number;
  active: number;
  onAddClick?: () => void;
  canAdd?: boolean;
}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div className="relative overflow-hidden rounded-2xl border-l-4 border-blue-500 bg-blue-50/60 p-5">
      <Users className="absolute -right-2 -bottom-2 h-20 w-20 text-blue-200/60" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm">
          <Users size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">
            Total Instructors
          </p>
          <p className="text-2xl font-bold text-blue-700">{total}</p>
        </div>
      </div>
      <p className="relative mt-2 text-xs text-slate-500">
        All registered instructors
      </p>
    </div>

    <div className="relative overflow-hidden rounded-2xl bg-emerald-50/60 p-5">
      <UserCheck className="absolute -right-2 -bottom-2 h-20 w-20 text-emerald-200/60" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
          <UserCheck size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">
            Active Instructors
          </p>
          <p className="text-2xl font-bold text-emerald-700">{active}</p>
        </div>
      </div>
      <p className="relative mt-2 text-xs text-slate-500">
        Currently active instructors
      </p>
    </div>

    {canAdd && (
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
              Add New Instructor
            </p>
          </div>
        </div>
        <p className="relative mt-2 text-xs text-slate-500">
          Create a new instructor profile
        </p>
      </button>
    )}
  </div>
);

export default StatCards;
