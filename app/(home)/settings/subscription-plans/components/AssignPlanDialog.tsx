"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import SingleSelect from "@/ui/SingleSelect";
import Button from "@/ui/Button";
import { useAssignPlan } from "../hooks/useAssignPlan";
import type { SubscriptionPlan } from "../types/subscriptionPlans.types";

const AssignPlanDialog = ({
  open,
  plans,
  onClose,
}: {
  open: boolean;
  plans: SubscriptionPlan[];
  onClose: () => void;
}) => {
  const {
    organizationId,
    setOrganizationId,
    planId,
    setPlanId,
    orgOptions,
    orgListLoading,
    assign,
    isPending,
    reset,
  } = useAssignPlan();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Assign Custom Plan"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col gap-5">
        <FormField label="Organization" required>
          <SingleSelect
            options={orgOptions}
            value={organizationId}
            onChange={(val) => setOrganizationId(val)}
            isLoading={orgListLoading}
            placeholder="Select an organization"
          />
        </FormField>
        <FormField label="Plan" required>
          <SingleSelect
            options={plans.map((p) => ({
              value: p.planId,
              label: `${p.planName} (${p.planCode})`,
            }))}
            value={planId}
            onChange={(val) => setPlanId(Number(val))}
            placeholder="Select a plan"
            searchable={false}
          />
        </FormField>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="cancel" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => assign(onClose)}
            disabled={isPending || !organizationId || !planId}
            className="rounded-md px-6 py-2.5"
          >
            {isPending ? "Assigning..." : "Assign Plan"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AssignPlanDialog;
