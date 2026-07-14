"use client";

import { RotateCcw, Filter } from "lucide-react";
import SearchInput from "@/ui/SearchInput";
import SingleSelect from "@/ui/SingleSelect";
import Button from "@/ui/Button";

const STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const FilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  degree,
  onDegreeChange,
  degreeOptions,
  gender,
  onGenderChange,
  onReset,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  degree: string;
  onDegreeChange: (value: string) => void;
  degreeOptions: { value: string; label: string }[];
  gender: string;
  onGenderChange: (value: string) => void;
  onReset: () => void;
}) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
    <div className="min-w-0 flex-1">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name, email or phone..."
      />
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:w-auto md:flex md:shrink-0">
      <div className="w-full md:w-36">
        <SingleSelect
          options={STATUS_OPTIONS}
          value={status}
          onChange={(val) => onStatusChange(String(val))}
          placeholder="Select Status"
          searchable={false}
        />
      </div>
      <div className="w-full md:w-36">
        <SingleSelect
          options={degreeOptions}
          value={degree}
          onChange={(val) => onDegreeChange(String(val))}
          placeholder="Select Degree"
          searchable={false}
        />
      </div>
      <div className="w-full md:w-36">
        <SingleSelect
          options={GENDER_OPTIONS}
          value={gender}
          onChange={(val) => onGenderChange(String(val))}
          placeholder="Select Gender"
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
      {/* <Button variant="primary" className="flex items-center gap-1.5 px-4 py-2">
        <Filter size={14} /> Filter
      </Button> */}
    </div>
  </div>
);

export default FilterBar;
