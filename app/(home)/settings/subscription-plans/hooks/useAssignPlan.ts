"use client";

import { useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelect } from "@/utils/useSelect";
import { successMsg } from "@/utils/notify";
import {
  ASSIGN_PLAN_ENDPOINT,
  ORG_LIST_ENDPOINT,
} from "../api/subscriptionPlans.api";

export const useAssignPlan = () => {
  const [organizationId, setOrganizationId] = useState<string | number | null>(
    null,
  );
  const [planId, setPlanId] = useState<number | null>(null);

  const { options: orgOptions, isLoading: orgListLoading } = useSelect(
    ORG_LIST_ENDPOINT,
    "GET",
    { labelKey: "fullName", valueKey: "organizationId" },
  );

  const { mutate, isPending } = useApiMutation({
    queryKey: [["organizations"], ["org-subscription"]],
  });

  const reset = () => {
    setOrganizationId(null);
    setPlanId(null);
  };

  const assign = (onDone: () => void) => {
    if (!organizationId || !planId) return;
    mutate(
      {
        method: "post",
        endpoint: ASSIGN_PLAN_ENDPOINT,
        body: { organizationId, planId },
      },
      {
        onSuccess: () => {
          successMsg("Plan assigned successfully.");
          reset();
          onDone();
        },
      },
    );
  };

  return {
    organizationId,
    setOrganizationId,
    planId,
    setPlanId,
    orgOptions,
    orgListLoading,
    assign,
    isPending,
    reset,
  };
};
