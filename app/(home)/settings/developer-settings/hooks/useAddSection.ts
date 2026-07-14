"use client";

import { useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { CREATESECTIONPAGE } from "../api/developerSettings.api";
import type { PageRole } from "../types/developerSettings.types";

export interface SectionPageRow {
  pageName: string;
  pageUrl: string;
  roles: PageRole[];
}

const emptyRow = (): SectionPageRow => ({
  pageName: "",
  pageUrl: "",
  roles: [],
});

export const useAddSection = (
  onSuccess: () => void,
  refetchSidebar: () => void,
) => {
  const [sectionName, setSectionName] = useState("");
  const [pages, setPages] = useState<SectionPageRow[]>([emptyRow()]);
  const [errors, setErrors] = useState<{
    sectionName?: string;
    pages?: string;
  }>({});

  const addRow = () => setPages((p) => [...p, emptyRow()]);

  const removeRow = (index: number) =>
    setPages((p) => (p.length > 1 ? p.filter((_, i) => i !== index) : p));

  const updateRow = (index: number, patch: Partial<SectionPageRow>) =>
    setPages((p) =>
      p.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );

  const reset = () => {
    setSectionName("");
    setPages([emptyRow()]);
    setErrors({});
  };

  const { mutate, isPending } = useApiMutation({ queryKey: ["dev-sections"] });

  const validate = () => {
    const next: typeof errors = {};
    if (!sectionName.trim()) next.sectionName = "Section name is required";
    if (pages.some((p) => !p.pageName.trim() || !p.pageUrl.trim()))
      next.pages = "Every page needs a name and a URL";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    mutate(
      {
        method: "post",
        endpoint: CREATESECTIONPAGE(),
        body: { sectionName, pages },
      },
      {
        onSuccess: () => {
          successMsg("Section created successfully.");
          reset();
          onSuccess();
          refetchSidebar();
        },
      },
    );
  };

  return {
    sectionName,
    setSectionName,
    pages,
    addRow,
    removeRow,
    updateRow,
    errors,
    submit,
    isPending,
    reset,
  };
};
