import type { SubscriptionPlan } from "@/shared/subscription/types";

export interface PublicPlansResponse {
  data: SubscriptionPlan[];
  message: string;
  status: string;
}
