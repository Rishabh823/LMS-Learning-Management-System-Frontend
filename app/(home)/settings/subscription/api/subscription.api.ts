export const PUBLIC_PLANS_ENDPOINT = "/subscription-plans/public";

export const SUBSCRIPTION_ENDPOINT = (organizationId: string | number) =>
  `/organizations/${organizationId}/subscription`;

export const UPGRADE_CREATE_ORDER_ENDPOINT = (
  organizationId: string | number,
) => `/organizations/${organizationId}/subscription/upgrade/create-order`;

export const UPGRADE_VERIFY_ENDPOINT = (organizationId: string | number) =>
  `/organizations/${organizationId}/subscription/upgrade/verify`;

export const DOWNGRADE_ENDPOINT = (organizationId: string | number) =>
  `/organizations/${organizationId}/subscription/downgrade`;

export const CANCEL_ENDPOINT = (organizationId: string | number) =>
  `/organizations/${organizationId}/subscription/cancel`;

export const RENEW_CREATE_ORDER_ENDPOINT = (organizationId: string | number) =>
  `/organizations/${organizationId}/subscription/renew/create-order`;

export const RENEW_VERIFY_ENDPOINT = (organizationId: string | number) =>
  `/organizations/${organizationId}/subscription/renew/verify`;

export const PAYMENT_HISTORY_ENDPOINT = (organizationId: string | number) =>
  `/payments/history?organizationId=${organizationId}`;
