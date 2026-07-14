"use client";

import { useState } from "react";
import {
  Check,
  X,
  CreditCard,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import Button from "@/ui/Button";
import Loader from "@/ui/Loader";
import DeleteConfirmDialog from "@/ui/DeleteConfirmDialog";
import StatusBadge from "@/shared/subscription/StatusBadge";
import UsageBar from "@/shared/subscription/UsageBar";
import {
  formatLimit,
  formatPlanPrice,
  PLAN_FEATURE_FLAGS,
} from "@/shared/subscription/types";
import { useOrgSubscription } from "../hooks/useOrgSubscription";
import { useOrgUsage } from "../hooks/useOrgUsage";
import UpgradeDowngradeModal from "./UpgradeDowngradeModal";

const DAY_MS = 24 * 60 * 60 * 1000;

const SubscriptionOverview = () => {
  const {
    subscription,
    isLoading,
    refetch,
    cancelSubscription,
    isCancelling,
    renewSubscription,
  } = useOrgSubscription();
  const usage = useOrgUsage();

  const [modalMode, setModalMode] = useState<"upgrade" | "downgrade" | null>(
    null,
  );
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-slate-400">
        <CreditCard size={28} />
        <p className="text-sm">No active subscription found.</p>
      </div>
    );
  }

  const endDate = subscription.subscriptionEndDate
    ? new Date(subscription.subscriptionEndDate)
    : null;
  const now = Date.now();
  const daysLeft = endDate
    ? Math.ceil((endDate.getTime() - now) / DAY_MS)
    : null;
  const isLapsed = endDate ? endDate.getTime() < now : false;

  const showUpgradeDowngrade = subscription.status === "ACTIVE";
  const showCancel = subscription.status === "ACTIVE";
  const showRenew =
    subscription.status === "EXPIRED" ||
    (subscription.status === "CANCELLED" && !isLapsed) ||
    (subscription.status === "ACTIVE" &&
      daysLeft != null &&
      daysLeft <= 7 &&
      daysLeft >= 0);

  return (
    <div className="flex flex-col gap-4">
      {subscription.pendingPlanCode && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle size={16} className="shrink-0" />
          Downgrading to <strong>{subscription.pendingPlanName}</strong>
          {subscription.pendingPlanEffectiveDate
            ? ` on ${new Date(
                subscription.pendingPlanEffectiveDate,
              ).toLocaleDateString()}`
            : ""}
          .
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {subscription.planName}
            </h2>
            <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-600">
              {subscription.planCode}
            </span>
            <StatusBadge status={subscription.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {formatPlanPrice(subscription.price, subscription.currency)}
            {subscription.price > 0 &&
              ` / ${subscription.billingCycle.toLowerCase()}`}
          </p>
          {endDate && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarClock size={13} />
              {subscription.status === "CANCELLED"
                ? "Access until "
                : "Renews on "}
              {endDate.toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {showUpgradeDowngrade && (
            <>
              <Button
                variant="clear"
                className="rounded-md px-4 py-2"
                onClick={() => setModalMode("downgrade")}
              >
                Downgrade
              </Button>
              <Button
                variant="primary"
                className="rounded-md px-4 py-2"
                onClick={() => setModalMode("upgrade")}
              >
                Upgrade
              </Button>
            </>
          )}
          {showRenew && (
            <Button
              variant="accept"
              className="rounded-md px-4 py-2"
              onClick={() => renewSubscription(setIsRenewing)}
              disabled={isRenewing}
            >
              {isRenewing ? "Processing..." : "Renew"}
            </Button>
          )}
          {showCancel && (
            <Button
              variant="danger"
              className="rounded-md px-4 py-2"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-900">Usage</h3>
          <div className="flex flex-col gap-4">
            <UsageBar
              label="Students"
              used={usage.usedStudents}
              limit={subscription.maxStudents}
            />
            <UsageBar
              label="Trainers"
              used={usage.usedTrainers}
              limit={subscription.maxTrainers}
            />
            <UsageBar
              label="Courses"
              used={usage.usedCourses}
              limit={subscription.maxCourses}
            />
            <UsageBar
              label="Groups"
              used={usage.usedGroups}
              limit={subscription.maxGroups}
            />
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">Admins</span>
              <span className="text-slate-400">
                Limit: {formatLimit(subscription.maxAdmins)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">Storage</span>
              <span className="text-slate-400">
                Limit:{" "}
                {subscription.storageGB == null
                  ? "Unlimited"
                  : `${subscription.storageGB} GB`}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-slate-900">Features</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PLAN_FEATURE_FLAGS.map((f) => {
              const enabled = !!subscription[f.key];
              return (
                <div key={f.key} className="flex items-center gap-2 text-sm">
                  {enabled ? (
                    <Check size={14} className="shrink-0 text-emerald-500" />
                  ) : (
                    <X size={14} className="shrink-0 text-slate-300" />
                  )}
                  <span
                    className={enabled ? "text-slate-700" : "text-slate-400"}
                  >
                    {f.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <UpgradeDowngradeModal
        open={modalMode !== null}
        mode={modalMode || "upgrade"}
        subscription={subscription}
        onClose={() => {
          setModalMode(null);
          refetch();
        }}
      />

      {confirmCancel && (
        <DeleteConfirmDialog
          title="Cancel Subscription"
          message={`Your ${subscription.planName} subscription will stay active until the end of the current billing period, then it won't renew. Are you sure you want to cancel?`}
          isDeleting={isCancelling}
          confirmLabel="Cancel Subscription"
          confirmingLabel="Cancelling..."
          hideSuffix
          onConfirm={() => cancelSubscription(() => setConfirmCancel(false))}
          onClose={() => setConfirmCancel(false)}
        />
      )}
    </div>
  );
};

export default SubscriptionOverview;
