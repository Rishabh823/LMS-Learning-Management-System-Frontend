"use client";

import { useApiQuery } from "@/services/useApiQuery";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { PAYMENT_HISTORY_ENDPOINT } from "../api/subscription.api";
import type { PaymentHistoryResponse } from "../types/subscription.types";

export const usePaymentHistory = () => {
  const { orgId } = useSelectedOrg();

  const { data, isLoading } = useApiQuery<PaymentHistoryResponse>({
    endpoint: orgId ? PAYMENT_HISTORY_ENDPOINT(orgId) : "",
    method: "GET",
    queryKey: ["payment-history", orgId],
    enabled: !!orgId,
  });

  return { transactions: data?.data ?? [], isLoading };
};
