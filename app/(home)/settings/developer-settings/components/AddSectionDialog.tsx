"use client";

import { Plus, Trash2 } from "lucide-react";
import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import MultiSelect from "@/ui/MultiSelect";
import Button from "@/ui/Button";
import { useAddSection } from "../hooks/useAddSection";
import { ROLE_OPTIONS } from "../schema/developerSettings.schema";
import type { PageRole } from "../types/developerSettings.types";

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const AddSectionDialog = ({
  open,
  onClose,
  refetchSidebar,
}: {
  open: boolean;
  onClose: () => void;
  refetchSidebar: () => void;
}) => {
  const {
    sectionName,
    setSectionName,
    pages,
    addRow,
    removeRow,
    updateRow,
    errors,
    submit,
    isPending,
    reset,
  } = useAddSection(onClose, refetchSidebar);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add New Section"
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col gap-6">
        <FormField
          label="Section Name"
          required
          error={fieldError(errors.sectionName)}
        >
          <Input
            type="text"
            placeholder="e.g. Reports"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
        </FormField>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
              Pages
            </h3>
            <Button
              variant="secondary"
              onClick={addRow}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs"
            >
              <Plus size={13} /> Add Page
            </Button>
          </div>

          {errors.pages && (
            <p className="mb-2 text-xs text-red-500">{errors.pages}</p>
          )}

          <div className="flex flex-col gap-4">
            {pages.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <FormField label="Page Name">
                  <Input
                    type="text"
                    placeholder="Page Name"
                    value={row.pageName}
                    onChange={(e) =>
                      updateRow(idx, { pageName: e.target.value })
                    }
                  />
                </FormField>
                <FormField label="Page URL">
                  <Input
                    type="text"
                    placeholder="/module/page"
                    value={row.pageUrl}
                    onChange={(e) =>
                      updateRow(idx, { pageUrl: e.target.value })
                    }
                  />
                </FormField>
                <FormField label="Roles">
                  <MultiSelect
                    options={ROLE_OPTIONS}
                    value={row.roles}
                    onChange={(val) =>
                      updateRow(idx, { roles: val as PageRole[] })
                    }
                    placeholder="Select roles"
                    searchable={false}
                  />
                </FormField>
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    disabled={pages.length === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Remove page"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            {isPending ? "Creating..." : "Create Section"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddSectionDialog;
