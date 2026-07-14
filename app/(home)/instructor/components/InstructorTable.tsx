"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataTable, type Column } from "@/ui/Table";
import PercentageRing from "./PercentageRing";
import ActionsMenu from "./ActionsMenu";
import type { Instructor } from "../types/instructor.types";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const InstructorTable = ({
  instructors,
  isLoading,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onAssignCourse,
  onToggleStatus,
  isTogglingStatus,
  canManage = false,
}: {
  instructors: Instructor[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (instructor: Instructor) => void;
  onAssignCourse: (instructor: Instructor) => void;
  onToggleStatus: (instructor: Instructor) => void;
  isTogglingStatus: boolean;
  canManage?: boolean;
}) => {
  // const [selected, setSelected] = useState<Set<string>>(new Set());

  // const toggleOne = (userId: string) => {
  //   setSelected((prev) => {
  //     const next = new Set(prev);
  //     if (next.has(userId)) next.delete(userId);
  //     else next.add(userId);
  //     return next;
  //   });
  // };

  const columns: Column<Instructor>[] = [
    // {
    //   key: "select",
    //   header: "",
    //   sortable: false,
    //   render: (row) => (
    //     <input
    //       type="checkbox"
    //       checked={selected.has(row.userId)}
    //       onChange={() => toggleOne(row.userId)}
    //       className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
    //     />
    //   ),
    // },
    {
      key: "name",
      header: "Instructor",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">
            {row.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{row.name}</p>
            <span className="mt-0.5 inline-block rounded-md bg-sky-50 px-1.5 py-0.5 text-[11px] font-medium text-sky-600">
              ID: {row.userId.slice(0, 8)}
            </span>
          </div>
        </div>
      ),
    },
    { key: "emailId", header: "Email", sortable: false },
    { key: "contactNo", header: "Phone Number", sortable: false },
    {
      key: "gender",
      header: "Gender",
      sortable: false,
      render: (row) => (
        <span className="text-sky-600">{row.gender || "—"}</span>
      ),
    },
    {
      key: "degree",
      header: "Degree Name",
      sortable: false,
      render: (row) => row.usersProfile?.degreeName || "—",
    },
    {
      key: "percentage",
      header: "Percentage",
      sortable: false,
      render: (row) => (
        <PercentageRing value={Number(row.usersProfile?.percentage) || 0} />
      ),
    },
    {
      key: "passingYear",
      header: "Passing Year",
      sortable: false,
      render: (row) => row.usersProfile?.passingYear || "—",
    },
    {
      key: "experience",
      header: "Experience",
      sortable: false,
      render: (row) =>
        row.usersProfile?.totalExprience != null
          ? `${row.usersProfile.totalExprience} Years`
          : "—",
    },
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
          onToggleStatus={() => onToggleStatus(row)}
          disabled={isTogglingStatus}
          canManage={canManage}
        />
      ),
    },
  ];

  const from = totalItems === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3">
      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl">
        <DataTable
          columns={columns}
          data={instructors}
          loading={isLoading}
          emptyText="No instructors found"
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

export default InstructorTable;
