"use client";
import React from "react";

export interface TabItem {
  id: string;
  title: string;
  panel: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
  onTabChange?: (tabId: string, tabIndex: number) => void;
}

export default function Tabs({
  tabs,
  defaultTabId,
  className,
  onTabChange,
}: TabsProps) {
  const defaultIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === defaultTabId),
  );
  const [active, setActive] = React.useState<number>(defaultIndex ?? 0);

  const handleTabClick = (idx: number) => {
    setActive(idx);
    if (onTabChange && tabs[idx]) {
      onTabChange(tabs[idx].id, idx);
    }
  };

  return (
    <div className={className}>
      {/* Tabs Navigation */}
      <nav
        className="flex space-x-2 overflow-x-auto pb-3 border-b border-gray-200 pt-1"
        aria-label="Tabs"
      >
        {tabs.map((tab, idx) => {
          const isActive = idx === active;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(idx)}
              type="button"
              aria-selected={isActive}
              role="tab"
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 cursor-pointer transition-all duration-200 flex items-center gap-2 relative ${
                isActive
                  ? "bg-[#0066FF] text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-[#0066FF]"
              }`}
            >
              {tab.icon && (
                <span
                  className={`flex-none transition-colors shrink-0 ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                >
                  {tab.icon}
                </span>
              )}
              <span className="truncate">{tab.title}</span>
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#0066FF] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Tab Panel */}
      {tabs[active] && (
        <div className="mt-4 animate-fade-in" role="tabpanel">
          {tabs[active].panel}
        </div>
      )}
    </div>
  );
}
