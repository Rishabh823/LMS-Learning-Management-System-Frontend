import type { SubscriptionPlan } from "@/shared/subscription/types";

export type { SubscriptionPlan };

export interface AllPlansResponse {
  data: SubscriptionPlan[];
  message: string;
  status: string;
}

export type PlanFormPayload = Omit<SubscriptionPlan, "planId" | "status">;
