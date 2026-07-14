"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import MultiSelect from "@/ui/MultiSelect";
import Button from "@/ui/Button";
import { useAssignCourseToGroup } from "../hooks/useAssignCourseToGroup";
import type { Group } from "../types/group.types";

const AssignCourseToGroupModal = ({
  group,
  onClose,
}: {
  group: Group | null;
  onClose: () => void;
}) => {
  const { courseIds, setCourseIds, courseOptions, coursesLoading, submit, isPending } =
    useAssignCourseToGroup(group, onClose);

  return (
    <Dialog
      open={!!group}
      onClose={onClose}
      title={`Assign Courses${group ? ` — ${group.groupName}` : ""}`}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        <FormField label="Courses">
          <MultiSelect
            options={courseOptions}
            value={courseIds}
            onChange={setCourseIds}
            placeholder="Select courses to assign"
            isLoading={coursesLoading}
          />
        </FormField>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="cancel" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={isPending || courseIds.length === 0}
            className="rounded-md px-6 py-2.5"
          >
            {isPending ? "Assigning..." : "Assign Courses"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AssignCourseToGroupModal;
