"use client";

import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import Switch from "@/ui/Switch";
import type { SectionPage } from "../types/developerSettings.types";

const PageRow = ({
  page,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onToggleStatus,
  isTogglingStatus,
  onEdit,
  onDelete,
}: {
  page: SectionPage;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleStatus: () => void;
  isTogglingStatus: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-100 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex shrink-0 flex-col">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="flex h-4 w-4 items-center justify-center text-slate-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="flex h-4 w-4 items-center justify-center text-slate-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {page.pageName}
          </p>
          <p className="truncate text-xs text-slate-400">{page.pageUrl}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {page.roles.map((role) => (
            <span
              key={role}
              className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Switch
          checked={page.status}
          onChange={onToggleStatus}
          disabled={isTogglingStatus}
        />
        <button
          onClick={onEdit}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 hover:text-sky-600 cursor-pointer"
          aria-label="Edit page"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
          aria-label="Delete page"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default PageRow;
