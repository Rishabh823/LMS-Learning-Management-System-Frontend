"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import MultiSelect from "@/ui/MultiSelect";
import Button from "@/ui/Button";
import { useAssignCourse } from "../hooks/useAssignCourse";
import type { Instructor } from "../types/instructor.types";

const AssignCourseModal = ({
  instructor,
  onClose,
}: {
  instructor: Instructor | null;
  onClose: () => void;
}) => {
  const {
    courseIds,
    setCourseIds,
    courseOptions,
    coursesLoading,
    submit,
    isPending,
  } = useAssignCourse(instructor, onClose);

  return (
    <Dialog
      open={!!instructor}
      onClose={onClose}
      title={`Assign Courses${instructor ? ` — ${instructor.name}` : ""}`}
      maxWidth="max-w-lg overflow-hidden"
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

export default AssignCourseModal;
