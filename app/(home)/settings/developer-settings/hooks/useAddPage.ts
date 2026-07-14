"use client";

import { useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { ADDPAGE } from "../api/developerSettings.api";
import type { PageRole } from "../types/developerSettings.types";

export interface AddPageFormState {
  pageName: string;
  pageUrl: string;
  roles: PageRole[];
}

const INITIAL_STATE: AddPageFormState = {
  pageName: "",
  pageUrl: "",
  roles: [],
};

export const useAddPage = (
  sectionId: number | null,
  onSuccess: () => void,
  refetchSidebar: () => void,
) => {
  const [form, setForm] = useState<AddPageFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddPageFormState, string>>
  >({});

  const update = (patch: Partial<AddPageFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const reset = () => {
    setForm(INITIAL_STATE);
    setErrors({});
  };

  const { mutate, isPending } = useApiMutation({ queryKey: ["dev-sections"] });

  const validate = () => {
    const next: typeof errors = {};
    if (!form.pageName.trim()) next.pageName = "Page name is required";
    if (!form.pageUrl.trim()) next.pageUrl = "Page URL is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (sectionId == null || !validate()) return;

    mutate(
      {
        method: "post",
        endpoint: ADDPAGE(),
        body: { sectionId, ...form },
      },
      {
        onSuccess: () => {
          successMsg("Page added successfully.");
          reset();
          onSuccess();
          refetchSidebar();
        },
      },
    );
  };

  return { form, update, errors, submit, isPending, reset };
};
