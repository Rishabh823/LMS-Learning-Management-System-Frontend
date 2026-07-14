"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationsPanel from "./NotificationsPanel";
import Button from "@/ui/Button";
import { useNotificationsContext } from "@/providers/NotificationsProvider";

const NotificationIcon: React.FC = () => {
  const { unreadRealCount } = useNotificationsContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const display = unreadRealCount > 99 ? "99+" : String(unreadRealCount);
  const badgeSizeClass =
    display.length === 1
      ? "h-4 w-4"
      : display.length === 2
        ? "h-4 w-4"
        : "h-4 w-4";
  const badgeTextClass = display.length >= 3 ? "text-[10px]" : "text-xs";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Notifications"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="relative p-2.5 rounded-full bg-white text-sky-600 transition-colors sm:flex cursor-pointer hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-100"
      >
        <Bell size={19} />
        {unreadRealCount > 0 && (
          <span
            className={`absolute top-0 right-1 inline-flex items-center justify-center ${badgeTextClass} font-semibold leading-none text-white bg-red-600 rounded-full ${badgeSizeClass}`}
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative z-10 flex items-center justify-center">
              {display}
            </span>
          </span>
        )}
      </button>
      {open && <NotificationsPanel onClose={() => setOpen(false)} />}
    </div>
  );
};

export default NotificationIcon;
