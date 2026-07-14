"use client";

import { usePathname } from "next/navigation";
import { pathToBreadcrumbs } from "@/utils/pathUtil";

// Special page titles mapping
const pageTitleMap: Record<string, string> = {
  dashboard: "Dashboard Overview",
  instructor: "Instructor Management",
  "developer-settings": " Developer Settings",
};

// Page descriptions/subtitles
const pageDescriptionMap: Record<string, string> = {
  dashboard: "Comprehensive insights into your organization's data",
  instructor: "Manage instructors and their assigned courses",
  "developer-settings":
    "Configure Modules & Pages, and other developer settings",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = pathToBreadcrumbs(pathname);

  // Always include Home as first breadcrumb if not already present and not on home page
  const displayCrumbs =
    pathname !== "/" && crumbs.length > 0 && crumbs[0]?.key !== "home"
      ? [{ label: "Home", href: "/", key: "home" }, ...crumbs]
      : crumbs;

  // Get the page key (last crumb key)
  const lastCrumb = displayCrumbs[displayCrumbs.length - 1];
  const pageKey = lastCrumb?.key || "home";

  // Get the page title — if it's an ID segment, always show "Details"
  const defaultTitle = lastCrumb?.label || "Home";
  const pageTitle = lastCrumb?.isId
    ? "Details"
    : pageTitleMap[pageKey] || defaultTitle;

  // Get the page description/subtitle
  const pageDescription = pageDescriptionMap[pageKey] || "";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-700">{pageTitle}</h1>
      {pageDescription && (
        <p className="mt-1 text-sm text-slate-500">{pageDescription}</p>
      )}
    </div>
  );
}
