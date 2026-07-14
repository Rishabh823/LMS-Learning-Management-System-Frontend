"use client";

import { useMemo, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { ALLUSERONLY, ALLUSERORGWISE } from "../api/user.api";
import type { UsersListResponse } from "../types/user.types";

const STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export const useUsers = () => {
  const { orgId, isAdmin } = useSelectedOrg();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const endpoint =
    isAdmin && orgId
      ? ALLUSERORGWISE(orgId, page, pageSize)
      : ALLUSERONLY(page, pageSize);

  const { data, isLoading, refetch } = useApiQuery<UsersListResponse>({
    endpoint,
    method: "GET",
    queryKey: ["users", isAdmin ? orgId : "org", page, pageSize],
  });

  const allUsers = data?.data || [];

  const users = useMemo(() => {
    return allUsers.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          u.name?.toLowerCase().includes(q) ||
          u.emailId?.toLowerCase().includes(q) ||
          u.contactNo?.includes(q);
        if (!matches) return false;
      }
      if (statusFilter && String(u.status) !== statusFilter) return false;
      if (genderFilter && u.gender !== genderFilter) return false;
      return true;
    });
  }, [allUsers, search, statusFilter, genderFilter]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setGenderFilter("");
  };

  return {
    users,
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    activeOnPage: allUsers.filter((u) => u.status).length,
    isLoading,
    refetch,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusOptions: STATUS_OPTIONS,
    genderFilter,
    setGenderFilter,
    genderOptions: GENDER_OPTIONS,
    resetFilters,
  };
};
