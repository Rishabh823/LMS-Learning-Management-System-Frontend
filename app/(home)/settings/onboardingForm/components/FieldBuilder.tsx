"use client";

import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import Input from "@/ui/Input";
import SingleSelect from "@/ui/SingleSelect";
import FieldOptionsBuilder from "./FieldOptionsBuilder";
import {
  FIELD_TYPE_OPTIONS,
  OPTION_FIELD_TYPES,
} from "../schema/onboardingForm.schema";
import type {
  FieldOption,
  FieldType,
  FormField,
} from "../types/onboardingForm.types";

const FieldBuilder = ({
  field,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onChange,
  onTypeChange,
  onRemove,
  onAddOption,
  onRemoveOption,
  onChangeOption,
}: {
  field: FormField;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChange: (patch: Partial<FormField>) => void;
  onTypeChange: (fieldType: FieldType) => void;
  onRemove: () => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onChangeOption: (index: number, patch: Partial<FieldOption>) => void;
}) => {
  const showOptions = OPTION_FIELD_TYPES.includes(field.fieldType);

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 p-3 sm:grid-cols-[auto_1fr_1fr_1fr_auto_auto]">
      <div className="flex shrink-0 flex-row gap-1 sm:flex-col">
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

      <Input
        type="text"
        placeholder="Label"
        value={field.label}
        onChange={(e) => onChange({ label: e.target.value })}
      />
      <Input
        type="text"
        placeholder="fieldName"
        value={field.fieldName}
        onChange={(e) => onChange({ fieldName: e.target.value })}
      />
      <SingleSelect
        options={FIELD_TYPE_OPTIONS}
        value={field.fieldType}
        onChange={(val) => onTypeChange(val as FieldType)}
        placeholder="Field Type"
        searchable={false}
      />

      <label className="flex items-center gap-1.5 self-center text-xs text-slate-600">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onChange({ required: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
        />
        Required
      </label>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-9 w-9 items-center justify-center justify-self-end rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
        aria-label="Remove field"
      >
        <Trash2 size={16} />
      </button>

      {showOptions && (
        <FieldOptionsBuilder
          options={field.options}
          onAdd={onAddOption}
          onRemove={onRemoveOption}
          onChange={onChangeOption}
        />
      )}
    </div>
  );
};

export default FieldBuilder;
