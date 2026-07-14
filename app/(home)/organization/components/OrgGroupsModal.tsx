"use client";

import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import Dialog from "@/ui/Dialog";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import Switch from "@/ui/Switch";
import Loader from "@/ui/Loader";
import { useOrgGroups } from "../hooks/useOrgGroups";
import type { Organization } from "../types/organization.types";

const OrgGroupsModal = ({
  organization,
  onClose,
}: {
  organization: Organization | null;
  onClose: () => void;
}) => {
  const {
    groups,
    isLoading,
    page,
    setPage,
    totalPages,
    toggleGroupStatus,
    isTogglingStatus,
    groupName,
    setGroupName,
    addGroup,
    isAddingGroup,
  } = useOrgGroups(organization);

  return (
    <Dialog
      open={!!organization}
      onClose={onClose}
      title={`Manage Groups${organization ? ` — ${organization.fullName}` : ""}`}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <Input
              type="text"
              placeholder="New group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            onClick={addGroup}
            disabled={isAddingGroup || !groupName.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-4 py-2.5"
          >
            <Plus size={16} /> {isAddingGroup ? "Adding..." : "Add"}
          </Button>
        </div>

        <div className="flex min-h-[160px] flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center py-8">
              <Loader />
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-slate-400">
              <Users size={28} />
              <p className="text-sm">No groups found for this organization</p>
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.groupId}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
              >
                <span className="text-sm font-medium text-slate-700">
                  {group.groupName}
                </span>
                <Switch
                  checked={!!group.status}
                  onChange={(checked) =>
                    toggleGroupStatus(group.groupId, checked)
                  }
                  disabled={isTogglingStatus}
                />
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-600 text-sm font-semibold text-white">
              {page + 1}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page + 1 >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <Button variant="cancel" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default OrgGroupsModal;
