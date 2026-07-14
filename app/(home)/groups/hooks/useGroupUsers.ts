"use client";

import { useEffect, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { GROUPUSERS } from "../api/group.api";
import type { Group, GroupUsersListResponse } from "../types/group.types";

export const useGroupUsers = (group: Group | null) => {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    setPage(0);
  }, [group]);

  const { data, isLoading } = useApiQuery<GroupUsersListResponse>({
    endpoint: group ? GROUPUSERS(group.groupId, page, pageSize) : "",
    method: "GET",
    queryKey: ["group-users", group?.groupId, page],
    enabled: !!group,
  });

  return {
    users: data?.data || [],
    totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    page,
    setPage,
    pageSize,
  };
};
