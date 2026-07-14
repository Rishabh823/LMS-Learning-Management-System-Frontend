import type { OrgFormField } from "../types/register.types";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import SingleSelect from "@/ui/SingleSelect";

const DynamicField = ({
  field,
  value,
  onChange,
  onFileChange,
}: {
  field: OrgFormField;
  value: string;
  onChange: (value: string) => void;
  onFileChange?: (file: File) => void;
}) => {
  const label = field.label + (field.required ? " *" : "");

  if (field.fieldType === "TEXTAREA") {
    return (
      <div className="sm:col-span-2">
        <FormField label={label}>
          <TextArea
            rows={3}
            placeholder={field.placeholder || ""}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </FormField>
      </div>
    );
  }

  if (field.fieldType === "SELECT") {
    return (
      <FormField label={label}>
        <SingleSelect
          options={field.options
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((opt) => ({ value: opt.value, label: opt.label }))}
          value={value}
          onChange={(val) => onChange(String(val))}
          placeholder={`Select ${field.label.toLowerCase()}`}
          searchable={false}
        />
      </FormField>
    );
  }

  if (field.fieldType === "FILE" || field.fieldType === "IMAGE") {
    return (
      <FormField label={label}>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-sky-200 bg-sky-50/40 px-4 py-6 text-center hover:border-sky-400">
          <input
            type="file"
            accept={field.fieldType === "IMAGE" ? "image/*" : undefined}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              onFileChange?.(file);
              onChange(file.name);
            }}
          />
          {value ? (
            <>
              <i
                className="bi bi-check-circle-fill text-lg"
                style={{ color: "#0d9370" }}
              />
              <span className="text-sm text-slate-700">{value}</span>
            </>
          ) : (
            <>
              <i
                className={
                  "bi bi-" +
                  (field.fieldType === "IMAGE" ? "image" : "file-earmark-text") +
                  " text-xl text-slate-400"
                }
              />
              <span className="text-sm text-slate-600">Click to upload</span>
            </>
          )}
        </label>
      </FormField>
    );
  }

  return (
    <FormField label={label}>
      <Input
        type={
          field.fieldType === "NUMBER"
            ? "number"
            : field.fieldType === "DATE"
              ? "date"
              : "text"
        }
        placeholder={field.placeholder || ""}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        minLength={field.minLength ?? undefined}
        maxLength={field.maxLength ?? undefined}
      />
    </FormField>
  );
};

export default DynamicField;
