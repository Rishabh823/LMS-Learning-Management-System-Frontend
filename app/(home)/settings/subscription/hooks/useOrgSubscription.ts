"use client";

import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { successMsg } from "@/utils/notify";
import { openRazorpayCheckout } from "@/shared/subscription/razorpay";
import {
  CANCEL_ENDPOINT,
  RENEW_CREATE_ORDER_ENDPOINT,
  RENEW_VERIFY_ENDPOINT,
  SUBSCRIPTION_ENDPOINT,
} from "../api/subscription.api";
import type {
  CreateOrderResponse,
  OrgSubscriptionResponse,
} from "../types/subscription.types";

const SUBSCRIPTION_QUERY_KEY = "org-subscription";

export const useOrgSubscription = () => {
  const { orgId } = useSelectedOrg();

  const { data, isLoading, refetch } = useApiQuery<OrgSubscriptionResponse>({
    endpoint: orgId ? SUBSCRIPTION_ENDPOINT(orgId) : "",
    method: "GET",
    queryKey: [SUBSCRIPTION_QUERY_KEY, orgId],
    enabled: !!orgId,
  });

  const subscription = data?.data ?? null;

  const { mutate: cancelMutate, isPending: isCancelling } = useApiMutation({
    queryKey: [SUBSCRIPTION_QUERY_KEY],
  });

  const cancelSubscription = (onDone?: () => void) => {
    if (!orgId) return;
    cancelMutate(
      { method: "put", endpoint: CANCEL_ENDPOINT(orgId) },
      {
        onSuccess: () => {
          successMsg("Subscription cancelled successfully.");
          onDone?.();
        },
      },
    );
  };

  const { mutateAsync: renewCreateOrder } = useApiMutation();
  const { mutateAsync: renewVerify } = useApiMutation({
    queryKey: [[SUBSCRIPTION_QUERY_KEY], ["payment-history"]],
  });

  const renewSubscription = async (setPending: (pending: boolean) => void) => {
    if (!orgId) return;
    setPending(true);
    let order: CreateOrderResponse;
    try {
      order = (
        (await renewCreateOrder({
          method: "post",
          endpoint: RENEW_CREATE_ORDER_ENDPOINT(orgId),
        })) as any
      ).data as CreateOrderResponse;
    } catch {
      setPending(false);
      return;
    }

    openRazorpayCheckout({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      description: `${subscription?.planName || "Subscription"} renewal`,
      onSuccess: async (result) => {
        try {
          await renewVerify({
            method: "post",
            endpoint: RENEW_VERIFY_ENDPOINT(orgId),
            body: {
              orderId: result.razorpay_order_id,
              paymentId: result.razorpay_payment_id,
              signature: result.razorpay_signature,
            },
          });
          successMsg("Subscription renewed successfully.");
        } finally {
          setPending(false);
        }
      },
      onDismiss: () => setPending(false),
    });
  };

  return {
    orgId,
    subscription,
    isLoading,
    refetch,
    cancelSubscription,
    isCancelling,
    renewSubscription,
  };
};
