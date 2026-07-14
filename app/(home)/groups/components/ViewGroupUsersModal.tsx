"use client";

import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import Dialog from "@/ui/Dialog";
import Loader from "@/ui/Loader";
import { useGroupUsers } from "../hooks/useGroupUsers";
import type { Group } from "../types/group.types";

const ViewGroupUsersModal = ({
  group,
  onClose,
}: {
  group: Group | null;
  onClose: () => void;
}) => {
  const { users, totalItems, totalPages, isLoading, page, setPage } =
    useGroupUsers(group);

  return (
    <Dialog
      open={!!group}
      onClose={onClose}
      title={`Assigned Users${group ? ` — ${group.groupName}` : ""}`}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-500">
          {totalItems} user{totalItems === 1 ? "" : "s"} assigned to this
          group
        </p>

        <div className="flex min-h-[160px] flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center py-8">
              <Loader />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-slate-400">
              <Users size={28} />
              <p className="text-sm">No users assigned to this group yet</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.userId}
                className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">
                  {user.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </p>
                  {user.emailId && (
                    <p className="truncate text-xs text-slate-400">
                      {user.emailId}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-600 text-sm font-semibold text-white">
              {page + 1}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page + 1 >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ViewGroupUsersModal;
