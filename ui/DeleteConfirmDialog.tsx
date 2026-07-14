"use client";
import Button from "@/ui/Button";

interface DeleteConfirmDialogProps {
  title?: string;
  message?: string;
  itemName?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  // Lets non-delete confirmations (cancel/renew subscription, etc.) reuse
  // this same dialog shell instead of a bespoke one.
  confirmLabel?: string;
  confirmingLabel?: string;
  hideSuffix?: boolean;
}

const DeleteConfirmDialog = ({
  title = "Delete Confirmation",
  message = "Are you sure you want to delete",
  itemName,
  isDeleting = false,
  onConfirm,
  onClose,
  confirmLabel = "Delete",
  confirmingLabel = "Deleting...",
  hideSuffix = false,
}: DeleteConfirmDialogProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">
            {message}
            {itemName && (
              <span className="font-semibold text-gray-900"> "{itemName}"</span>
            )}
            {!hideSuffix && "? This action cannot be undone."}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? confirmingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
