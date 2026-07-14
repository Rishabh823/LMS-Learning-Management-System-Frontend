"use client";

import { Plus, Trash2 } from "lucide-react";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import type { FieldOption } from "../types/onboardingForm.types";

const FieldOptionsBuilder = ({
  options,
  onAdd,
  onRemove,
  onChange,
}: {
  options: FieldOption[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, patch: Partial<FieldOption>) => void;
}) => {
  return (
    <div className="col-span-full flex flex-col gap-2 rounded-lg bg-slate-50/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Options</span>
        <Button
          variant="secondary"
          onClick={onAdd}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px]"
        >
          <Plus size={12} /> Add Option
        </Button>
      </div>
      {options.length === 0 && (
        <p className="text-xs text-slate-400">No options added yet.</p>
      )}
      {options.map((option, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Label"
            value={option.label}
            onChange={(e) => onChange(idx, { label: e.target.value })}
            className="text-xs"
          />
          <Input
            type="text"
            placeholder="Value"
            value={option.value}
            onChange={(e) => onChange(idx, { value: e.target.value })}
            className="text-xs"
          />
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Remove option"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FieldOptionsBuilder;
