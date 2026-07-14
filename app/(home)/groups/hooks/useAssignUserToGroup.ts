"use client";

import { useEffect, useMemo, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { successMsg } from "@/utils/notify";
import { ASSIGNGROUPTOUSER, USERSBYORG } from "../api/group.api";
import type { Group, GroupUser } from "../types/group.types";

export const useAssignUserToGroup = (
  group: Group | null,
  onSuccess: () => void,
) => {
  const { orgId } = useSelectedOrg();
  const [userId, setUserId] = useState<string | number>("");

  useEffect(() => {
    setUserId("");
  }, [group]);

  // The group carries its own organizationId (admins can view groups across
  // orgs); fall back to the currently selected org for an organization user.
  const scopedOrgId = group?.organizationId ?? orgId;

  const { data, isLoading: usersLoading } = useApiQuery<any>({
    endpoint: scopedOrgId ? USERSBYORG(scopedOrgId) : "",
    method: "GET",
    queryKey: ["users-by-org", scopedOrgId],
    enabled: !!group && !!scopedOrgId,
  });

  const userOptions = useMemo(() => {
    const list: GroupUser[] = Array.isArray(data) ? data : data?.data || [];
    return list.map((user) => ({
      value: user.userId,
      label: user.emailId ? `${user.name} (${user.emailId})` : user.name,
    }));
  }, [data]);

  const { mutate, isPending } = useApiMutation({ queryKey: ["groups"] });

  const submit = () => {
    if (!group || !userId) return;

    mutate(
      {
        method: "put",
        endpoint: ASSIGNGROUPTOUSER(),
        body: { userId, groupId: group.groupId },
      },
      {
        onSuccess: () => {
          successMsg("User assigned to group successfully.");
          onSuccess();
        },
      },
    );
  };

  return { userId, setUserId, userOptions, usersLoading, submit, isPending };
};
