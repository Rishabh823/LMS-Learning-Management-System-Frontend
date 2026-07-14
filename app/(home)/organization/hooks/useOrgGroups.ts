"use client";

import { useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import {
  ORGGROUP,
  UPDATEGROUP,
  UPDATEGROUPSTATUS,
} from "../api/organization.api";
import type { Organization, OrgGroupsListResponse } from "../types/organization.types";

export const useOrgGroups = (organization: Organization | null) => {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const orgId = organization?.organizationId;

  const { data, isLoading, refetch } = useApiQuery<OrgGroupsListResponse>({
    endpoint: orgId ? ORGGROUP(orgId, page, pageSize) : "",
    method: "GET",
    queryKey: ["org-groups", orgId, page],
    enabled: !!orgId,
  });

  const groups = data?.data || [];

  const { mutate: toggleMutate, isPending: isTogglingStatus } =
    useApiMutation();

  const toggleGroupStatus = (groupId: string | number, nextStatus: boolean) => {
    toggleMutate(
      { method: "put", endpoint: UPDATEGROUPSTATUS(groupId, nextStatus) },
      {
        onSuccess: () => {
          successMsg(
            nextStatus ? "Group activated successfully." : "Group deactivated successfully.",
          );
          refetch();
        },
      },
    );
  };

  const [groupName, setGroupName] = useState("");
  const { mutate: addGroupMutate, isPending: isAddingGroup } =
    useApiMutation();

  const addGroup = () => {
    if (!orgId || !groupName.trim()) return;

    addGroupMutate(
      {
        method: "post",
        endpoint: UPDATEGROUP(),
        body: { groupName: groupName.trim(), organizationId: orgId },
      },
      {
        onSuccess: () => {
          successMsg("Group added successfully.");
          setGroupName("");
          refetch();
        },
      },
    );
  };

  return {
    groups,
    isLoading,
    page,
    setPage,
    totalPages: data?.totalPages ?? 0,
    toggleGroupStatus,
    isTogglingStatus,
    groupName,
    setGroupName,
    addGroup,
    isAddingGroup,
  };
};
