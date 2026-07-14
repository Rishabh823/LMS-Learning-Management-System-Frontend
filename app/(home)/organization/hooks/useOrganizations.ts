"use client";

import { useMemo, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { ORG, ORGSTATUS } from "../api/organization.api";
import type {
  Organization,
  OrganizationsListResponse,
} from "../types/organization.types";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export const useOrganizations = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading, refetch } = useApiQuery<OrganizationsListResponse>({
    endpoint: ORG(statusFilter || undefined, page, pageSize),
    method: "GET",
    queryKey: ["organizations", statusFilter, page, pageSize],
  });

  const allOrganizations = data?.data || [];

  const organizations = useMemo(() => {
    if (!search) return allOrganizations;
    const q = search.toLowerCase();
    return allOrganizations.filter(
      (o: Organization) =>
        o.fullName?.toLowerCase().includes(q) ||
        o.emailId?.toLowerCase().includes(q) ||
        o.contact?.toLowerCase().includes(q) ||
        o.ownersName?.toLowerCase().includes(q),
    );
  }, [allOrganizations, search]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  const { mutate: toggleStatusMutate, isPending: isTogglingStatus } =
    useApiMutation({ queryKey: ["organizations"] });

  const toggleStatus = (organization: Organization) => {
    const nextStatus = !(
      organization.status === true ||
      String(organization.status).toUpperCase() === "ACTIVE"
    );
    toggleStatusMutate(
      {
        method: "put",
        endpoint: ORGSTATUS(organization.organizationId, nextStatus),
      },
      {
        onSuccess: () => {
          successMsg(
            nextStatus
              ? "Organization activated successfully."
              : "Organization deactivated successfully.",
          );
          refetch();
        },
      },
    );
  };

  return {
    organizations,
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
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
    resetFilters,
    toggleStatus,
    isTogglingStatus,
  };
};
