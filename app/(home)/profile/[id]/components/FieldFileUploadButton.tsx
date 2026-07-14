"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { UPLOADFIELDFILE } from "@/app/(home)/settings/onboardingForm/api/onboardingForm.api";

const FieldFileUploadButton = ({
  fieldId,
  accept,
}: {
  fieldId: number;
  accept?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useApiMutation({
    queryKey: [["user-details"], ["field-file"]],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("fieldId", String(fieldId));
    formData.append("file", file);

    mutate(
      {
        method: "post",
        endpoint: UPLOADFIELDFILE(),
        body: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: () => successMsg("File uploaded successfully."),
      },
    );
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        title="Change file"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-colors"
      >
        <Upload size={12} />
      </button>
    </>
  );
};

export default FieldFileUploadButton;
