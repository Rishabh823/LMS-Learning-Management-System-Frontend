"use client";

import { useState } from "react";
import Dialog from "@/ui/Dialog";
import Button from "@/ui/Button";
import Loader from "@/ui/Loader";
import PlanCard from "@/shared/subscription/PlanCard";
import { useUpgradeDowngrade } from "../hooks/useUpgradeDowngrade";
import type { OrgSubscription } from "../types/subscription.types";

const UpgradeDowngradeModal = ({
  open,
  mode,
  subscription,
  onClose,
}: {
  open: boolean;
  mode: "upgrade" | "downgrade";
  subscription: OrgSubscription | null;
  onClose: () => void;
}) => {
  const [confirmingDowngrade, setConfirmingDowngrade] = useState(false);

  const {
    plans,
    isLoading,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlan,
    upgrade,
    downgrade,
    isProcessing,
  } = useUpgradeDowngrade(subscription?.planId, () => {
    setConfirmingDowngrade(false);
    onClose();
  });

  // Only offer plans priced at/above the current plan for "Upgrade" and
  // at/below it for "Downgrade" — keeps the comparison list meaningful.
  const eligiblePlans = plans.filter((p) =>
    mode === "upgrade"
      ? p.price >= (subscription?.price ?? 0)
      : p.price <= (subscription?.price ?? 0),
  );

  const handleClose = () => {
    setConfirmingDowngrade(false);
    onClose();
  };

  const handlePrimaryAction = () => {
    if (!selectedPlan) return;
    if (mode === "upgrade") {
      upgrade();
    } else if (!confirmingDowngrade) {
      setConfirmingDowngrade(true);
    } else {
      downgrade();
    }
  };

  const endDateLabel = subscription?.subscriptionEndDate
    ? new Date(subscription.subscriptionEndDate).toLocaleDateString()
    : "the end of your current billing period";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={mode === "upgrade" ? "Upgrade Plan" : "Downgrade Plan"}
      maxWidth="max-w-4xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader />
        </div>
      ) : confirmingDowngrade && selectedPlan ? (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            You're switching to <strong>{selectedPlan.planName}</strong>. This
            takes effect on <strong>{endDateLabel}</strong> — you'll keep your
            current plan's access until then.
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="cancel"
              onClick={() => setConfirmingDowngrade(false)}
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handlePrimaryAction}
              disabled={isProcessing}
              className="rounded-md px-6"
            >
              {isProcessing ? "Confirming..." : "Confirm Downgrade"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {eligiblePlans.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              No other plans are available to{" "}
              {mode === "upgrade" ? "upgrade" : "downgrade"} to right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eligiblePlans.map((plan) => (
                <PlanCard
                  key={plan.planId}
                  plan={plan}
                  selected={selectedPlanId === plan.planId}
                  onSelect={() => setSelectedPlanId(plan.planId)}
                />
              ))}
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="cancel" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePrimaryAction}
              disabled={!selectedPlan || isProcessing}
              className="rounded-md px-6"
            >
              {isProcessing
                ? "Processing..."
                : mode === "upgrade"
                  ? "Continue to Payment"
                  : "Downgrade"}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default UpgradeDowngradeModal;
