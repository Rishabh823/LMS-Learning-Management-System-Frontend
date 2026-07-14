"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, KeyRound, List, UserRound } from "lucide-react";
import useSidebar, { UserRole } from "@/utils/useSidebar";
import { getUserId } from "@/utils/cookieManager";
import NotificationIcon from "./NotificationIcon";
import Breadcrumbs from "./Breadcrumbs";
import OrgSelect from "@/app/(home)/dashboard/components/OrgSelect";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { useProfilePic } from "@/app/(home)/users/hooks/useProfilePic";

interface TopNavProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Super Admin",
  STUDENT: "Student",
  TRAINER: "Trainer",
  ORGANIZATION: "Organization",
  EXTERNALEXAMINEE: "External Examinee",
};

const TopNav: React.FC<TopNavProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const { data } = useSidebar();

  const sidebarData = data?.data;
  const fullName = sidebarData
    ? [sidebarData.firstName, sidebarData.middleName, sidebarData.lastName]
        .filter(Boolean)
        .join(" ")
    : "";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "U";
  const roleLabel = sidebarData ? ROLE_LABEL[sidebarData.role] : "";

  const { orgOptions, orgListLoading, orgId, setOrgId, isAdmin } =
    useSelectedOrg();

  const loggedInUserId = sidebarData?.userId || getUserId() || null;
  const { pictureUrl } = useProfilePic(loggedInUserId);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex items-center gap-3">
      {!isSidebarOpen && (
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-sky-600 transition-colors"
          aria-label="Open sidebar"
        >
          <List size={18} />
        </button>
      )}

      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        {/* <button className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors sm:flex">
          <Calendar size={15} className="text-slate-400" />
          <span className="hidden lg:inline">May 12 &ndash; May 18, 2025</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button> */}
        {isAdmin && (
          <OrgSelect
            options={orgOptions}
            value={orgId}
            isLoading={orgListLoading}
            onChange={setOrgId}
          />
        )}

        <NotificationIcon />

        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setProfileMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full px-1.5 py-1 transition-colors cursor-pointer bg-white text-sky-600 sm:flex focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-sm font-bold text-white bg-white sm:flex focus:outline-none focus:ring-2 focus:ring-sky-100">
                {pictureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pictureUrl}
                    alt={fullName || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold leading-tight text-slate-900">
                {fullName || "User"}
              </p>
              <p className="text-xs leading-tight text-slate-500">
                {roleLabel}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform md:block ${
                profileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 z-110 mt-2 w-48 rounded-xl border border-slate-100 bg-white shadow-lg">
              <Link
                href={`/profile/${sidebarData?.userId || getUserId() || ""}`}
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <UserRound size={15} /> Profile
              </Link>
              <Link
                href="/change-password"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <KeyRound size={15} /> Change Password
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
