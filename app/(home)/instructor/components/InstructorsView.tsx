"use client";

import { useState } from "react";
import useSidebar from "@/utils/useSidebar";
import { useInstructors } from "../hooks/useInstructors";
import StatCards from "./StatCards";
import FilterBar from "./FilterBar";
import InstructorTable from "./InstructorTable";
import AddInstructor from "./AddInstructor";
import EditInstructor from "./EditInstructor";
import AssignCourseModal from "./AssignCourseModal";
import type { Instructor } from "../types/instructor.types";

const InstructorsView = () => {
  const { data: sidebarData } = useSidebar();
  const role = sidebarData?.data.role;
  const canManage = role === "ADMIN" || role === "ORGANIZATION";

  const [addOpen, setAddOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null,
  );
  const [assigningInstructor, setAssigningInstructor] =
    useState<Instructor | null>(null);

  const {
    instructors,
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
    degreeFilter,
    setDegreeFilter,
    genderFilter,
    setGenderFilter,
    degreeOptions,
    resetFilters,
    toggleStatus,
    isTogglingStatus,
  } = useInstructors();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <StatCards
          total={totalItems}
          active={activeOnPage}
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
          degree={degreeFilter}
          onDegreeChange={setDegreeFilter}
          degreeOptions={degreeOptions}
          gender={genderFilter}
          onGenderChange={setGenderFilter}
          onReset={resetFilters}
        />
      </div>

      <div className="min-h-0 flex-1">
        <InstructorTable
          instructors={instructors}
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
          onEdit={setEditingInstructor}
          onAssignCourse={setAssigningInstructor}
          onToggleStatus={toggleStatus}
          isTogglingStatus={isTogglingStatus}
          canManage={canManage}
        />
      </div>

      <AddInstructor open={addOpen} onClose={() => setAddOpen(false)} />
      <EditInstructor
        instructor={editingInstructor}
        onClose={() => setEditingInstructor(null)}
      />
      <AssignCourseModal
        instructor={assigningInstructor}
        onClose={() => setAssigningInstructor(null)}
      />
    </div>
  );
};

export default InstructorsView;
