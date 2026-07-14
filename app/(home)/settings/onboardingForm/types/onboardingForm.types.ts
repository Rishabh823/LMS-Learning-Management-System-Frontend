export type FieldType =
  | "TEXT"
  | "TEXTAREA"
  | "NUMBER"
  | "DATE"
  | "SELECT"
  | "RADIO"
  | "FILE"
  | "IMAGE";

export interface FieldOption {
  id?: number;
  label: string;
  value: string;
  displayOrder: number;
}

export interface FormField {
  id?: number;
  label: string;
  fieldName: string;
  fieldType: FieldType;
  placeholder?: string | null;
  defaultValue?: string | null;
  required: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  displayOrder: number;
  minLength?: number | null;
  maxLength?: number | null;
  minValue?: number | null;
  maxValue?: number | null;
  regexPattern?: string | null;
  options: FieldOption[];
}

export interface FormSection {
  id?: number;
  title: string;
  description: string;
  displayOrder: number;
  fields: FormField[];
}

export interface OnboardingForm {
  formId?: number;
  title: string;
  description: string;
  status?: string;
  sections: FormSection[];
  createdDate?: string;
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
}

export interface OnboardingFormResponse {
  data: OnboardingForm;
  count: number;
  message: string;
  status: string;
}
