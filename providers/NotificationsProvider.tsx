"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";
import apiClient from "@/services/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import useSidebar from "@/utils/useSidebar";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  redirectUrl?: string;
  createdDate: string;
  isRead: boolean;
};

type NotificationsContextType = {
  notifications: NotificationItem[];
  unreadRealCount: number;
  pushNotification: (n: NotificationItem) => void;
  setNotifications: (n: NotificationItem[]) => void;
  setUnreadRealCount: (n: number) => void;
  decrementUnreadCount: (by?: number) => void;
  resetUnreadCount: () => void;
};

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotificationsContext = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotificationsContext must be used within NotificationsProvider",
    );
  return ctx;
};

interface Props {
  children: ReactNode;
}

export default function NotificationsProvider({ children }: Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadRealCount, setUnreadRealCount] = useState<number>(0);
  const queryClient = useQueryClient();
  const { data: sidebarData } = useSidebar();
  const userEmail = sidebarData?.data?.email || "";

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token || !userEmail) return; // Don't connect if no token or email

    let stompClient: StompJs.Client | null = null;

    // activate stomp
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL + "/ws/notifications";

    try {
      // prefer native WebSocket when available
      const client = new StompJs.Client({
        brokerURL: wsUrl,
        // webSocketFactory: () => new WebSocket(wsUrl),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str: string) => {
          //   console.debug("STOMP:", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        const dest = `/user/${userEmail}/notifications`;
        client.subscribe(dest, (message: any) => {
          if (!message.body) return;
          try {
            const payload = JSON.parse(message.body);
            const item: NotificationItem = {
              id: Number(payload.id ?? payload.notificationId),
              title: payload.title,
              message: payload.message,
              type: payload.type,
              redirectUrl: payload.redirectUrl ?? payload.actionUrl,
              createdDate:
                payload.createdDate ??
                payload.createdAt ??
                new Date().toISOString(),
              isRead: false,
            };
            // push into local state and invalidate queries
            setNotifications((prev) => [item, ...prev]);
            setUnreadRealCount((c) => c + 1);
          } catch (e) {
            // ignore parse errors
          }
        });
      };

      client.onStompError = (frame: any) => {
        // console.error("Broker error", frame);
      };

      client.activate();
      stompClient = client;
    } catch (e) {
      // fallback to SockJS
      try {
        const sock = new SockJS(
          process.env.NEXT_PUBLIC_WS_URL + "/ws/notifications",
        );
        const client = new StompJs.Client({
          webSocketFactory: () => sock as any,
          connectHeaders: { Authorization: `Bearer ${token}` },
          reconnectDelay: 5000,
        });
        client.onConnect = () => {
          const dest = `/user/${userEmail}/notifications`;
          client.subscribe(dest, (message: any) => {
            if (!message.body) return;
            try {
              const payload = JSON.parse(message.body);
              const item: NotificationItem = {
                id: Number(payload.id ?? payload.notificationId),
                title: payload.title,
                message: payload.message,
                type: payload.type,
                redirectUrl: payload.redirectUrl ?? payload.actionUrl,
                createdDate:
                  payload.createdDate ??
                  payload.createdAt ??
                  new Date().toISOString(),
                isRead: false,
              };
              setNotifications((prev) => [item, ...prev]);
              setUnreadRealCount((c) => c + 1);
            } catch (e) {}
          });
        };
        client.activate();
        stompClient = client;
      } catch (err) {
        // give up
      }
    }

    return () => {
      try {
        if (stompClient) stompClient.deactivate();
      } catch (e) {}
    };
  }, [queryClient, userEmail]);

  const pushNotification = (n: NotificationItem) => {
    setNotifications((prev) => [n, ...prev]);
    setUnreadRealCount((c) => c + 1);
  };

  const decrementUnreadCount = (by: number = 1) => {
    setUnreadRealCount((c) => Math.max(0, c - by));
  };

  const resetUnreadCount = () => {
    setUnreadRealCount(0);
  };

  useEffect(() => {
    // optionally load initial counts from API on mount
    const token = Cookies.get("token");
    if (!token) return;
    apiClient
      .get("/notifications/unread-count")
      .then((res: any) => {
        setUnreadRealCount(res?.data?.data?.unreadCount ?? 0);
      })
      .catch(() => {});
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadRealCount,
        pushNotification,
        setNotifications,
        setUnreadRealCount,
        decrementUnreadCount,
        resetUnreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
