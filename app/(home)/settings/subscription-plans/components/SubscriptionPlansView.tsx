"use client";

import { useState } from "react";
import {
  CreditCard,
  Pencil,
  Plus,
  Trash2,
  UserCog,
  Wrench,
} from "lucide-react";
import useSidebar from "@/utils/useSidebar";
import { DataTable, type Column } from "@/ui/Table";
import Button from "@/ui/Button";
import Switch from "@/ui/Switch";
import DeleteConfirmDialog from "@/ui/DeleteConfirmDialog";
import { formatPlanPrice } from "@/shared/subscription/types";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";
import PlanFormDialog from "./PlanFormDialog";
import AssignPlanDialog from "./AssignPlanDialog";
import type { SubscriptionPlan } from "../types/subscriptionPlans.types";

const SubscriptionPlansView = () => {
  const { data: sidebarData } = useSidebar();
  const role = sidebarData?.data.role;

  const {
    plans,
    isLoading,
    toggleStatus,
    isTogglingStatus,
    deletePlan,
    isDeleting,
    runMaintenance,
    isRunningMaintenance,
  } = useSubscriptionPlans();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [assignOpen, setAssignOpen] = useState(false);
  const [confirmMaintenance, setConfirmMaintenance] = useState(false);

  if (role && role !== "ADMIN") {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        You don&apos;t have permission to access this page.
      </div>
    );
  }

  const columns: Column<SubscriptionPlan>[] = [
    {
      key: "planName",
      header: "Name",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.planName}</p>
          <p className="max-w-xs truncate text-xs text-slate-400">
            {row.description}
          </p>
        </div>
      ),
    },
    {
      key: "planCode",
      header: "Code",
      render: (row) => (
        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-600">
          {row.planCode}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => (
        <span>
          {formatPlanPrice(row.price, row.currency)}
          {row.price > 0 && (
            <span className="text-xs text-slate-400">
              {" "}
              /{row.billingCycle.toLowerCase()}
            </span>
          )}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.status === "ACTIVE"}
            onChange={() => toggleStatus(row)}
            disabled={isTogglingStatus}
            checkedClassName="bg-emerald-500"
          />
          <span className="text-xs text-slate-500">
            {row.status === "ACTIVE" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setEditingPlan(row);
              setFormOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Edit plan"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDeletingPlan(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-red-500 hover:bg-red-50"
            aria-label="Delete plan"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <CreditCard size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Subscription Plans
            </h2>
            <p className="text-sm text-slate-500">
              Manage the plans organizations can subscribe to.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="clear"
            className="flex items-center gap-1.5 rounded-md px-4 py-2"
            onClick={() => setConfirmMaintenance(true)}
          >
            <Wrench size={14} /> Run Maintenance
          </Button>
          <Button
            variant="clear"
            className="flex items-center gap-1.5 rounded-md px-4 py-2"
            onClick={() => setAssignOpen(true)}
          >
            <UserCog size={14} /> Assign Custom Plan
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-1.5 rounded-md px-4 py-2"
            onClick={() => {
              setEditingPlan(null);
              setFormOpen(true);
            }}
          >
            <Plus size={14} /> Create Plan
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          data={plans}
          loading={isLoading}
          emptyText="No subscription plans yet."
        />
      </div>

      <PlanFormDialog
        open={formOpen}
        editingPlan={editingPlan}
        onClose={() => {
          setFormOpen(false);
          setEditingPlan(null);
        }}
      />

      <AssignPlanDialog
        open={assignOpen}
        plans={plans}
        onClose={() => setAssignOpen(false)}
      />

      {deletingPlan && (
        <DeleteConfirmDialog
          title="Delete Plan"
          message="Are you sure you want to delete"
          itemName={deletingPlan.planName}
          isDeleting={isDeleting}
          onConfirm={() =>
            deletePlan(deletingPlan, () => setDeletingPlan(null))
          }
          onClose={() => setDeletingPlan(null)}
        />
      )}

      {confirmMaintenance && (
        <DeleteConfirmDialog
          title="Run Maintenance"
          message="This will run subscription maintenance tasks (e.g. applying pending downgrades, expiring lapsed plans) across all organizations. Continue?"
          isDeleting={isRunningMaintenance}
          confirmLabel="Run Maintenance"
          confirmingLabel="Running..."
          hideSuffix
          onConfirm={() => {
            runMaintenance();
            setConfirmMaintenance(false);
          }}
          onClose={() => setConfirmMaintenance(false)}
        />
      )}
    </div>
  );
};

export default SubscriptionPlansView;
