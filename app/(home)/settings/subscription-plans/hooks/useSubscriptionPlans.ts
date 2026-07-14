"use client";

import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import {
  ALL_PLANS_ENDPOINT,
  DELETE_PLAN_ENDPOINT,
  RUN_MAINTENANCE_ENDPOINT,
  TOGGLE_PLAN_STATUS_ENDPOINT,
} from "../api/subscriptionPlans.api";
import type {
  AllPlansResponse,
  SubscriptionPlan,
} from "../types/subscriptionPlans.types";

const PLANS_QUERY_KEY = "subscription-plans";

export const useSubscriptionPlans = () => {
  const { data, isLoading } = useApiQuery<AllPlansResponse>({
    endpoint: ALL_PLANS_ENDPOINT,
    method: "GET",
    queryKey: [PLANS_QUERY_KEY],
  });

  const plans = data?.data ?? [];

  const { mutate: toggleMutate, isPending: isTogglingStatus } = useApiMutation({
    queryKey: [PLANS_QUERY_KEY],
  });

  const toggleStatus = (plan: SubscriptionPlan) => {
    const nextActive = plan.status !== "ACTIVE";
    toggleMutate(
      {
        method: "put",
        endpoint: TOGGLE_PLAN_STATUS_ENDPOINT(plan.planId, nextActive),
      },
      {
        onSuccess: () => {
          successMsg(
            nextActive
              ? "Plan activated successfully."
              : "Plan deactivated successfully.",
          );
        },
      },
    );
  };

  const { mutate: deleteMutate, isPending: isDeleting } = useApiMutation({
    queryKey: [PLANS_QUERY_KEY],
  });

  const deletePlan = (plan: SubscriptionPlan, onDone?: () => void) => {
    deleteMutate(
      { method: "delete", endpoint: DELETE_PLAN_ENDPOINT(plan.planId) },
      {
        onSuccess: () => {
          successMsg("Plan deleted successfully.");
          onDone?.();
        },
      },
    );
  };

  const { mutate: maintenanceMutate, isPending: isRunningMaintenance } =
    useApiMutation();

  const runMaintenance = () => {
    maintenanceMutate(
      { method: "post", endpoint: RUN_MAINTENANCE_ENDPOINT },
      {
        onSuccess: (data: { message?: string }) => {
          successMsg(
            data?.message || "Maintenance run completed successfully.",
          );
        },
      },
    );
  };

  return {
    plans,
    isLoading,
    toggleStatus,
    isTogglingStatus,
    deletePlan,
    isDeleting,
    runMaintenance,
    isRunningMaintenance,
  };
};
