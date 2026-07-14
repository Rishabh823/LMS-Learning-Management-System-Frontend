"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useSidebar from "@/utils/useSidebar";
import { useUsers } from "../hooks/useUsers";
import StatCards from "./StatCards";
import FilterBar from "./FilterBar";
import UsersGrid from "./UsersGrid";
import UserDetailModal from "./UserDetailModal";
import EditUserDialog from "./EditUserDialog";
import CreateUserDialog from "./CreateUserDialog";
import type { AppUser } from "../types/user.types";

const PAGE_SIZE_OPTIONS = [12, 24, 48];

const UsersView = () => {
  const { data: sidebarData } = useSidebar();
  const role = sidebarData?.data.role;
  const canManage = role === "ADMIN" || role === "ORGANIZATION";

  const {
    users,
    totalItems,
    totalPages,
    activeOnPage,
    isLoading,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusOptions,
    genderFilter,
    setGenderFilter,
    genderOptions,
    resetFilters,
  } = useUsers();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const from = totalItems === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalItems);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <StatCards
          total={totalItems}
          active={activeOnPage}
          onAddClick={() => setCreateOpen(true)}
        />
      </div>

      <div className="shrink-0">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={statusOptions}
          gender={genderFilter}
          onGenderChange={setGenderFilter}
          genderOptions={genderOptions}
          onReset={resetFilters}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <UsersGrid
          users={users}
          isLoading={isLoading}
          onSelectUser={(user: AppUser) => setSelectedUserId(user.userId)}
        />
      </div>

      <div className="flex shrink-0 flex-col items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm sm:flex-row">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>
            Showing {from} to {to} of {totalItems} results
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
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
      </div>

      <UserDetailModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onEdit={() => setEditingUserId(selectedUserId)}
        canManage={canManage}
      />
      <EditUserDialog
        userId={editingUserId}
        onClose={() => setEditingUserId(null)}
      />
      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
};

export default UsersView;
