"use client";
import React, { useState } from "react";
import { useNotificationsContext } from "@/providers/NotificationsProvider";
import useNotifications, {
  type NotificationApiItem,
} from "@/services/useNotifications";
import { formatDistanceToNow, parse, isValid } from "date-fns";
import { X, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Button from "@/ui/Button";

const parseCreatedDate = (value: string) => {
  // Backend sends dates like "12 May 2026 05:46:25 pm"
  const parsed = parse(value, "dd MMM yyyy hh:mm:ss a", new Date());
  return isValid(parsed) ? parsed : new Date(value);
};

const NotificationsPanel: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const {
    notifications: realTime,
    unreadRealCount,
    decrementUnreadCount,
    resetUnreadCount,
    setNotifications,
  } = useNotificationsContext();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [page, setPage] = useState(0);
  const size = 10;

  const {
    data,
    mark,
    markAll,
    isLoading,
    unreadCount,
    refetchCount,
    refetchNotifications,
  } = useNotifications({ page, size });

  const effectiveCount = unreadRealCount > 0 ? unreadRealCount : unreadCount;

  const apiNotifications = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const totalItems = data?.totalItems || 0;

  const mergedNotifications = React.useMemo(() => {
    const real = realTime || [];
    const seen = new Set<number>(real.map((r) => r.id));
    const remaining: NotificationApiItem[] = apiNotifications.filter(
      (a) => !seen.has(a.id),
    );
    let merged: NotificationApiItem[] = [...real, ...remaining];

    if (filter === "UNREAD") merged = merged.filter((m) => !m.isRead);
    if (filter === "READ") merged = merged.filter((m) => m.isRead);

    return merged;
  }, [realTime, apiNotifications, filter]);

  const markAsRead = (id: number) => {
    mark.mutate(id, {
      onSuccess: () => {
        setNotifications(
          realTime.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
        decrementUnreadCount(1);
        refetchCount();
        refetchNotifications();
      },
    });
  };

  const handleMarkAllRead = () => {
    markAll.mutate(undefined, {
      onSuccess: () => {
        setNotifications(realTime.map((n) => ({ ...n, isRead: true })));
        resetUnreadCount();
        refetchCount();
        refetchNotifications();
      },
    });
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <div className="absolute right-0 mt-2 w-120 max-w-[calc(100vw-1rem)] bg-white shadow-2xl rounded-2xl overflow-hidden z-1100 border border-sky-100">
          <div className="absolute -top-3 right-3 w-4 h-4 bg-white rotate-45 shadow-sm rounded-xs border-t border-l border-sky-100" />
          <div className="flex items-center justify-between px-5 py-4 border-b border-sky-100">
            <div className="flex items-center gap-3">
              <h4 className="text-base font-semibold text-slate-900">
                Notifications
              </h4>
              <span className="text-sm text-slate-500">
                {effectiveCount} unread
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllRead();
                }}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                Mark all read
              </Button>
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
                className="p-1.5 rounded-full"
              >
                <X className="w-4 h-4 text-slate-500" />
              </Button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 px-5 py-3 border-b border-sky-100">
            {(["ALL", "UNREAD", "READ"] as const).map((f) => (
              <Button
                key={f}
                variant="none"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilter(f);
                  setPage(0);
                }}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  filter === f
                    ? "bg-sky-500 text-white"
                    : "bg-sky-50 text-slate-600 hover:bg-sky-100"
                }`}
              >
                {f === "ALL" ? "All" : f === "UNREAD" ? "Unread" : "Read"}
              </Button>
            ))}
          </div>

          <div className="max-h-90 overflow-auto">
            {isLoading ? (
              <div className="flex p-6 justify-center align-middle text-center">
                <Loader2 className="animate-spin text-sky-500 mb-3" size={24} />
              </div>
            ) : mergedNotifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No notifications
              </div>
            ) : (
              mergedNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-center gap-4 px-5 py-4 border-b border-sky-50 last:border-0 transition-colors ${
                    !n.isRead
                      ? "bg-sky-50 hover:bg-sky-100"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="shrink-0 flex items-center justify-center">
                    <div
                      className={`rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold ${
                        !n.isRead
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {n.title?.charAt(0)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${
                            !n.isRead ? "text-slate-900" : "text-slate-600"
                          }`}
                        >
                          {n.title}
                        </div>
                        <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {n.message}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-xs text-slate-400">
                          {formatDistanceToNow(
                            parseCreatedDate(n.createdDate),
                            {
                              addSuffix: true,
                            },
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!n.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(n.id);
                              }}
                              className="p-1 rounded hover:bg-sky-100"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-emerald-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {n.redirectUrl && (
                      <div className="mt-3">
                        <Link
                          href={n.redirectUrl}
                          className="text-sm text-sky-600 hover:underline"
                          onClick={onClose}
                        >
                          View details →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-sky-100">
              <div className="text-sm text-slate-600">
                Showing {page * size + 1}-
                {Math.min((page + 1) * size, totalItems)} of {totalItems}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage((p) => Math.max(0, p - 1));
                  }}
                  disabled={page === 0}
                  className="p-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-600 px-2 py-1">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage((p) => Math.min(totalPages - 1, p + 1));
                  }}
                  disabled={page >= totalPages - 1}
                  className="p-1.5"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationsPanel;
