"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelect } from "@/utils/useSelect";
import { successMsg } from "@/utils/notify";
import {
  ORG_LIST_ENDPOINT,
  orgFormEndpoint,
  registerFormEndpoint,
  UPLOADFIELDFILE,
} from "../api/register.api";
import {
  userAccountSchema,
  orgSelectSchema,
} from "../schema/userOnboard.schema";
import type {
  FormAnswers,
  FormFieldFiles,
  OrgForm,
  RegisterAnswer,
  UserOnboardFormData,
} from "../types/register.types";

const initialFormData: UserOnboardFormData = {
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  password: "",
  confirmPassword: "",
  orgId: "",
  orgName: "",
};

export const useUserOnboard = () => {
  const router = useRouter();
  const [formData, setFormData] =
    useState<UserOnboardFormData>(initialFormData);
  const [formAnswers, setFormAnswers] = useState<FormAnswers>({});
  const [fieldFiles, setFieldFiles] = useState<FormFieldFiles>({});

  const upd = (patch: Partial<UserOnboardFormData>) =>
    setFormData((f) => ({ ...f, ...patch }));

  const updAnswer = (fieldId: number, value: string) =>
    setFormAnswers((a) => ({ ...a, [fieldId]: value }));

  const updFile = (fieldId: number, file: File) => {
    setFieldFiles((f) => ({ ...f, [fieldId]: file }));
    setFormAnswers((a) => ({ ...a, [fieldId]: file.name }));
  };

  const { options: orgOptions, isLoading: orgListLoading } = useSelect(
    ORG_LIST_ENDPOINT,
    "GET",
    {
      labelKey: "fullName",
      valueKey: "organizationId",
    },
  );

  const { data: orgFormRes, isLoading: formLoading } = useApiQuery<{
    data: OrgForm;
  }>({
    endpoint: formData.orgId ? orgFormEndpoint(formData.orgId) : "",
    method: "GET",
    queryKey: ["org-form", formData.orgId],
    enabled: !!formData.orgId,
  });
  const orgForm = orgFormRes?.data;
  const sections = orgForm?.sections || [];

  const stepLabels = [
    "Create Account",
    "Select Organization",
    ...sections
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((s) => s.title),
    "Review & Submit",
  ];

  const { mutate, isPending } = useApiMutation();
  const { mutateAsync: uploadFieldFile } = useApiMutation();

  const validate = (step: number): string | null => {
    if (step === 1) {
      const result = userAccountSchema.safeParse(formData);
      return result.success
        ? null
        : result.error.issues[0]?.message || "Please check your details.";
    }
    if (step === 2) {
      const result = orgSelectSchema.safeParse(formData);
      if (!result.success)
        return (
          result.error.issues[0]?.message || "Please select an organization."
        );
      if (formLoading) return "Loading organization form, please wait…";
      if (!orgForm)
        return "Could not load organization form. Please try again.";
    }
    if (step >= 3 && sections.length > 0) {
      const sectionIdx = step - 3;
      if (sectionIdx < sections.length) {
        for (const field of sections[sectionIdx].fields.filter(
          (f) => !f.hidden,
        )) {
          if (field.required && !formAnswers[field.id]?.toString().trim()) {
            return `Please fill in "${field.label}".`;
          }
        }
      }
    }
    return null;
  };

  const handleSubmit = () => {
    if (!orgForm) return;

    const answers: RegisterAnswer[] = Object.entries(formAnswers).map(
      ([fieldId, value]) => ({
        fieldId: Number(fieldId),
        value: String(value),
      }),
    );

    mutate(
      {
        method: "post",
        endpoint: registerFormEndpoint(orgForm.formId),
        body: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone || "",
          gender: formData.gender || "Male",
          password: formData.password,
          answers,
        },
      },
      {
        onSuccess: async (data: { message?: string }) => {
          // The register endpoint only accepts plain-value answers — any
          // FILE/IMAGE field's actual file is uploaded separately afterward,
          // one request per fieldId.
          for (const [fieldId, file] of Object.entries(fieldFiles)) {
            const fileData = new FormData();
            fileData.append("fieldId", fieldId);
            fileData.append("file", file);
            await uploadFieldFile({
              method: "post",
              endpoint: UPLOADFIELDFILE(),
              body: fileData,
              config: { headers: { "Content-Type": "multipart/form-data" } },
            });
          }

          successMsg(
            data?.message || "Your account has been registered successfully.",
          );
          router.push("/auth/login");
        },
      },
    );
  };

  return {
    formData,
    upd,
    formAnswers,
    updAnswer,
    updFile,
    orgOptions,
    orgListLoading,
    orgForm,
    sections,
    formLoading,
    stepLabels,
    validate,
    handleSubmit,
    isPending,
  };
};
