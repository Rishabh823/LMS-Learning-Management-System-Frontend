import type { OrgRegisterFormData } from "../types/register.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;
const GST_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/;
const PAN_PATTERN = /^[A-Z]{5}\d{4}[A-Z]$/;
const WEBSITE_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

export type OrgOnboardField = keyof OrgRegisterFormData;

// Real-time, per-field checks — separate from the step-level `validate()` in
// useOrgOnboard.ts, which still gates whether "Continue"/"Submit" can be
// pressed. This is what drives the inline error shown under each field as
// the user types/blurs, Google-Forms style.
export const validateOrgField = (
  field: OrgOnboardField,
  value: string,
  formData: OrgRegisterFormData,
): string | undefined => {
  switch (field) {
    case "organizationName":
      return value.trim() ? undefined : "Organization name is required.";
    case "legalBusinessName":
      return value.trim() ? undefined : "Legal business name is required.";
    case "organizationType":
      return value.trim() ? undefined : "Organization type is required.";
    case "industry":
      return value.trim() ? undefined : "Industry is required.";
    case "companySize":
      return value.trim() ? undefined : "Company size is required.";
    case "registrationNumber":
      return value.trim() ? undefined : "Registration number is required.";

    case "gstNumber":
      if (!value.trim()) return undefined; // optional
      return GST_PATTERN.test(value.trim().toUpperCase())
        ? undefined
        : "Enter a valid 15-character GST number (e.g. 22AAAAA0000A1Z5).";
    case "panNumber":
      if (!value.trim()) return undefined; // optional
      return PAN_PATTERN.test(value.trim().toUpperCase())
        ? undefined
        : "Enter a valid 10-character PAN number (e.g. ABCDE1234F).";
    case "website":
      if (!value.trim()) return undefined; // optional
      return WEBSITE_PATTERN.test(value.trim())
        ? undefined
        : "Enter a valid website URL (e.g. https://example.com).";

    case "adminName":
      return value.trim() ? undefined : "Admin name is required.";
    case "adminEmail":
      if (!value.trim()) return "Email address is required.";
      return EMAIL_PATTERN.test(value.trim())
        ? undefined
        : "Enter a valid email address (e.g. name@company.com).";
    case "adminPhone":
      if (!value.trim()) return "Phone number is required.";
      return PHONE_PATTERN.test(value.trim())
        ? undefined
        : "Enter a valid 10-digit phone number.";
    case "gender":
      return value ? undefined : "Please select a gender.";
    case "password":
      if (!value) return "Password is required.";
      return value.length >= 6
        ? undefined
        : "Password must be at least 6 characters.";
    case "confirmPassword":
      if (!value) return "Please confirm your password.";
      return value === formData.password
        ? undefined
        : "Passwords do not match.";

    default:
      return undefined;
  }
};
