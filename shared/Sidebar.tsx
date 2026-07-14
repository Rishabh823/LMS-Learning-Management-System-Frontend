"use client";
import useSidebar, { UserRole } from "@/utils/useSidebar";
import { clearAllAuthCookies } from "@/utils/cookieManager";
import { successMsg } from "@/utils/notify";
import {
  List,
  X,
  ChevronDown,
  ArrowRight,
  Layers,
  Settings,
  BarChart3,
  ClipboardCheck,
  Users,
  Shield,
  FileText,
  Briefcase,
  Network,
  Building2,
  KeyRound,
  BookOpen,
  Video,
  Headphones,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ZenithLogo from "../public/zenith guard transparent logo.png";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Page {
  pageId: number;
  pageName: string;
  pageUrl: string;
  pagePosition: number;
}

interface Module {
  moduleId: number;
  moduleName: string;
  modulePosition: number;
  pages: Page[];
}

interface SidebarData {
  userId: string;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  email: string;
  profilePic?: string | null;
  role: UserRole;
  modules: Module[];
}

const MODULE_STYLES: {
  match: string[];
  icon: typeof Shield;
  bg: string;
  text: string;
}[] = [
  {
    match: ["dashboard"],
    icon: BarChart3,
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  {
    match: ["external"],
    icon: FileText,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    match: ["organization", "department"],
    icon: Building2,
    bg: "bg-slate-100",
    text: "text-slate-700",
  },
  {
    match: ["instructor", "trainer"],
    icon: Briefcase,
    bg: "bg-green-50",
    text: "text-green-600",
  },
  {
    match: ["student"],
    icon: Users,
    bg: "bg-orange-50",
    text: "text-orange-500",
  },
  {
    match: ["group"],
    icon: Users,
    bg: "bg-purple-50",
    text: "text-purple-500",
  },
  { match: ["user"], icon: Users, bg: "bg-amber-50", text: "text-amber-600" },
  {
    match: ["course"],
    icon: BookOpen,
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  { match: ["quiz"], icon: FileText, bg: "bg-sky-50", text: "text-sky-500" },
  {
    match: ["live", "training"],
    icon: Video,
    bg: "bg-rose-50",
    text: "text-rose-500",
  },
  {
    match: ["exam"],
    icon: ClipboardCheck,
    bg: "bg-green-50",
    text: "text-green-600",
  },
  {
    match: ["certificate"],
    icon: Shield,
    bg: "bg-cyan-50",
    text: "text-cyan-600",
  },
  {
    match: ["report"],
    icon: BarChart3,
    bg: "bg-slate-100",
    text: "text-slate-600",
  },
  {
    match: ["setting", "config"],
    icon: Settings,
    bg: "bg-slate-100",
    text: "text-slate-500",
  },
  { match: ["risk"], icon: Shield, bg: "bg-red-50", text: "text-red-600" },
  {
    match: ["policy", "document"],
    icon: FileText,
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    match: ["framework", "standard"],
    icon: Network,
    bg: "bg-lime-50",
    text: "text-lime-600",
  },
  {
    match: ["role", "permission"],
    icon: KeyRound,
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-600",
  },
];

const getModuleStyle = (moduleName: string) => {
  const name = moduleName.toLowerCase();
  return (
    MODULE_STYLES.find((m) => m.match.some((k) => name.includes(k))) || {
      icon: Layers,
      bg: "bg-slate-100",
      text: "text-slate-500",
    }
  );
};

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { data, isLoading, isError } = useSidebar();
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const sidebarData: SidebarData | undefined = data?.data;

  const modulesForRender: Module[] =
    sidebarData?.modules?.map((m) => {
      const pages = m.pages ?? [];

      // Deduplicate pages by URL (backend may return duplicates).
      const seen = new Set<string>();
      const deduped = pages
        .slice()
        .sort((a, b) => a.pagePosition - b.pagePosition)
        .filter((p) => {
          const key = p.pageUrl;
          if (!key) return false;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

      // Ensure Dashboard module contains /dashboard exactly once (inject only if missing).
      if (m.moduleName?.toLowerCase() === "dashboard") {
        const hasDashboardPage = deduped.some(
          (p) => p.pageUrl === "/dashboard",
        );
        if (!hasDashboardPage) {
          const injected: Page = {
            pageId: -1,
            pageName: "Overview",
            pageUrl: "/dashboard",
            pagePosition: 1,
          };
          return { ...m, pages: [injected, ...deduped] };
        }
      }

      return { ...m, pages: deduped };
    }) ?? [];

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  // Auto-expand module that contains the current path's page
  useEffect(() => {
    if (!sidebarData || !pathname) return;
    const found = sidebarData.modules.find((m) =>
      m.pages?.some((p) => pathname.startsWith(p.pageUrl)),
    );
    if (found) {
      setExpandedModules([found.moduleId]);
    }
  }, [pathname, sidebarData]);

  // Close sidebar on outside click when mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768
      ) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const handleLogout = () => {
    // clearAllAuthCookies() dispatches "auth-token-changed" synchronously,
    // but the components listening for it (useAuthToken-gated queries) only
    // get to re-render — and actually disable — on a later tick. Calling
    // queryClient.clear() immediately after, in the same tick, wipes the
    // cache while those queries are still mounted with their *previous*
    // enabled=true snapshot, which makes react-query treat the now-empty
    // cache as "never fetched" and refetch right away — with no token
    // attached, since the cookie is already gone. Cancelling first stops
    // anything in flight, and deferring the full clear gives the pending
    // navigation a chance to actually unmount the old page tree first.
    clearAllAuthCookies();
    queryClient.cancelQueries();
    successMsg("Logged out successfully");
    router.replace("/auth/login");
    setTimeout(() => queryClient.clear(), 0);
  };

  return (
    <>
      {mounted && (
        <>
          {/* Collapsed-state floating toggle (mobile) */}
          {/* {!isOpen && (
            <button
              onClick={onToggle}
              className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 md:hidden"
              aria-label="Open sidebar"
            >
              <List size={18} />
            </button>
          )} */}

          {/* Backdrop for mobile */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-55 md:hidden transition-opacity duration-300"
              onClick={onToggle}
            />
          )}

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`fixed left-0 top-0 z-60 flex h-screen w-64 max-w-[85vw] flex-col border-r border-slate-100 bg-white transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-600">
                  <Image
                    src={ZenithLogo}
                    alt="ZenithLMS Logo"
                    className="h-5 w-5 object-contain brightness-0 invert"
                    width={20}
                    height={20}
                  />
                </div>
                <p className="text-lg font-bold text-slate-700">ZenithLMS</p>
              </div>
              <button
                onClick={onToggle}
                className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-sky-600 md:flex"
                aria-label="Close sidebar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Menu area (scrollable) */}
            <div className="sidebar-scroll flex-1 overflow-auto px-3 py-3">
              <nav className="flex flex-col gap-1">
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                      <p className="text-sm">Loading menu...</p>
                    </div>
                  </div>
                )}
                {isError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-500">Error loading menu</p>
                  </div>
                )}

                {/* Dynamic Modules */}
                {modulesForRender
                  ?.sort((a, b) => a.modulePosition - b.modulePosition)
                  .map((module) => {
                    const moduleActive = module.pages?.some((p) =>
                      pathname?.startsWith(p.pageUrl),
                    );
                    const isExpanded = expandedModules.includes(
                      module.moduleId,
                    );
                    const style = getModuleStyle(module.moduleName);
                    const IconComponent = style.icon;
                    const hasMultiplePages = module.pages.length > 1;
                    const singlePage = module.pages[0];

                    if (!hasMultiplePages && singlePage) {
                      const pageActive = pathname === singlePage.pageUrl;
                      return (
                        <Link
                          key={module.moduleId}
                          href={singlePage.pageUrl}
                          className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-colors ${
                            pageActive
                              ? "font-semibold text-sky-600 rounded-2xl bg-sky-50/70"
                              : "font-bold text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.bg}`}
                          >
                            <IconComponent size={16} className={style.text} />
                          </div>
                          {module.moduleName}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={module.moduleId}
                        className={
                          moduleActive ? "rounded-2xl bg-sky-50/70" : ""
                        }
                      >
                        {/* Module Header */}
                        <button
                          onClick={() => toggleModule(module.moduleId)}
                          className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2.5 text-sm transition-colors cursor-pointer ${
                            moduleActive
                              ? "font-semibold text-sky-600"
                              : "font-medium text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3 font-bold">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.bg}`}
                            >
                              <IconComponent size={16} className={style.text} />
                            </div>
                            {module.moduleName}
                          </div>
                          {/* {!moduleActive && ( */}
                          <ChevronDown
                            size={15}
                            className={`transition-transform duration-200 text-slate-400 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                          {/* )} */}
                        </button>

                        {/* Pages with smooth animation */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-[1.7rem] mt-1 flex flex-col pl-4">
                            {module.pages
                              ?.sort((a, b) => a.pagePosition - b.pagePosition)
                              .map((page, idx, arr) => {
                                const pageActive = pathname === page.pageUrl;
                                const isLast = idx === arr.length - 1;
                                return (
                                  <div
                                    key={page.pageId}
                                    className="relative py-2"
                                  >
                                    {/* Tree connector: vertical stem down to this page */}
                                    <span
                                      className={`absolute -left-4 w-px bg-slate-200 ${
                                        isLast ? "top-0 h-1/2" : "top-0 h-full"
                                      }`}
                                    />
                                    {/* Tree connector: branch into the page icon/name */}
                                    <span className="absolute -left-4 top-1/2 h-px w-4 -translate-y-1/2 bg-slate-200" />
                                    <Link
                                      href={page.pageUrl}
                                      className={`group flex items-center gap-2 rounded-md text-sm transition-colors ${
                                        pageActive
                                          ? "font-semibold text-sky-600"
                                          : "font-medium text-slate-500 hover:text-sky-600"
                                      }`}
                                    >
                                      <span className="flex-1">
                                        {page.pageName}
                                      </span>
                                      {pageActive && (
                                        <span className="flex items-center gap-1 text-sky-400 font-extrabold">
                                          <span className="h-px w-10 border-t border-dashed border-sky-300 font-extrabold" />
                                          <ArrowRight size={13} />
                                        </span>
                                      )}
                                    </Link>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </nav>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-slate-100 p-3">
              <Link
                href="/support"
                className="flex items-center gap-3 rounded-xl bg-sky-50/70 p-3 transition-colors hover:bg-sky-100/70"
              >
                <Headphones size={20} className="shrink-0 text-sky-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-sky-600">
                    Need Help?
                  </p>
                  <p className="text-xs text-slate-500">Contact Support</p>
                </div>
                <ArrowRight size={16} className="text-sky-500" />
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <LogOut size={16} className="text-red-600" />
                </div>
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
