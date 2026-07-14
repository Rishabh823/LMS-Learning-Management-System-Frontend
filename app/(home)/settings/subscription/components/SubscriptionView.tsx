"use client";

import { CreditCard } from "lucide-react";
import Tabs, { type TabItem } from "@/ui/Tabs";
import SubscriptionOverview from "./SubscriptionOverview";
import PaymentHistoryTable from "./PaymentHistoryTable";

const SubscriptionView = () => {
  const tabs: TabItem[] = [
    { id: "overview", title: "Overview", panel: <SubscriptionOverview /> },
    {
      id: "history",
      title: "Payment History",
      panel: <PaymentHistoryTable />,
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <CreditCard size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Subscription</h2>
          <p className="text-sm text-slate-500">
            Manage your plan, usage, and billing history.
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};

export default SubscriptionView;
