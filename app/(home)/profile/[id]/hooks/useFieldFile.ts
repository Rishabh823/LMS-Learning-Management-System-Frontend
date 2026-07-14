"use client";

import { useEffect, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { GETFIELDFILE } from "@/app/(home)/settings/onboardingForm/api/onboardingForm.api";

export const useFieldFile = (fieldId: number | null, enabled: boolean) => {
  const { data: blob, isLoading } = useApiQuery<Blob>({
    endpoint: fieldId != null ? GETFIELDFILE(fieldId) : "",
    method: "GET",
    queryKey: ["field-file", fieldId],
    enabled: enabled && fieldId != null,
    config: { responseType: "blob" },
  });

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob || blob.size === 0) {
      setFileUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    setFileUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  return { fileUrl, isLoading };
};
