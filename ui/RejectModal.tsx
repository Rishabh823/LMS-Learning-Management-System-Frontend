"use client";
import { useState } from "react";
import Button from "@/ui/Button";
import TextArea from "@/ui/TextArea";

interface RejectModalProps {
  title?: string;
  isRejecting?: boolean;
  info?: string;
  acceptModal?: boolean;
  placeholder?: string;
  onChange?: (reason: string) => void;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const RejectModal = ({
  title = "Reject Preassessment",
  isRejecting = false,
  acceptModal = false,
  onConfirm,
  onClose,
  placeholder = "Enter rejection reason...",
  info = "Please provide a reason for rejecting this preassessment:",
  onChange,
}: RejectModalProps) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="mb-6">
          <p className="text-gray-600 mb-4">{info}</p>
          <TextArea
            value={reason}
            onChange={(e) => {
              onChange?.(e.target.value);
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder={placeholder}
            rows={4}
            disabled={isRejecting}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="cancel"
            onClick={onClose}
            disabled={isRejecting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={acceptModal ? "accept" : "danger"}
            onClick={handleConfirm}
            disabled={isRejecting}
          >
            {acceptModal
              ? isRejecting
                ? "Accepting..."
                : "Accept"
              : isRejecting
              ? "Rejecting..."
              : "Reject"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
