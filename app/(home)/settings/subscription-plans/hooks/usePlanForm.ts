"use client";

import { useEffect, useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import {
  CREATE_PLAN_ENDPOINT,
  UPDATE_PLAN_ENDPOINT,
} from "../api/subscriptionPlans.api";
import type {
  PlanFormPayload,
  SubscriptionPlan,
} from "../types/subscriptionPlans.types";

const PLANS_QUERY_KEY = "subscription-plans";

const emptyForm = (): PlanFormPayload => ({
  planName: "",
  planCode: "",
  description: "",
  price: 0,
  currency: "INR",
  billingCycle: "MONTHLY",
  maxStudents: null,
  maxTrainers: null,
  maxCourses: null,
  maxGroups: null,
  maxAdmins: null,
  storageGB: null,
  attendanceEnabled: false,
  assignmentEnabled: false,
  certificateEnabled: false,
  liveClassEnabled: false,
  discussionForumEnabled: false,
  aiEnabled: false,
  brandingEnabled: false,
  whiteLabelEnabled: false,
  customDomainEnabled: false,
});

export const usePlanForm = (editingPlan: SubscriptionPlan | null) => {
  const [form, setForm] = useState<PlanFormPayload>(emptyForm());

  useEffect(() => {
    if (editingPlan) {
      const { planId, status, ...rest } = editingPlan;
      setForm(rest);
    } else {
      setForm(emptyForm());
    }
  }, [editingPlan]);

  const update = (patch: Partial<PlanFormPayload>) =>
    setForm((f) => ({ ...f, ...patch }));

  const { mutate, isPending } = useApiMutation({
    queryKey: [PLANS_QUERY_KEY],
  });

  const validate = (): string | null => {
    if (!form.planName.trim()) return "Please enter the plan name.";
    if (!form.planCode.trim()) return "Please enter the plan code.";
    if (form.price < 0) return "Price cannot be negative.";
    if (!form.billingCycle.trim()) return "Please enter the billing cycle.";
    return null;
  };

  const submit = (onDone: () => void) => {
    const isEditing = !!editingPlan;
    mutate(
      {
        method: isEditing ? "put" : "post",
        endpoint: isEditing
          ? UPDATE_PLAN_ENDPOINT(editingPlan!.planId)
          : CREATE_PLAN_ENDPOINT,
        body: form,
      },
      {
        onSuccess: () => {
          successMsg(
            isEditing
              ? "Plan updated successfully."
              : "Plan created successfully.",
          );
          onDone();
        },
      },
    );
  };

  return { form, update, validate, submit, isPending };
};
