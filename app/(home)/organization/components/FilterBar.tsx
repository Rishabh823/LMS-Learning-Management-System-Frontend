"use client";

import { RotateCcw } from "lucide-react";
import SearchInput from "@/ui/SearchInput";
import SingleSelect from "@/ui/SingleSelect";
import Button from "@/ui/Button";

const FilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions,
  onReset,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions: { value: string; label: string }[];
  onReset: () => void;
}) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
    <div className="min-w-0 flex-1">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name, email or contact..."
      />
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:w-auto md:flex md:shrink-0">
      <div className="w-full md:w-40">
        <SingleSelect
          options={statusOptions}
          value={status}
          onChange={(val) => onStatusChange(String(val))}
          placeholder="Select Status"
          searchable={false}
        />
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      <Button
        variant="clear"
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-2"
      >
        <RotateCcw size={14} /> Reset
      </Button>
    </div>
  </div>
);

export default FilterBar;
