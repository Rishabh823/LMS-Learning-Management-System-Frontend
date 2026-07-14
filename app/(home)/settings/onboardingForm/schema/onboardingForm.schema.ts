import type { FieldType } from "../types/onboardingForm.types";

export const FIELD_TYPE_OPTIONS: { value: FieldType; label: string }[] = [
  { value: "TEXT", label: "Text" },
  { value: "TEXTAREA", label: "Textarea" },
  { value: "NUMBER", label: "Number" },
  { value: "DATE", label: "Date" },
  { value: "SELECT", label: "Select (Dropdown)" },
  { value: "RADIO", label: "Radio" },
  { value: "FILE", label: "File Upload" },
  { value: "IMAGE", label: "Image Upload" },
];

export const OPTION_FIELD_TYPES: FieldType[] = ["SELECT", "RADIO"];
