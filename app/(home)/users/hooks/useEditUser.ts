"use client";

import { useEffect, useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { UPDATEUSER } from "../api/user.api";
import type { UserDetail } from "../types/user.types";

export interface EditUserFormState {
  name: string;
  gender: string;
  contactNo: string;
}

export interface OnboardingAnswerDraft {
  fieldId?: number;
  label: string;
  type: string;
  value: string;
}

const FILE_TYPES = ["FILE", "IMAGE"];

const toFormState = (user: UserDetail | null): EditUserFormState => ({
  name: user?.name || "",
  gender: user?.gender || "",
  contactNo: user?.contactNo || "",
});

// File/image fields aren't part of the onboardingAnswers text-value contract
// (no upload endpoint for them here), so they're excluded from editing.
const toOnboardingDrafts = (user: UserDetail | null): OnboardingAnswerDraft[] =>
  user?.onboarding?.sections?.flatMap((section) =>
    section.fields
      .filter((f) => !FILE_TYPES.includes(f.type))
      .map((f) => ({
        fieldId: f.fieldId,
        label: f.label,
        type: f.type,
        value: f.value,
      })),
  ) || [];

export const useEditUser = (user: UserDetail | null, onSuccess: () => void) => {
  const [form, setForm] = useState<EditUserFormState>(toFormState(user));
  const [onboardingAnswers, setOnboardingAnswers] = useState<
    OnboardingAnswerDraft[]
  >(toOnboardingDrafts(user));
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditUserFormState, string>>
  >({});

  useEffect(() => {
    setForm(toFormState(user));
    setOnboardingAnswers(toOnboardingDrafts(user));
    setErrors({});
  }, [user]);

  const update = (patch: Partial<EditUserFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const updateOnboardingAnswer = (index: number, value: string) =>
    setOnboardingAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, value } : a)),
    );

  const { mutate, isPending } = useApiMutation({
    queryKey: [["users"], ["user-details"]],
  });

  const validate = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.contactNo.trim()) next.contactNo = "Phone number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!user || !validate()) return;

    const data = {
      userId: user.userId,
      name: form.name,
      gender: form.gender,
      contactNo: form.contactNo,
      // Fields the "/user/details" response hasn't given a fieldId for yet
      // are skipped, since the update contract keys answers by fieldId.
      onboardingAnswers: onboardingAnswers
        .filter(
          (a): a is OnboardingAnswerDraft & { fieldId: number } =>
            a.fieldId != null,
        )
        .map((a) => ({ fieldId: a.fieldId, value: a.value })),
    };

    mutate(
      { method: "put", endpoint: UPDATEUSER(), body: data },
      {
        onSuccess: () => {
          successMsg("User updated successfully.");
          onSuccess();
        },
      },
    );
  };

  return {
    form,
    update,
    errors,
    onboardingAnswers,
    updateOnboardingAnswer,
    submit,
    isPending,
  };
};
