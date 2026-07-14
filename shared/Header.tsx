"use client";
import React from "react";
import NotificationIcon from "@/shared/NotificationIcon";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">SigmaAssist</div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationIcon />
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-sm">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
