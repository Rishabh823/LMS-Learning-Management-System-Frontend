"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Pencil,
  BookOpen,
  UserPlus,
  Power,
  Users,
} from "lucide-react";

const ActionsMenu = ({
  isActive,
  onEdit,
  onAssignCourse,
  onAssignUser,
  onViewUsers,
  onToggleStatus,
  disabled,
}: {
  isActive: boolean;
  onEdit: () => void;
  onAssignCourse: () => void;
  onAssignUser: () => void;
  onViewUsers: () => void;
  onToggleStatus: () => void;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 cursor-pointer"
        aria-label="Row actions"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 z-100 mt-1 w-48 rounded-lg border border-slate-100 bg-white shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <Pencil size={14} /> Edit Group
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onAssignCourse();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <BookOpen size={14} /> Assign Course
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onAssignUser();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <UserPlus size={14} /> Assign User
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onViewUsers();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <Users size={14} /> View Assigned Users
          </button>
          <button
            disabled={disabled}
            onClick={() => {
              setOpen(false);
              onToggleStatus();
            }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
              isActive ? "text-red-600" : "text-emerald-600"
            }`}
          >
            <Power size={14} /> {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;
