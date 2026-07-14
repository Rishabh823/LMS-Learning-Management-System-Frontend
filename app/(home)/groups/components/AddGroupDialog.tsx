"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import Button from "@/ui/Button";
import { useAddGroup } from "../hooks/useAddGroup";

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const AddGroupDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { form, update, errors, submit, isPending, reset } =
    useAddGroup(onClose);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add New Group"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        <FormField
          label="Group Name"
          required
          error={fieldError(errors.groupName)}
        >
          <Input
            type="text"
            placeholder="e.g. Marketing Team"
            value={form.groupName}
            onChange={(e) => update({ groupName: e.target.value })}
          />
        </FormField>
        <FormField label="Group Description">
          <TextArea
            placeholder="Brief description about the group"
            value={form.groupDescription}
            onChange={(e) => update({ groupDescription: e.target.value })}
            rows={3}
          />
        </FormField>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="cancel" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={isPending}
            className="rounded-md px-6 py-2.5"
          >
            {isPending ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddGroupDialog;
