"use client";

import Dialog from "@/ui/Dialog";
import Loader from "@/ui/Loader";
import { useFieldFile } from "../hooks/useFieldFile";

const FieldFileDialog = ({
  fieldId,
  title,
  onClose,
}: {
  fieldId: number | null;
  title?: string;
  onClose: () => void;
}) => {
  const { fileUrl, isLoading } = useFieldFile(fieldId, fieldId != null);

  return (
    <Dialog
      open={fieldId != null}
      onClose={onClose}
      title={title || "File Preview"}
      maxWidth="max-w-4xl"
    >
      <div className="flex h-[75vh] items-center justify-center">
        {isLoading ? (
          <Loader />
        ) : fileUrl ? (
          <iframe
            src={fileUrl}
            title={title || "File Preview"}
            className="h-full w-full rounded-lg border border-slate-100"
          />
        ) : (
          <p className="text-sm text-slate-400">Unable to load file.</p>
        )}
      </div>
    </Dialog>
  );
};

export default FieldFileDialog;
