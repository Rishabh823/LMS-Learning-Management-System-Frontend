export const ORG_LIST_ENDPOINT = "/org/public";

export const orgFormEndpoint = (orgId: string | number) =>
  `/forms/organization/${orgId}`;

export const registerFormEndpoint = (formId: string | number) =>
  `/register/${formId}`;

export const UPLOADFIELDFILE = () => "/forms/field/upload";

// --- Organization self-registration + payment (OrgOnboard.tsx) ---

export const PUBLIC_PLANS_ENDPOINT = "/subscription-plans/public";

export const ORGANIZATION_REGISTER_ENDPOINT = "/organizations/register";

export const PAYMENTS_CREATE_ORDER_ENDPOINT = "/payments/create-order";

export const PAYMENTS_VERIFY_ENDPOINT = "/payments/verify";
