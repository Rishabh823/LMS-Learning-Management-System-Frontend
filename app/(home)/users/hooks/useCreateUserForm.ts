"use client";

import { useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { successMsg } from "@/utils/notify";
import {
  GETFORMBYORG,
  UPLOADFIELDFILE,
} from "@/app/(home)/settings/onboardingForm/api/onboardingForm.api";
import type { OnboardingFormResponse } from "@/app/(home)/settings/onboardingForm/types/onboardingForm.types";
import { REGISTERUSER } from "../api/user.api";

export interface CreateUserAccountState {
  name: string;
  emailId: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_ACCOUNT: CreateUserAccountState = {
  name: "",
  emailId: "",
  password: "",
  confirmPassword: "",
};

// Answers are keyed by each dynamic field's `fieldName`, since that's the
// key the onboarding-form builder itself uses (see FormField.fieldName).
export type AnswerValue = string | File;

export const useCreateUserForm = (enabled: boolean, onSuccess: () => void) => {
  // Always org-scoped — admin picks the org via the TopNav dropdown, and an
  // ORGANIZATION login gets its own org id from SelectedOrgProvider (set
  // from the login cookie), so orgId covers both cases the same way.
  const { orgId } = useSelectedOrg();

  const { data, isLoading: isLoadingForm } =
    useApiQuery<OnboardingFormResponse>({
      endpoint: orgId ? GETFORMBYORG(orgId) : "",
      method: "GET",
      queryKey: ["onboarding-form", orgId],
      enabled: enabled && !!orgId,
    });

  const form = data?.data ?? null;

  const [account, setAccount] =
    useState<CreateUserAccountState>(INITIAL_ACCOUNT);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateUserAccountState, string>>
  >({});

  const updateAccount = (patch: Partial<CreateUserAccountState>) =>
    setAccount((a) => ({ ...a, ...patch }));

  const updateAnswer = (fieldName: string, value: AnswerValue) =>
    setAnswers((prev) => ({ ...prev, [fieldName]: value }));

  const reset = () => {
    setAccount(INITIAL_ACCOUNT);
    setAnswers({});
    setErrors({});
  };

  const { mutate, isPending } = useApiMutation({ queryKey: ["users"] });
  const { mutateAsync: uploadFieldFile } = useApiMutation();

  const validate = () => {
    const next: typeof errors = {};
    if (!account.name.trim()) next.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.emailId))
      next.emailId = "Enter a valid email address";
    if (!account.password || account.password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (account.confirmPassword !== account.password)
      next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!form?.formId || !validate()) return;

    // Sent as multipart so text answers and any FILE/IMAGE uploads can share
    // one request — the exact register payload contract wasn't given beyond
    // the endpoint, so this mirrors the field-name keys the form itself uses.
    const formData = new FormData();
    formData.append("name", account.name);
    formData.append("emailId", account.emailId);
    formData.append("password", account.password);

    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const value = answers[field.fieldName];
        if (value != null) formData.append(field.fieldName, value);
      });
    });

    // Every FILE/IMAGE field's answer is uploaded separately after the
    // account itself is created, one request per fieldId — the register
    // endpoint only accepts the account + plain-value answers.
    const fileFields = form.sections.flatMap((section) =>
      section.fields.filter(
        (field) =>
          (field.fieldType === "FILE" || field.fieldType === "IMAGE") &&
          field.id != null &&
          answers[field.fieldName] instanceof File,
      ),
    );

    mutate(
      {
        method: "post",
        endpoint: REGISTERUSER(form.formId),
        body: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: async () => {
          for (const field of fileFields) {
            const fileData = new FormData();
            fileData.append("fieldId", String(field.id));
            fileData.append("file", answers[field.fieldName] as File);
            await uploadFieldFile({
              method: "post",
              endpoint: UPLOADFIELDFILE(),
              body: fileData,
              config: { headers: { "Content-Type": "multipart/form-data" } },
            });
          }
          successMsg("User created successfully.");
          reset();
          onSuccess();
        },
      },
    );
  };

  return {
    form,
    isLoadingForm,
    account,
    updateAccount,
    answers,
    updateAnswer,
    errors,
    submit,
    isPending,
    reset,
  };
};
