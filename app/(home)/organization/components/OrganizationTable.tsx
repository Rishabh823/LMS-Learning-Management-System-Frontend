"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataTable, type Column } from "@/ui/Table";
import ActionsMenu from "./ActionsMenu";
import type { Organization } from "../types/organization.types";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const OrganizationTable = ({
  organizations,
  isLoading,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onManageGroups,
  onToggleStatus,
  isTogglingStatus,
}: {
  organizations: Organization[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (organization: Organization) => void;
  onManageGroups: (organization: Organization) => void;
  onToggleStatus: (organization: Organization) => void;
  isTogglingStatus: boolean;
}) => {
  const isOrgActive = (row: Organization) =>
    row.status === true || String(row.status).toUpperCase() === "ACTIVE";

  const columns: Column<Organization>[] = [
    {
      key: "fullName",
      header: "Organization",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">
            {row.fullName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {row.fullName}
            </p>
            <span className="mt-0.5 inline-block text-[11px] text-slate-400">
              Owner: {row.ownersName || "—"}
            </span>
          </div>
        </div>
      ),
    },
    { key: "emailId", header: "Email", sortable: false },
    { key: "contact", header: "Contact", sortable: false },
    {
      key: "location",
      header: "Location",
      sortable: false,
      render: (row) =>
        [row.city, row.state, row.country].filter(Boolean).join(", ") || "—",
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => {
        const isActive = isOrgActive(row);
        return row.status == null ? (
          <span className="text-slate-400">—</span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <ActionsMenu
          isActive={isOrgActive(row)}
          onEdit={() => onEdit(row)}
          onManageGroups={() => onManageGroups(row)}
          onToggleStatus={() => onToggleStatus(row)}
          disabled={isTogglingStatus}
        />
      ),
    },
  ];

  const from = totalItems === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalItems);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl">
        <DataTable
          columns={columns}
          data={organizations}
          loading={isLoading}
          emptyText="No organizations found"
        />
      </div>

      <div className="flex shrink-0 flex-col items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm sm:flex-row">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>
            Showing {from} to {to} of {totalItems} results
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-600 outline-none focus:border-sky-400"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>items per page</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-600 text-sm font-semibold text-white">
            {page + 1}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page + 1 >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationTable;
