"use client";

import { Users } from "lucide-react";
import { DataTable, type Column } from "@/ui/Table";
import ActionsMenu from "./ActionsMenu";
import type { Group } from "../types/group.types";

const GroupTable = ({
  groups,
  isLoading,
  showOrgColumn,
  onEdit,
  onAssignCourse,
  onAssignUser,
  onViewUsers,
  onToggleStatus,
  isTogglingStatus,
}: {
  groups: Group[];
  isLoading: boolean;
  showOrgColumn: boolean;
  onEdit: (group: Group) => void;
  onAssignCourse: (group: Group) => void;
  onAssignUser: (group: Group) => void;
  onViewUsers: (group: Group) => void;
  onToggleStatus: (group: Group) => void;
  isTogglingStatus: boolean;
}) => {
  const columns: Column<Group>[] = [
    {
      key: "groupName",
      header: "Group",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Users size={16} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {row.groupName}
            </p>
            <span className="mt-0.5 block truncate text-xs text-slate-400">
              {row.groupDescription || "—"}
            </span>
          </div>
        </div>
      ),
    },
    ...(showOrgColumn
      ? [
          {
            key: "organizationName",
            header: "Organization",
            sortable: false,
            render: (row: Group) => (
              <span className="text-slate-600">
                {row.organizationName || "—"}
              </span>
            ),
          } as Column<Group>,
        ]
      : []),
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            row.status
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              row.status ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {row.status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <ActionsMenu
          isActive={row.status}
          onEdit={() => onEdit(row)}
          onAssignCourse={() => onAssignCourse(row)}
          onAssignUser={() => onAssignUser(row)}
          onViewUsers={() => onViewUsers(row)}
          onToggleStatus={() => onToggleStatus(row)}
          disabled={isTogglingStatus}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl">
        <DataTable
          columns={columns}
          data={groups}
          loading={isLoading}
          emptyText="No groups found"
        />
      </div>

      <div className="flex shrink-0 items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
        <span>
          {groups.length} result{groups.length === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
};

export default GroupTable;
