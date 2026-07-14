"use client";

import { useState } from "react";
import useSidebar from "@/utils/useSidebar";
import { useGroups } from "../hooks/useGroups";
import StatCards from "./StatCards";
import FilterBar from "./FilterBar";
import GroupTable from "./GroupTable";
import AddGroupDialog from "./AddGroupDialog";
import EditGroupDialog from "./EditGroupDialog";
import AssignCourseToGroupModal from "./AssignCourseToGroupModal";
import AssignUserToGroupModal from "./AssignUserToGroupModal";
import ViewGroupUsersModal from "./ViewGroupUsersModal";
import type { Group } from "../types/group.types";

const GroupsView = () => {
  const { data: sidebarData } = useSidebar();
  const role = sidebarData?.data.role;
  const canManage = role === "ADMIN" || role === "ORGANIZATION";

  const {
    groups,
    totalItems,
    activeCount,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusOptions,
    resetFilters,
    toggleStatus,
    isTogglingStatus,
    isAdmin,
    orgId,
  } = useGroups();

  const [addOpen, setAddOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [assignCourseGroup, setAssignCourseGroup] = useState<Group | null>(
    null,
  );
  const [assignUserGroup, setAssignUserGroup] = useState<Group | null>(null);
  const [viewUsersGroup, setViewUsersGroup] = useState<Group | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <StatCards
          total={totalItems}
          active={activeCount}
          canAdd={canManage}
          onAddClick={() => setAddOpen(true)}
        />
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
        <GroupTable
          groups={groups || []}
          isLoading={isLoading}
          showOrgColumn={isAdmin && !orgId}
          onEdit={setEditingGroup}
          onAssignCourse={setAssignCourseGroup}
          onAssignUser={setAssignUserGroup}
          onViewUsers={setViewUsersGroup}
          onToggleStatus={toggleStatus}
          isTogglingStatus={isTogglingStatus}
        />
      </div>

      <AddGroupDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <EditGroupDialog
        group={editingGroup}
        onClose={() => setEditingGroup(null)}
      />
      <AssignCourseToGroupModal
        group={assignCourseGroup}
        onClose={() => setAssignCourseGroup(null)}
      />
      <AssignUserToGroupModal
        group={assignUserGroup}
        onClose={() => setAssignUserGroup(null)}
      />
      <ViewGroupUsersModal
        group={viewUsersGroup}
        onClose={() => setViewUsersGroup(null)}
      />
    </div>
  );
};

export default GroupsView;
