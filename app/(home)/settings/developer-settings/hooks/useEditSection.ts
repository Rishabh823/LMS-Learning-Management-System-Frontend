"use client";

import { useEffect, useState } from "react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { UPDATESECTION } from "../api/developerSettings.api";
import type { Section } from "../types/developerSettings.types";

export const useEditSection = (
  section: Section | null,
  onSuccess: () => void,
  refetchSidebar: () => void,
) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(section?.name || "");
    setError("");
  }, [section]);

  const { mutate, isPending } = useApiMutation({ queryKey: ["dev-sections"] });

  const submit = () => {
    if (!section) return;
    if (!name.trim()) {
      setError("Section name is required");
      return;
    }

    mutate(
      {
        method: "put",
        endpoint: UPDATESECTION(section.id),
        body: { name, status: section.status },
      },
      {
        onSuccess: () => {
          successMsg("Section updated successfully.");
          onSuccess();
          refetchSidebar();
        },
      },
    );
  };

  return { name, setName, error, submit, isPending };
};
