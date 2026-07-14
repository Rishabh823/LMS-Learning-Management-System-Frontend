"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import SingleSelect from "@/ui/SingleSelect";
import Button from "@/ui/Button";
import { useEditUser } from "../hooks/useEditUser";
import { useUserDetail } from "../hooks/useUserDetail";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const EditUserDialog = ({
  userId,
  onClose,
}: {
  userId: string | null;
  onClose: () => void;
}) => {
  // Shares the same react-query cache entry as UserDetailModal's fetch for
  // this userId, so this doesn't trigger a second network request.
  const { user } = useUserDetail(userId);
  const { form, update, errors, submit, isPending } = useEditUser(
    user,
    onClose,
  );

  return (
    <Dialog
      open={!!userId}
      onClose={onClose}
      title="Edit User"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        <FormField label="Name" required error={fieldError(errors.name)}>
          <Input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </FormField>
        <FormField label="Gender">
          <SingleSelect
            options={GENDER_OPTIONS}
            value={form.gender}
            onChange={(val) => update({ gender: String(val) })}
            placeholder="Select Gender"
            searchable={false}
          />
        </FormField>
        <FormField
          label="Phone"
          required
          error={fieldError(errors.contactNo)}
        >
          <Input
            type="tel"
            placeholder="Contact Number"
            value={form.contactNo}
            onChange={(e) => update({ contactNo: e.target.value })}
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

export default EditUserDialog;
