"use client";

import { useState } from "react";
import { useOrganizations } from "../hooks/useOrganizations";
import StatCards from "./StatCards";
import FilterBar from "./FilterBar";
import OrganizationTable from "./OrganizationTable";
import AddOrganization from "./AddOrganization";
import EditOrganization from "./EditOrganization";
import OrgGroupsModal from "./OrgGroupsModal";
import type { Organization } from "../types/organization.types";

const OrganizationsView = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [groupsOrganization, setGroupsOrganization] =
    useState<Organization | null>(null);

  const {
    organizations,
    totalItems,
    totalPages,
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
    resetFilters,
    toggleStatus,
    isTogglingStatus,
  } = useOrganizations();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <StatCards total={totalItems} onAddClick={() => setAddOpen(true)} />
      </div>

      <div className="shrink-0">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={statusOptions}
          onReset={resetFilters}
        />
      </div>

      <div className="min-h-0 flex-1">
        <OrganizationTable
          organizations={organizations}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(0);
          }}
          onEdit={setEditingOrganization}
          onManageGroups={setGroupsOrganization}
          onToggleStatus={toggleStatus}
          isTogglingStatus={isTogglingStatus}
        />
      </div>

      <AddOrganization open={addOpen} onClose={() => setAddOpen(false)} />
      <EditOrganization
        organization={editingOrganization}
        onClose={() => setEditingOrganization(null)}
      />
      <OrgGroupsModal
        organization={groupsOrganization}
        onClose={() => setGroupsOrganization(null)}
      />
    </div>
  );
};

export default OrganizationsView;
