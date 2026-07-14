"use client";

import { useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { successMsg } from "@/utils/notify";
import { openRazorpayCheckout } from "@/shared/subscription/razorpay";
import type { SubscriptionPlan } from "@/shared/subscription/types";
import {
  DOWNGRADE_ENDPOINT,
  PUBLIC_PLANS_ENDPOINT,
  UPGRADE_CREATE_ORDER_ENDPOINT,
  UPGRADE_VERIFY_ENDPOINT,
} from "../api/subscription.api";
import type { CreateOrderResponse } from "../types/subscription.types";

const SUBSCRIPTION_QUERY_KEY = "org-subscription";

export const useUpgradeDowngrade = (
  currentPlanId: number | undefined,
  onDone: () => void,
) => {
  const { orgId } = useSelectedOrg();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isLoading } = useApiQuery<{ data: SubscriptionPlan[] }>({
    endpoint: PUBLIC_PLANS_ENDPOINT,
    method: "GET",
    queryKey: ["public-subscription-plans"],
  });

  const plans = (data?.data ?? [])
    .filter((p) => p.planId !== currentPlanId)
    .sort((a, b) => a.price - b.price);

  const selectedPlan = plans.find((p) => p.planId === selectedPlanId) || null;

  const { mutateAsync: createOrderMutate } = useApiMutation();
  const { mutateAsync: verifyMutate } = useApiMutation({
    queryKey: [[SUBSCRIPTION_QUERY_KEY], ["payment-history"]],
  });
  const { mutate: downgradeMutate, isPending: isDowngrading } = useApiMutation({
    queryKey: [SUBSCRIPTION_QUERY_KEY],
  });

  const upgrade = async () => {
    if (!orgId || !selectedPlan) return;
    setIsProcessing(true);

    let order: CreateOrderResponse;
    try {
      order = ((await createOrderMutate({
        method: "post",
        endpoint: UPGRADE_CREATE_ORDER_ENDPOINT(orgId),
        body: { planId: selectedPlan.planId },
      })) as any).data as CreateOrderResponse;
    } catch {
      setIsProcessing(false);
      return;
    }

    openRazorpayCheckout({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      description: `Upgrade to ${selectedPlan.planName}`,
      onSuccess: async (result) => {
        try {
          await verifyMutate({
            method: "post",
            endpoint: UPGRADE_VERIFY_ENDPOINT(orgId),
            body: {
              orderId: result.razorpay_order_id,
              paymentId: result.razorpay_payment_id,
              signature: result.razorpay_signature,
            },
          });
          successMsg("Subscription upgraded successfully.");
          onDone();
        } finally {
          setIsProcessing(false);
        }
      },
      onDismiss: () => setIsProcessing(false),
    });
  };

  const downgrade = () => {
    if (!orgId || !selectedPlan) return;
    downgradeMutate(
      {
        method: "put",
        endpoint: DOWNGRADE_ENDPOINT(orgId),
        body: { planId: selectedPlan.planId },
      },
      {
        onSuccess: () => {
          successMsg(
            `Your plan will change to ${selectedPlan.planName} at the end of the current billing period.`,
          );
          onDone();
        },
      },
    );
  };

  return {
    plans,
    isLoading,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlan,
    upgrade,
    downgrade,
    isProcessing: isProcessing || isDowngrading,
  };
};
