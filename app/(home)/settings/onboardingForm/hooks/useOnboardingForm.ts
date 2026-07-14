"use client";

import { useEffect, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { useSelectedOrg } from "@/providers/SelectedOrgProvider";
import { successMsg } from "@/utils/notify";
import {
  CREATEFORM,
  GETFORMBYORG,
  GETMYFORM,
  PUBLISHFORM,
  UNPUBLISHFORM,
  UPDATEFORM,
} from "../api/onboardingForm.api";
import type {
  FieldOption,
  FieldType,
  FormField,
  FormSection,
  OnboardingForm,
  OnboardingFormResponse,
} from "../types/onboardingForm.types";

const EMPTY_FIELD = (displayOrder: number): FormField => ({
  label: "",
  fieldName: "",
  fieldType: "TEXT",
  required: false,
  displayOrder,
  options: [],
});

const EMPTY_SECTION = (displayOrder: number): FormSection => ({
  title: "",
  description: "",
  displayOrder,
  fields: [EMPTY_FIELD(1)],
});

const withOrder = <T extends { displayOrder: number }>(items: T[]): T[] =>
  items.map((item, i) => ({ ...item, displayOrder: i + 1 }));

export const useOnboardingForm = () => {
  const { orgId, isAdmin } = useSelectedOrg();

  const canEdit = !isAdmin;

  const endpoint = isAdmin ? (orgId ? GETFORMBYORG(orgId) : "") : GETMYFORM();
  const enabled = !!orgId;

  const { data, isLoading, refetch } = useApiQuery<OnboardingFormResponse>({
    endpoint,
    method: "GET",
    queryKey: ["onboarding-form", isAdmin ? orgId : "me"],
    enabled,
  });

  const fetchedForm = data?.data ?? null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<FormSection[]>([EMPTY_SECTION(1)]);

  useEffect(() => {
    if (fetchedForm) {
      setTitle(fetchedForm.title || "");
      setDescription(fetchedForm.description || "");
      setSections(
        fetchedForm.sections?.length
          ? fetchedForm.sections
          : [EMPTY_SECTION(1)],
      );
    }
  }, [fetchedForm]);

  // --- Section builders ---

  const addSection = () =>
    setSections((prev) => [...prev, EMPTY_SECTION(prev.length + 1)]);

  const removeSection = (index: number) =>
    setSections((prev) => withOrder(prev.filter((_, i) => i !== index)));

  const updateSection = (index: number, patch: Partial<FormSection>) =>
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    setSections((prev) => {
      const next = [...prev];
      [next[index], next[targetIdx]] = [next[targetIdx], next[index]];
      return withOrder(next);
    });
  };

  // --- Field builders ---

  const addField = (sectionIndex: number) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? { ...s, fields: [...s.fields, EMPTY_FIELD(s.fields.length + 1)] }
          : s,
      ),
    );

  const removeField = (sectionIndex: number, fieldIndex: number) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              fields: withOrder(s.fields.filter((_, fi) => fi !== fieldIndex)),
            }
          : s,
      ),
    );

  const updateField = (
    sectionIndex: number,
    fieldIndex: number,
    patch: Partial<FormField>,
  ) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              fields: s.fields.map((f, fi) =>
                fi === fieldIndex ? { ...f, ...patch } : f,
              ),
            }
          : s,
      ),
    );

  const moveField = (
    sectionIndex: number,
    fieldIndex: number,
    direction: "up" | "down",
  ) => {
    const section = sections[sectionIndex];
    const targetIdx = direction === "up" ? fieldIndex - 1 : fieldIndex + 1;
    if (targetIdx < 0 || targetIdx >= section.fields.length) return;
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== sectionIndex) return s;
        const next = [...s.fields];
        [next[fieldIndex], next[targetIdx]] = [
          next[targetIdx],
          next[fieldIndex],
        ];
        return { ...s, fields: withOrder(next) };
      }),
    );
  };

  // --- Option builders ---

  const addOption = (sectionIndex: number, fieldIndex: number) =>
    updateField(sectionIndex, fieldIndex, {
      options: [
        ...sections[sectionIndex].fields[fieldIndex].options,
        {
          label: "",
          value: "",
          displayOrder:
            sections[sectionIndex].fields[fieldIndex].options.length + 1,
        } as FieldOption,
      ],
    });

  const removeOption = (
    sectionIndex: number,
    fieldIndex: number,
    optionIndex: number,
  ) =>
    updateField(sectionIndex, fieldIndex, {
      options: withOrder(
        sections[sectionIndex].fields[fieldIndex].options.filter(
          (_, oi) => oi !== optionIndex,
        ),
      ),
    });

  const updateOption = (
    sectionIndex: number,
    fieldIndex: number,
    optionIndex: number,
    patch: Partial<FieldOption>,
  ) =>
    updateField(sectionIndex, fieldIndex, {
      options: sections[sectionIndex].fields[fieldIndex].options.map((o, oi) =>
        oi === optionIndex ? { ...o, ...patch } : o,
      ),
    });

  const onFieldTypeChange = (
    sectionIndex: number,
    fieldIndex: number,
    fieldType: FieldType,
  ) =>
    updateField(sectionIndex, fieldIndex, {
      fieldType,
      options:
        fieldType === "SELECT" || fieldType === "RADIO"
          ? sections[sectionIndex].fields[fieldIndex].options
          : [],
    });

  // --- Save / Publish ---

  const buildPayload = (): OnboardingForm => ({
    title,
    description,
    sections: sections.map((s) => ({
      title: s.title,
      description: s.description,
      displayOrder: s.displayOrder,
      fields: s.fields.map((f) => ({
        label: f.label,
        fieldName: f.fieldName,
        fieldType: f.fieldType,
        required: f.required,
        displayOrder: f.displayOrder,
        options: f.options.map((o) => ({
          label: o.label,
          value: o.value,
          displayOrder: o.displayOrder,
        })),
      })),
    })),
  });

  const { mutate: saveMutate, isPending: isSaving } = useApiMutation({
    queryKey: ["onboarding-form"],
  });

  const isExistingForm = !!fetchedForm?.formId;

  const save = () => {
    const body = buildPayload();
    saveMutate(
      {
        method: isExistingForm ? "put" : "post",
        endpoint: isExistingForm ? UPDATEFORM() : CREATEFORM(),
        body,
      },
      {
        onSuccess: () => {
          successMsg(
            isExistingForm
              ? "Onboarding form updated successfully."
              : "Onboarding form created successfully.",
          );
        },
      },
    );
  };

  const { mutate: publishMutate, isPending: isPublishing } = useApiMutation({
    queryKey: ["onboarding-form"],
  });

  const publish = () => {
    publishMutate(
      { method: "put", endpoint: PUBLISHFORM() },
      {
        onSuccess: () => {
          successMsg("Onboarding form published successfully.");
        },
      },
    );
  };

  const { mutate: unpublishMutate, isPending: isUnpublishing } =
    useApiMutation({
      queryKey: ["onboarding-form"],
    });

  const unpublish = () => {
    unpublishMutate(
      { method: "put", endpoint: UNPUBLISHFORM() },
      {
        onSuccess: () => {
          successMsg("Onboarding form unpublished successfully.");
        },
      },
    );
  };

  const isPublished = fetchedForm?.status === "PUBLISHED";

  return {
    isAdmin,
    canEdit,
    orgId,
    isLoading,
    fetchedForm,
    isExistingForm,
    title,
    setTitle,
    description,
    setDescription,
    sections,
    addSection,
    removeSection,
    updateSection,
    moveSection,
    addField,
    removeField,
    updateField,
    moveField,
    addOption,
    removeOption,
    updateOption,
    onFieldTypeChange,
    save,
    isSaving,
    publish,
    isPublishing,
    unpublish,
    isUnpublishing,
    isPublished,
  };
};
