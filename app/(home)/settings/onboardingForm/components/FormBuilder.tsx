"use client";

import { Plus } from "lucide-react";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import Button from "@/ui/Button";
import SectionBuilder from "./SectionBuilder";
import { useOnboardingForm } from "../hooks/useOnboardingForm";

const FormBuilder = ({
  form,
}: {
  form: ReturnType<typeof useOnboardingForm>;
}) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    sections,
    addSection,
    removeSection,
    updateSection,
    moveSection,
    addField,
    removeField,
    updateField,
    moveField,
    addOption,
    removeOption,
    updateOption,
    onFieldTypeChange,
    save,
    isSaving,
    publish,
    isPublishing,
    unpublish,
    isUnpublishing,
    isPublished,
    isExistingForm,
    fetchedForm,
  } = form;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Form Title" required>
            <Input
              type="text"
              placeholder="e.g. Employee Onboarding Form"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormField>
          <FormField label="Status">
            <div className="flex h-full items-center">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  fetchedForm?.status === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {fetchedForm?.status || "DRAFT"}
              </span>
            </div>
          </FormField>
        </div>
        <FormField label="Form Description">
          <TextArea
            placeholder="Describe the purpose of this form"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section, idx) => (
          <SectionBuilder
            key={idx}
            section={section}
            isFirst={idx === 0}
            isLast={idx === sections.length - 1}
            onMoveUp={() => moveSection(idx, "up")}
            onMoveDown={() => moveSection(idx, "down")}
            onChange={(patch) => updateSection(idx, patch)}
            onRemove={() => removeSection(idx)}
            onAddField={() => addField(idx)}
            onRemoveField={(fieldIdx) => removeField(idx, fieldIdx)}
            onChangeField={(fieldIdx, patch) =>
              updateField(idx, fieldIdx, patch)
            }
            onFieldTypeChange={(fieldIdx, type) =>
              onFieldTypeChange(idx, fieldIdx, type)
            }
            onMoveField={(fieldIdx, direction) =>
              moveField(idx, fieldIdx, direction)
            }
            onAddOption={(fieldIdx) => addOption(idx, fieldIdx)}
            onRemoveOption={(fieldIdx, optIdx) =>
              removeOption(idx, fieldIdx, optIdx)
            }
            onChangeOption={(fieldIdx, optIdx, patch) =>
              updateOption(idx, fieldIdx, optIdx, patch)
            }
          />
        ))}
      </div>

      <Button
        variant="secondary"
        onClick={addSection}
        className="flex w-fit items-center gap-1.5 rounded-md px-4 py-2.5"
      >
        <Plus size={15} /> Add Section
      </Button>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        {isPublished ? (
          <Button
            variant="clear"
            onClick={unpublish}
            disabled={isUnpublishing || !isExistingForm}
            className="rounded-md px-6 py-2.5"
          >
            {isUnpublishing ? "Unpublishing..." : "Unpublish"}
          </Button>
        ) : (
          <Button
            variant="clear"
            onClick={publish}
            disabled={isPublishing || !isExistingForm}
            className="rounded-md px-6 py-2.5"
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        )}
        <Button
          variant="primary"
          onClick={save}
          disabled={isSaving || !title.trim()}
          className="rounded-md px-6 py-2.5"
        >
          {isSaving
            ? "Saving..."
            : isExistingForm
              ? "Save Changes"
              : "Create Form"}
        </Button>
      </div>
    </div>
  );
};

export default FormBuilder;
