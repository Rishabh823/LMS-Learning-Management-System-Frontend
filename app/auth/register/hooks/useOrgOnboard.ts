"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { errorMsg, successMsg } from "@/utils/notify";
import {
  setAuthToken,
  setOrgId,
  setRole,
  setUserId,
} from "@/utils/cookieManager";
import { openRazorpayCheckout } from "@/shared/subscription/razorpay";
import type { SubscriptionPlan } from "@/shared/subscription/types";
import {
  ORGANIZATION_REGISTER_ENDPOINT,
  PAYMENTS_CREATE_ORDER_ENDPOINT,
  PAYMENTS_VERIFY_ENDPOINT,
  PUBLIC_PLANS_ENDPOINT,
} from "../api/register.api";
import type {
  AdminInfoPayload,
  CreateOrderResponse,
  OrgRegisterFormData,
  OrgRegisterResponse,
  OrganizationInfoPayload,
} from "../types/register.types";
import {
  validateOrgField,
  type OrgOnboardField,
} from "../schema/orgOnboard.schema";

const STEP_LABELS = [
  "Select Plan",
  "Organization Details",
  "Admin Details",
  "Review & Submit",
];

const initialFormData: OrgRegisterFormData = {
  organizationName: "",
  legalBusinessName: "",
  organizationType: "",
  industry: "",
  companySize: "",
  registrationNumber: "",
  gstNumber: "",
  panNumber: "",
  website: "",
  description: "",

  adminName: "",
  adminEmail: "",
  adminPhone: "",
  gender: "",
  password: "",
  confirmPassword: "",
  designation: "",
  department: "",
};

export const useOrgOnboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // A planId in the URL means the user already picked a plan on /pricing (or
  // was routed here from the role-chooser with one carried over) — read it
  // synchronously so the wizard can skip its own "Select Plan" step on the
  // very first render instead of flashing it before jumping forward.
  const planIdParam = searchParams.get("planId");
  const skipPlanStep = !!planIdParam;

  const [formData, setFormData] =
    useState<OrgRegisterFormData>(initialFormData);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(
    planIdParam ? Number(planIdParam) : null,
  );
  const [submitting, setSubmitting] = useState(false);

  // Real-time, per-field validation: as soon as the user types into a field,
  // it's re-checked against its pattern on every keystroke from then on — an
  // invalid email/GST/PAN/etc. shows its error immediately instead of
  // waiting for blur or for "Continue" to be pressed.
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<OrgOnboardField, string>>
  >({});

  const upd = (patch: Partial<OrgRegisterFormData>) => {
    setFormData((f) => {
      const next = { ...f, ...patch };
      const changedFields = Object.keys(patch) as OrgOnboardField[];

      const nextErrors: Partial<Record<OrgOnboardField, string>> = {};
      changedFields.forEach((field) => {
        nextErrors[field] = validateOrgField(
          field,
          String(next[field] ?? ""),
          next,
        );
      });
      // Confirm-password depends on password — re-check it live too whenever
      // password itself changes, as long as confirm-password has any value
      // yet (no point flagging it before the user has reached it).
      if (
        "password" in patch &&
        !("confirmPassword" in patch) &&
        next.confirmPassword
      ) {
        nextErrors.confirmPassword = validateOrgField(
          "confirmPassword",
          next.confirmPassword,
          next,
        );
      }

      setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
      return next;
    });
  };

  const onFieldBlur = (field: OrgOnboardField) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: validateOrgField(field, String(formData[field] ?? ""), formData),
    }));
  };

  const { data: plansRes, isLoading: plansLoading } = useApiQuery<{
    data: SubscriptionPlan[];
  }>({
    endpoint: PUBLIC_PLANS_ENDPOINT,
    method: "GET",
    queryKey: ["public-subscription-plans"],
  });

  const plans = (plansRes?.data ?? [])
    .slice()
    .sort((a, b) => a.price - b.price);

  const selectedPlan = plans.find((p) => p.planId === selectedPlanId) || null;

  const { mutateAsync: registerMutate } = useApiMutation();
  const { mutateAsync: createOrderMutate } = useApiMutation();
  const { mutateAsync: verifyMutate } = useApiMutation();

  // Kept in sync with the same per-field rules the live inline errors use
  // (validateOrgField), so "Continue"/"Submit" can never be pressed past a
  // field the user hasn't actually fixed yet.
  const STEP_FIELDS: Record<number, OrgOnboardField[]> = {
    2: [
      "organizationName",
      "legalBusinessName",
      "organizationType",
      "industry",
      "companySize",
      "registrationNumber",
      "gstNumber",
      "panNumber",
      "website",
    ],
    3: [
      "adminName",
      "adminEmail",
      "adminPhone",
      "gender",
      "password",
      "confirmPassword",
    ],
  };

  const validate = (step: number): string | null => {
    if (step === 1) {
      if (!selectedPlanId) return "Please select a subscription plan.";
      return null;
    }

    const fields = STEP_FIELDS[step];
    if (!fields) return null;

    // Computed directly off `formData` (not inside the setFieldErrors
    // updater) so the result can be returned synchronously below — React
    // doesn't run a functional setState's updater immediately, so reading a
    // variable it was supposed to set would still see the old value here.
    const stepErrors: Partial<Record<OrgOnboardField, string>> = {};
    let firstError: string | null = null;
    fields.forEach((field) => {
      const message = validateOrgField(
        field,
        String(formData[field] ?? ""),
        formData,
      );
      stepErrors[field] = message;
      if (message && !firstError) firstError = message;
    });

    // Reveal every field's error on this step (not just the first one) so
    // fields the user never touched still show what's wrong, not only the
    // one reported by the toast.
    setFieldErrors((prev) => ({ ...prev, ...stepErrors }));

    return firstError;
  };

  const buildOrganizationPayload = (): OrganizationInfoPayload => ({
    organizationName: formData.organizationName,
    legalBusinessName: formData.legalBusinessName,
    organizationType: formData.organizationType,
    industry: formData.industry,
    companySize: formData.companySize,
    registrationNumber: formData.registrationNumber,
    gstNumber: formData.gstNumber || undefined,
    panNumber: formData.panNumber || undefined,
    website: formData.website || undefined,
    description: formData.description || undefined,
  });

  const buildAdminPayload = (): AdminInfoPayload => ({
    adminName: formData.adminName,
    adminEmail: formData.adminEmail,
    adminPhone: formData.adminPhone,
    gender: formData.gender,
    password: formData.password,
    designation: formData.designation || undefined,
    department: formData.department || undefined,
  });

  const onRegisterSuccess = (data: OrgRegisterResponse) => {
    if (data?.token) setAuthToken(data.token);
    if (data?.role) setRole(data.role);
    if (data?.organizationId != null) setOrgId(String(data.organizationId));
    if (data?.userId != null) setUserId(String(data.userId));
    successMsg(
      data?.message || "Your organization has been registered successfully.",
    );
    router.push("/dashboard");
  };

  const handleSubmit = async () => {
    if (!selectedPlan) {
      errorMsg("Please select a subscription plan.");
      return;
    }

    setSubmitting(true);

    if (selectedPlan.price === 0) {
      try {
        const res = await registerMutate({
          method: "post",
          endpoint: ORGANIZATION_REGISTER_ENDPOINT,
          body: {
            planId: selectedPlan.planId,
            organization: buildOrganizationPayload(),
            admin: buildAdminPayload(),
          },
        });
        onRegisterSuccess((res as any).data as OrgRegisterResponse);
      } catch {
        // Error toast is already shown by the axios interceptor.
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Paid plan: create the order, then hand off to Razorpay. `submitting`
    // stays true (button disabled) until the checkout modal's success or
    // dismiss/failure callback settles it, so the user can't double-submit
    // while Razorpay is open.
    let order: CreateOrderResponse;
    try {
      order = (
        (await createOrderMutate({
          method: "post",
          endpoint: PAYMENTS_CREATE_ORDER_ENDPOINT,
          body: { planId: selectedPlan.planId },
        })) as any
      ).data as CreateOrderResponse;
    } catch {
      setSubmitting(false);
      return;
    }

    openRazorpayCheckout({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      description: `${selectedPlan.planName} subscription`,
      prefillName: formData.adminName,
      prefillEmail: formData.adminEmail,
      prefillContact: formData.adminPhone,
      onSuccess: async (result) => {
        try {
          const res = await verifyMutate({
            method: "post",
            endpoint: PAYMENTS_VERIFY_ENDPOINT,
            body: {
              orderId: result.razorpay_order_id,
              paymentId: result.razorpay_payment_id,
              signature: result.razorpay_signature,
              planId: selectedPlan.planId,
              organization: buildOrganizationPayload(),
              admin: buildAdminPayload(),
            },
          });
          onRegisterSuccess((res as any).data as OrgRegisterResponse);
        } catch {
          // Error toast is already shown by the axios interceptor; keep the
          // user on the form with everything they entered still intact.
          setSubmitting(false);
        }
      },
      onDismiss: () => setSubmitting(false),
    });
  };

  return {
    formData,
    upd,
    plans,
    plansLoading,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlan,
    stepLabels: STEP_LABELS,
    validate,
    handleSubmit,
    submitting,
    skipPlanStep,
    fieldErrors,
    onFieldBlur,
  };
};
