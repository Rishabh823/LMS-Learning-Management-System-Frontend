"use client";

import { Pencil, Power, Building2, Mail, Phone } from "lucide-react";
import Dialog from "@/ui/Dialog";
import Loader from "@/ui/Loader";
import Button from "@/ui/Button";
import { useUserDetail } from "../hooks/useUserDetail";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-sm font-medium text-slate-800">{value || "—"}</p>
  </div>
);

const UserDetailModal = ({
  userId,
  onClose,
  onEdit,
  canManage,
}: {
  userId: string | null;
  onClose: () => void;
  onEdit: () => void;
  canManage: boolean;
}) => {
  const { user, isLoading, toggleStatus, isTogglingStatus } =
    useUserDetail(userId);

  return (
    <Dialog
      open={!!userId}
      onClose={onClose}
      title="User Details"
      maxWidth="max-w-2xl"
    >
      {isLoading || !user ? (
        <div className="flex items-center justify-center py-16">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg font-semibold text-sky-700">
                {user.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{user.name}</p>
                <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-xs font-medium text-sky-600">
                  {user.role}
                </span>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                user.status
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {user.status ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 p-4 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-slate-400" />
              <span className="truncate text-sm text-slate-700">
                {user.emailId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-slate-400" />
              <span className="text-sm text-slate-700">{user.contactNo}</span>
            </div>
            {user.organization && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <Building2 size={14} className="shrink-0 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {user.organization.fullName}
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 border-l-4 border-sky-500 pl-3 text-sm font-bold text-slate-900">
              Profile
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <InfoRow label="Gender" value={user.gender} />
              {user.onboarding?.sections.flatMap((section) =>
                section.fields
                  .filter((f) => f.type !== "FILE" && f.type !== "IMAGE")
                  .map((f, idx) => (
                    <InfoRow
                      key={`${section.sectionTitle}-${idx}`}
                      label={f.label}
                      value={f.value}
                    />
                  )),
              )}
            </div>
          </div>

          {canManage && (
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <Button
                variant="clear"
                onClick={toggleStatus}
                disabled={isTogglingStatus}
                className={`flex items-center gap-1.5 rounded-md px-4 py-2.5 ${
                  user.status ? "text-red-600" : "text-emerald-600"
                }`}
              >
                <Power size={14} />
                {isTogglingStatus
                  ? "Updating..."
                  : user.status
                    ? "Deactivate"
                    : "Activate"}
              </Button>
              <Button
                variant="primary"
                onClick={onEdit}
                className="flex items-center gap-1.5 rounded-md px-4 py-2.5"
              >
                <Pencil size={14} /> Edit User
              </Button>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
};

export default UserDetailModal;
