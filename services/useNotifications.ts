"use client";
import { useApiMutation } from "@/services/useApiMutation";
import { useApiQuery } from "@/services/useApiQuery";
import { MARKASREAD, MARKALLREAD } from "@/services/endpoints";

export interface NotificationApiItem {
  id: number;
  type: string;
  title: string;
  message: string;
  email?: string;
  createdDate: string;
  redirectUrl?: string;
  isRead: boolean;
}

interface NotificationsAllResponse {
  totalItems: number;
  data: NotificationApiItem[];
  totalPages: number;
  currentPage: number;
  message: string;
  status: string;
}

interface UnreadCountResponse {
  data: { unreadCount: number };
  count: number;
  message: string;
  status: string;
}

export const useNotifications = (params: { page: number; size: number }) => {
  const { data, isLoading, refetch } = useApiQuery<NotificationsAllResponse>({
    endpoint: "/notifications/all",
    method: "GET",
    params: { page: params.page, size: params.size },
    queryKey: ["notifications-all", params.page, params.size],
  });

  const countQuery = useApiQuery<UnreadCountResponse>({
    endpoint: "/notifications/unread-count",
    method: "GET",
    queryKey: ["notifications-unread-count"],
  });

  const apiMutation = useApiMutation();

  const mark = {
    mutateAsync: async (id: number) => {
      const res = await apiMutation.mutateAsync({
        endpoint: MARKASREAD(id),
        method: "put",
      });
      refetch();
      return res;
    },
    mutate: (id: number, options?: any) =>
      apiMutation.mutate({ endpoint: MARKASREAD(id), method: "put" }, options),
  } as any;

  const markAll = {
    mutateAsync: async () => {
      const res = await apiMutation.mutateAsync({
        endpoint: MARKALLREAD(),
        method: "put",
      });
      refetch();
      return res;
    },
    mutate: (arg?: any, options?: any) =>
      apiMutation.mutate({ endpoint: MARKALLREAD(), method: "put" }, options),
  } as any;

  return {
    data,
    isLoading,
    unreadCount: countQuery.data?.data?.unreadCount ?? 0,
    mark,
    markAll,
    refetchCount: countQuery.refetch,
    refetchNotifications: refetch,
  };
};

export default useNotifications;
