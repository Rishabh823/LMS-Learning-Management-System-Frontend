"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import { useEditSection } from "../hooks/useEditSection";
import type { Section } from "../types/developerSettings.types";

const EditSectionDialog = ({
  section,
  onClose,
  refetchSidebar,
}: {
  section: Section | null;
  onClose: () => void;
  refetchSidebar: () => void;
}) => {
  const { name, setName, error, submit, isPending } = useEditSection(
    section,
    onClose,
    refetchSidebar,
  );

  return (
    <Dialog
      open={!!section}
      onClose={onClose}
      title="Edit Section"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-6">
        <FormField
          label="Section Name"
          required
          error={error ? ({ message: error } as any) : undefined}
        >
          <Input
            type="text"
            placeholder="Section Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormField>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="cancel" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={isPending}
            className="rounded-md px-6 py-2.5"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditSectionDialog;
