"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import Button from "@/ui/Button";
import { errorMsg } from "@/utils/notify";
import {
  PLAN_FEATURE_FLAGS,
  PLAN_LIMIT_FIELDS,
} from "@/shared/subscription/types";
import { usePlanForm } from "../hooks/usePlanForm";
import type { SubscriptionPlan } from "../types/subscriptionPlans.types";

const BILLING_CYCLES = ["MONTHLY", "QUARTERLY", "YEARLY"];

const PlanFormDialog = ({
  open,
  editingPlan,
  onClose,
}: {
  open: boolean;
  editingPlan: SubscriptionPlan | null;
  onClose: () => void;
}) => {
  const { form, update, validate, submit, isPending } =
    usePlanForm(editingPlan);

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      errorMsg(err);
      return;
    }
    submit(onClose);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editingPlan ? "Edit Plan" : "Create Plan"}
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-sm font-bold text-slate-900">
            Basic Info
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Plan Name" required>
              <Input
                type="text"
                placeholder="e.g. Premium"
                value={form.planName}
                onChange={(e) => update({ planName: e.target.value })}
              />
            </FormField>
            <FormField label="Plan Code" required>
              <Input
                type="text"
                placeholder="e.g. PREMIUM"
                value={form.planCode}
                onChange={(e) =>
                  update({ planCode: e.target.value.toUpperCase() })
                }
              />
            </FormField>
            <FormField label="Price" required>
              <Input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => update({ price: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Currency" required>
              <Input
                type="text"
                placeholder="e.g. INR"
                value={form.currency}
                onChange={(e) =>
                  update({ currency: e.target.value.toUpperCase() })
                }
              />
            </FormField>
            <FormField label="Billing Cycle" required>
              <select
                value={form.billingCycle}
                onChange={(e) => update({ billingCycle: e.target.value })}
                className="w-full rounded-md border border-sky-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              >
                {BILLING_CYCLES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Description">
                <TextArea
                  placeholder="Describe this plan"
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={2}
                />
              </FormField>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-1 border-l-4 border-sky-500 pl-3 text-sm font-bold text-slate-900">
            Limits
          </h3>
          <p className="mb-4 pl-4 text-xs text-slate-400">
            Leave a field blank for unlimited.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PLAN_LIMIT_FIELDS.map((f) => (
              <FormField key={f.key} label={f.label}>
                <Input
                  type="number"
                  min={0}
                  placeholder="Unlimited"
                  value={form[f.key] ?? ""}
                  onChange={(e) =>
                    update({
                      [f.key]:
                        e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </FormField>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-sm font-bold text-slate-900">
            Features
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PLAN_FEATURE_FLAGS.map((f) => (
              <label
                key={f.key}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-100 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={!!form[f.key]}
                  onChange={(e) => update({ [f.key]: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="cancel" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-md px-6 py-2.5"
          >
            {isPending
              ? "Saving..."
              : editingPlan
                ? "Save Changes"
                : "Create Plan"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default PlanFormDialog;
