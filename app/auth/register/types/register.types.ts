export interface Organization {
  organizationId: string;
  fullName: string;
}

export interface FieldOption {
  id: number;
  label: string;
  value: string;
  displayOrder: number;
}

export interface OrgFormField {
  id: number;
  label: string;
  fieldName: string;
  fieldType:
    | "TEXT"
    | "TEXTAREA"
    | "NUMBER"
    | "DATE"
    | "SELECT"
    | "FILE"
    | "IMAGE"
    | string;
  placeholder?: string | null;
  defaultValue?: string | null;
  required: boolean;
  readOnly: boolean;
  hidden: boolean;
  displayOrder: number;
  minLength?: number | null;
  maxLength?: number | null;
  minValue?: number | null;
  maxValue?: number | null;
  regexPattern?: string | null;
  options: FieldOption[];
}

export interface OrgFormSection {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  fields: OrgFormField[];
}

export interface OrgForm {
  formId: number;
  title: string;
  description: string;
  status: string;
  sections: OrgFormSection[];
}

export interface UserOnboardFormData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  confirmPassword: string;
  orgId: string;
  orgName: string;
}

export type FormAnswers = Record<string, string>;

export type FormFieldFiles = Record<string, File>;

export interface RegisterAnswer {
  fieldId: number;
  value: string;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  answers: RegisterAnswer[];
}

// --- Organization self-registration + payment (OrgOnboard.tsx) ---

export interface OrgRegisterFormData {
  organizationName: string;
  legalBusinessName: string;
  organizationType: string;
  industry: string;
  companySize: string;
  registrationNumber: string;
  gstNumber: string;
  panNumber: string;
  website: string;
  description: string;

  adminName: string;
  adminEmail: string;
  adminPhone: string;
  gender: string;
  password: string;
  confirmPassword: string;
  designation: string;
  department: string;
}

export interface OrganizationInfoPayload {
  organizationName: string;
  legalBusinessName: string;
  organizationType: string;
  industry: string;
  companySize: string;
  registrationNumber: string;
  gstNumber?: string;
  panNumber?: string;
  website?: string;
  description?: string;
}

export interface AdminInfoPayload {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  gender: string;
  password: string;
  designation?: string;
  department?: string;
}

export interface OrgRegisterResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
  organizationName: string;
  planCode: string;
  subscriptionStatus: string;
  message?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  planId: number;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
  planId: number;
  organization: OrganizationInfoPayload;
  admin: AdminInfoPayload;
}
