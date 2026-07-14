"use client";

import { Building2 } from "lucide-react";
import SingleSelect from "@/ui/SingleSelect";

const OrgSelect = ({
  options,
  value,
  isLoading,
  onChange,
}: {
  options: { value: string | number; label: string }[];
  value: string;
  isLoading: boolean;
  onChange: (orgId: string) => void;
}) => (
  <div className="flex items-center gap-2">
    <Building2 size={16} className="hidden shrink-0 text-slate-400 sm:block" />
    <div className="w-56 max-w-[60vw]">
      <SingleSelect
        options={options}
        value={value}
        isLoading={isLoading}
        onChange={(val) => onChange(String(val))}
        placeholder="Select organization"
      />
    </div>
  </div>
);

export default OrgSelect;
