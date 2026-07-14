"use client";

import { useMemo, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { successMsg } from "@/utils/notify";
import {
  ALLORGSWITHGROUPS,
  GROUPLISTBYORG,
  GROUPSTATUS,
} from "../api/group.api";
import type {
  Group,
  GroupsListResponse,
  OrgsWithGroupsResponse,
} from "../types/group.types";

const STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export const useGroups = () => {
  const { orgId, isAdmin } = useSelectedOrg();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const endpoint = isAdmin
    ? ALLORGSWITHGROUPS()
    : orgId
      ? GROUPLISTBYORG(orgId)
      : "";
  const enabled = isAdmin ? true : !!orgId;

  const { data, isLoading, refetch } = useApiQuery<
    OrgsWithGroupsResponse | GroupsListResponse
  >({
    endpoint,
    method: "GET",
    queryKey: ["groups", isAdmin ? "all" : orgId],
    enabled,
  });

  // Admin: flatten every org's nested groups[], tagging each with its org
  // name so the table can show which organization it belongs to.
  // Organization: the response is already a flat groups list for their org.
  const allGroups: Group[] = useMemo(() => {
    if (!data) return [];
    if (isAdmin) {
      const orgs = (data as OrgsWithGroupsResponse).data || [];
      return orgs.flatMap((org) =>
        (org.groups || []).map((g) => ({
          ...g,
          organizationName: org.fullName,
        })),
      );
    }
    return (data as GroupsListResponse).data || [];
  }, [data, isAdmin]);

  // If an admin has picked a specific org from the TopNav dropdown, narrow
  // the flattened list down to just that org's groups.
  const scopedGroups = useMemo(() => {
    if (isAdmin && orgId) {
      return allGroups.filter(
        (g) => String(g.organizationId) === String(orgId),
      );
    }
    return allGroups;
  }, [allGroups, isAdmin, orgId]);

  const groups = useMemo(() => {
    return scopedGroups.filter((g) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          g.groupName?.toLowerCase().includes(q) ||
          g.groupDescription?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (statusFilter && String(g.status) !== statusFilter) return false;
      return true;
    });
  }, [scopedGroups, search, statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  const { mutate: statusMutate, isPending: isTogglingStatus } = useApiMutation({
    queryKey: ["groups"],
  });

  const toggleStatus = (group: Group) => {
    const nextStatus = !group.status;
    statusMutate(
      { method: "put", endpoint: GROUPSTATUS(group.groupId, nextStatus) },
      {
        onSuccess: () => {
          successMsg(
            nextStatus
              ? "Group activated successfully."
              : "Group deactivated successfully.",
          );
        },
      },
    );
  };

  return {
    groups,
    totalItems: scopedGroups.length,
    activeCount: scopedGroups.filter((g) => g.status).length,
    isLoading,
    refetch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    statusOptions: STATUS_OPTIONS,
    resetFilters,
    toggleStatus,
    isTogglingStatus,
    isAdmin,
    orgId,
  };
};
