"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import MultiSelect from "@/ui/MultiSelect";
import Button from "@/ui/Button";
import { useEditPage } from "../hooks/useEditPage";
import { ROLE_OPTIONS } from "../schema/developerSettings.schema";
import type { PageRole, SectionPage } from "../types/developerSettings.types";

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const EditPageDialog = ({
  page,
  onClose,
  refetchSidebar,
}: {
  page: SectionPage | null;
  onClose: () => void;
  refetchSidebar: () => void;
}) => {
  const { form, update, errors, submit, isPending } = useEditPage(
    page,
    onClose,
    refetchSidebar,
  );

  return (
    <Dialog
      open={!!page}
      onClose={onClose}
      title="Edit Page"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        <FormField
          label="Page Name"
          required
          error={fieldError(errors.pageName)}
        >
          <Input
            type="text"
            placeholder="Page Name"
            value={form.pageName}
            onChange={(e) => update({ pageName: e.target.value })}
          />
        </FormField>
        <FormField label="Page URL" required error={fieldError(errors.pageUrl)}>
          <Input
            type="text"
            placeholder="/module/page"
            value={form.pageUrl}
            onChange={(e) => update({ pageUrl: e.target.value })}
          />
        </FormField>
        <FormField label="Roles">
          <MultiSelect
            options={ROLE_OPTIONS}
            value={form.roles}
            onChange={(val) => update({ roles: val as PageRole[] })}
            placeholder="Select roles"
            searchable={false}
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

export default EditPageDialog;
