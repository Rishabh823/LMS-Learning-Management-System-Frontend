"use client";

import { useMemo, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { successMsg } from "@/utils/notify";
import { TRAINERORG, TRAINER, UPDATEUSERSTATUS } from "../api/instructor.api";
import type {
  Instructor,
  TrainersListResponse,
} from "../types/instructor.types";

export const useInstructors = () => {
  const { orgId, isAdmin } = useSelectedOrg();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const endpoint =
    isAdmin && orgId
      ? TRAINERORG(orgId, page, pageSize)
      : TRAINER(page, pageSize);

  const { data, isLoading, refetch } = useApiQuery<TrainersListResponse>({
    endpoint,
    method: "GET",
    queryKey: ["instructors", isAdmin && orgId ? orgId : "all", page, pageSize],
  });

  const allInstructors = data?.data || [];

  const instructors = useMemo(() => {
    return allInstructors.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          t.name.toLowerCase().includes(q) ||
          t.emailId.toLowerCase().includes(q) ||
          t.contactNo.includes(q);
        if (!matches) return false;
      }
      if (statusFilter && String(t.status) !== statusFilter) return false;
      if (degreeFilter && t.usersProfile?.degreeName !== degreeFilter)
        return false;
      if (genderFilter && t.gender !== genderFilter) return false;
      return true;
    });
  }, [allInstructors, search, statusFilter, degreeFilter, genderFilter]);

  const degreeOptions = useMemo(() => {
    const unique = Array.from(
      new Set(
        allInstructors.map((t) => t.usersProfile?.degreeName).filter(Boolean),
      ),
    );
    return unique.map((d) => ({ value: d as string, label: d as string }));
  }, [allInstructors]);

  const { mutate: toggleStatusMutate, isPending: isTogglingStatus } =
    useApiMutation();

  const toggleStatus = (instructor: Instructor) => {
    const nextStatus = !instructor.status;
    toggleStatusMutate(
      {
        method: "put",
        endpoint: UPDATEUSERSTATUS(instructor.userId, nextStatus),
      },
      {
        onSuccess: () => {
          successMsg(
            nextStatus
              ? "Instructor activated successfully."
              : "Instructor deactivated successfully.",
          );
          refetch();
        },
      },
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setDegreeFilter("");
    setGenderFilter("");
  };

  return {
    instructors,
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    activeOnPage: allInstructors.filter((t) => t.status).length,
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
  };
};
