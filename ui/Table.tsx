import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2, Inbox } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T, rowIndex: number) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  onSort?: (sortBy: string, sortDirection: "ASC" | "DESC") => void;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyText = "No data found",
  sortBy = "",
  sortDirection = "ASC",
  onSort,
}: DataTableProps<T>) {
  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    if (sortBy === columnKey) {
      const newOrder = sortDirection === "ASC" ? "DESC" : "ASC";
      onSort(columnKey, newOrder);
    } else {
      onSort(columnKey, "ASC");
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown size={14} className="text-slate-400" />;
    }
    return sortDirection === "ASC" ? (
      <ArrowUp size={14} className="text-sky-600" />
    ) : (
      <ArrowDown size={14} className="text-sky-600" />
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-white py-12">
        <Loader2 className="mb-3 animate-spin text-sky-500" size={24} />
        <p className="text-sm font-medium text-slate-500">Loading data...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-white py-12">
        <Inbox className="mb-3 text-slate-300" size={32} />
        <p className="text-sm font-medium text-slate-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="sticky top-0 z-10 bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-6 py-3.5 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase transition-colors ${
                  col.sortable !== false && onSort
                    ? "group cursor-pointer select-none hover:bg-slate-100"
                    : ""
                }`}
                onClick={() =>
                  col.sortable !== false && onSort
                    ? handleSort(String(col.key))
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  <span>{col.header}</span>
                  {col.sortable !== false &&
                    onSort &&
                    getSortIcon(String(col.key))}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-slate-50 transition-colors last:border-b-0 hover:bg-sky-50/40"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-6 py-4 align-top text-sm font-medium text-slate-700"
                >
                  {col.render
                    ? col.render(row, rowIndex)
                    : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
