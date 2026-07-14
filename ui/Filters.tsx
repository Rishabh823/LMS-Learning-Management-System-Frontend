"use client";
import SearchInput from "./SearchInput";
import DateRangeInput, { DateRange } from "./DateRangeInput";
import { Filter, X } from "lucide-react";
import Button from "./Button";

interface FiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  dateFrom?: string;
  dateTo?: string;
  onDateRangeChange?: (dateFrom: string, dateTo: string) => void;
  onClearFilters?: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  searchValue = "",
  onSearchChange,
  dateFrom = "",
  dateTo = "",
  onDateRangeChange,
  onClearFilters,
}) => {
  const handleDateRangeChange = (range: DateRange) => {
    onDateRangeChange?.(range.from, range.to);
  };

  const hasActiveFilters = searchValue || dateFrom || dateTo;

  const handleClearFilters = () => {
    onSearchChange?.("");
    onDateRangeChange?.("", "");
    onClearFilters?.();
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full overflow-visible">
      {/* Filter Icon Badge */}
      <div className="hidden sm:flex items-center justify-center p-2 bg-[#0066FF]/10 rounded-lg border border-[#0066FF]/20 shrink-0">
        <Filter className="text-[#0066FF]" size={18} />
      </div>

      {/* Search Input */}
      <div className="flex-1 min-w-0">
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search here"
          className="w-full"
        />
      </div>

      {/* Date Range Input */}
      <div className="w-full sm:w-auto sm:min-w-70">
        <DateRangeInput
          value={{ from: dateFrom, to: dateTo }}
          onChange={handleDateRangeChange}
          className="w-full"
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && onClearFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleClearFilters}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors shrink-0 whitespace-nowrap"
          aria-label="Clear all filters"
        >
          <X size={16} />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      )}
    </div>
  );
};

export default Filters;
