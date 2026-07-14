"use client";

import { Copy } from "lucide-react";
import { DataTable, type Column } from "@/ui/Table";
import StatusBadge from "@/shared/subscription/StatusBadge";
import { formatPlanPrice } from "@/shared/subscription/types";
import { successMsg } from "@/utils/notify";
import { usePaymentHistory } from "../hooks/usePaymentHistory";
import type { PaymentHistoryItem } from "../types/subscription.types";

const truncateId = (id: string) =>
  id.length > 10 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;

const CopyableId = ({ value }: { value: string }) => (
  <button
    type="button"
    onClick={() => {
      navigator.clipboard.writeText(value);
      successMsg("Copied to clipboard.");
    }}
    className="inline-flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-sky-600"
    title={value}
  >
    {truncateId(value)} <Copy size={11} />
  </button>
);

const PaymentHistoryTable = () => {
  const { transactions, isLoading } = usePaymentHistory();

  const columns: Column<PaymentHistoryItem>[] = [
    {
      key: "createdDate",
      header: "Date",
      render: (row) =>
        row.createdDate ? new Date(row.createdDate).toLocaleDateString() : "—",
    },
    {
      key: "planName",
      header: "Plan",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.planName}</p>
          <p className="text-xs text-slate-400">{row.planCode}</p>
        </div>
      ),
    },
    { key: "provider", header: "Provider" },
    {
      key: "providerOrderId",
      header: "Order ID",
      render: (row) => <CopyableId value={row.providerOrderId} />,
    },
    {
      key: "providerPaymentId",
      header: "Payment ID",
      render: (row) =>
        row.providerPaymentId ? (
          <CopyableId value={row.providerPaymentId} />
        ) : (
          "—"
        ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => formatPlanPrice(row.amount, row.currency),
    },
    {
      key: "paymentStatus",
      header: "Status",
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={transactions}
      loading={isLoading}
      emptyText="No payment history yet."
    />
  );
};

export default PaymentHistoryTable;
