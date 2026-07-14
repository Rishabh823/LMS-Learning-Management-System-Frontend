"use client";
import Sidebar from "@/shared/Sidebar";
import TopNav from "@/shared/TopNav";
import { SelectedOrgProvider } from "@/providers/SelectedOrgProvider";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  return (
    <SelectedOrgProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main
          className={`flex h-screen flex-1 flex-col overflow-hidden transition-all duration-300 ${
            sidebarOpen ? "md:ml-64" : "md:ml-0"
          }`}
        >
          <div className="relative z-50 shrink-0 border-b border-slate-100 bg-slate-50/80 py-3 px-4 backdrop-blur-sm md:px-6">
            <TopNav
              isSidebarOpen={sidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto py-3 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </SelectedOrgProvider>
  );
};

export default Layout;
