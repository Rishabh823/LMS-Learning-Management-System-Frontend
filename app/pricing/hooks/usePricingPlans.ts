"use client";

import { useApiQuery } from "@/services/useApiQuery";
import { PUBLIC_PLANS_ENDPOINT } from "../api/pricing.api";
import type { PublicPlansResponse } from "../types/pricing.types";

export const usePricingPlans = () => {
  const { data, isLoading } = useApiQuery<PublicPlansResponse>({
    endpoint: PUBLIC_PLANS_ENDPOINT,
    method: "GET",
    queryKey: ["public-subscription-plans"],
  });

  const plans = (data?.data ?? []).slice().sort((a, b) => a.price - b.price);

  return { plans, isLoading };
};
