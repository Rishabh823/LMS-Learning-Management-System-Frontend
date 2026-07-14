"use client";

import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { useAuthToken } from "@/utils/useAuthToken";
import { USERDETAILS, USERSTATUS } from "../api/user.api";
import type { UserDetailResponse } from "../types/user.types";

export const useUserDetail = (userId: string | null) => {
  // Reactive to the "auth-token-changed" event dispatched on logout — see
  // useProfilePic.ts for why `userId` alone isn't a reliable enough gate.
  const token = useAuthToken();

  const { data, isLoading, refetch } = useApiQuery<UserDetailResponse>({
    endpoint: userId ? USERDETAILS(userId) : "",
    method: "GET",
    queryKey: ["user-details", userId],
    enabled: !!userId && !!token,
  });

  const user = data?.data ?? null;

  const { mutate: statusMutate, isPending: isTogglingStatus } = useApiMutation({
    queryKey: [["users"], ["user-details"]],
  });

  const toggleStatus = () => {
    if (!user) return;
    const nextStatus = !user.status;
    statusMutate(
      { method: "put", endpoint: USERSTATUS(user.userId, nextStatus) },
      {
        onSuccess: () => {
          successMsg(
            nextStatus
              ? "User activated successfully."
              : "User deactivated successfully.",
          );
        },
      },
    );
  };

  return {
    user,
    isLoading,
    refetch,
    toggleStatus,
    isTogglingStatus,
  };
};
