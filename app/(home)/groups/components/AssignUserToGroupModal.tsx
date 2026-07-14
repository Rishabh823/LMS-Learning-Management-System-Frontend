"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import SingleSelect from "@/ui/SingleSelect";
import Button from "@/ui/Button";
import { useAssignUserToGroup } from "../hooks/useAssignUserToGroup";
import type { Group } from "../types/group.types";

const AssignUserToGroupModal = ({
  group,
  onClose,
}: {
  group: Group | null;
  onClose: () => void;
}) => {
  const { userId, setUserId, userOptions, usersLoading, submit, isPending } =
    useAssignUserToGroup(group, onClose);

  return (
    <Dialog
      open={!!group}
      onClose={onClose}
      title={`Assign User${group ? ` — ${group.groupName}` : ""}`}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        <FormField label="User">
          <SingleSelect
            options={userOptions}
            value={userId}
            onChange={setUserId}
            placeholder="Select a user to assign"
            isLoading={usersLoading}
          />
        </FormField>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="cancel" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={isPending || !userId}
            className="rounded-md px-6 py-2.5"
          >
            {isPending ? "Assigning..." : "Assign User"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AssignUserToGroupModal;
