"use client";

import { useEffect, useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { UPDATEPAGE } from "../api/developerSettings.api";
import type { PageRole, SectionPage } from "../types/developerSettings.types";

export interface EditPageFormState {
  pageName: string;
  pageUrl: string;
  roles: PageRole[];
}

const toFormState = (page: SectionPage | null): EditPageFormState => ({
  pageName: page?.pageName || "",
  pageUrl: page?.pageUrl || "",
  roles: page?.roles || [],
});

export const useEditPage = (
  page: SectionPage | null,
  onSuccess: () => void,
  refetchSidebar: () => void,
) => {
  const [form, setForm] = useState<EditPageFormState>(toFormState(page));
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditPageFormState, string>>
  >({});

  useEffect(() => {
    setForm(toFormState(page));
    setErrors({});
  }, [page]);

  const update = (patch: Partial<EditPageFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const { mutate, isPending } = useApiMutation({ queryKey: ["dev-sections"] });

  const validate = () => {
    const next: typeof errors = {};
    if (!form.pageName.trim()) next.pageName = "Page name is required";
    if (!form.pageUrl.trim()) next.pageUrl = "Page URL is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!page || !validate()) return;

    mutate(
      {
        method: "put",
        endpoint: UPDATEPAGE(page.id),
        body: { sectionId: page.sectionId, ...form },
      },
      {
        onSuccess: () => {
          successMsg("Page updated successfully.");
          onSuccess();
          refetchSidebar();
        },
      },
    );
  };

  return { form, update, errors, submit, isPending };
};
