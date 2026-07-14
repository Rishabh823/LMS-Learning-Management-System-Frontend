export const ALL_PLANS_ENDPOINT = "/subscription-plans";

export const CREATE_PLAN_ENDPOINT = "/subscription-plans";

export const UPDATE_PLAN_ENDPOINT = (planId: number) =>
  `/subscription-plans/${planId}`;

export const DELETE_PLAN_ENDPOINT = (planId: number) =>
  `/subscription-plans/${planId}`;

export const TOGGLE_PLAN_STATUS_ENDPOINT = (
  planId: number,
  activate: boolean,
) => `/subscription-plans/${planId}/toggle-status?activate=${activate}`;

export const ASSIGN_PLAN_ENDPOINT = "/subscription-plans/assign";

export const RUN_MAINTENANCE_ENDPOINT = "/subscription-plans/run-maintenance";

export const ORG_LIST_ENDPOINT = "/org/public";
