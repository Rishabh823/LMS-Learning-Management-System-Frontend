"use client";

import { ChevronUp, ChevronDown, Plus, Trash2, Layers } from "lucide-react";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import FieldBuilder from "./FieldBuilder";
import type {
  FieldOption,
  FieldType,
  FormField,
  FormSection,
} from "../types/onboardingForm.types";

const SectionBuilder = ({
  section,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onChange,
  onRemove,
  onAddField,
  onRemoveField,
  onChangeField,
  onFieldTypeChange,
  onMoveField,
  onAddOption,
  onRemoveOption,
  onChangeOption,
}: {
  section: FormSection;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChange: (patch: Partial<FormSection>) => void;
  onRemove: () => void;
  onAddField: () => void;
  onRemoveField: (fieldIndex: number) => void;
  onChangeField: (fieldIndex: number, patch: Partial<FormField>) => void;
  onFieldTypeChange: (fieldIndex: number, fieldType: FieldType) => void;
  onMoveField: (fieldIndex: number, direction: "up" | "down") => void;
  onAddOption: (fieldIndex: number) => void;
  onRemoveOption: (fieldIndex: number, optionIndex: number) => void;
  onChangeOption: (
    fieldIndex: number,
    optionIndex: number,
    patch: Partial<FieldOption>,
  ) => void;
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-3">
          <div className="flex shrink-0 flex-col pt-2">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="flex h-4 w-4 items-center justify-center text-slate-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="flex h-4 w-4 items-center justify-center text-slate-400 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <Layers size={16} />
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              type="text"
              placeholder="Section Title"
              value={section.title}
              onChange={(e) => onChange({ title: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Section Description"
              value={section.description}
              onChange={(e) => onChange({ description: e.target.value })}
            />
          </div>
        </div>
        <button
          onClick={onRemove}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label="Remove section"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-3 pl-4">
        {section.fields.map((field, fieldIdx) => (
          <FieldBuilder
            key={fieldIdx}
            field={field}
            isFirst={fieldIdx === 0}
            isLast={fieldIdx === section.fields.length - 1}
            onMoveUp={() => onMoveField(fieldIdx, "up")}
            onMoveDown={() => onMoveField(fieldIdx, "down")}
            onChange={(patch) => onChangeField(fieldIdx, patch)}
            onTypeChange={(type) => onFieldTypeChange(fieldIdx, type)}
            onRemove={() => onRemoveField(fieldIdx)}
            onAddOption={() => onAddOption(fieldIdx)}
            onRemoveOption={(optIdx) => onRemoveOption(fieldIdx, optIdx)}
            onChangeOption={(optIdx, patch) =>
              onChangeOption(fieldIdx, optIdx, patch)
            }
          />
        ))}

        <Button
          variant="secondary"
          onClick={onAddField}
          className="flex w-fit items-center gap-1.5 rounded-md px-3 py-2 text-xs"
        >
          <Plus size={13} /> Add Field
        </Button>
      </div>
    </div>
  );
};

export default SectionBuilder;
