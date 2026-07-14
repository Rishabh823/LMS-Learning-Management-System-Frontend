import { useState, useCallback, useEffect, useRef } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { PaginationRequest } from "@/utils/pagination";

interface UseSelectOption {
  value: number;
  label: string;
}

interface ApiResponse<T = any> {
  pageNumber: number;
  data: T[];
  totalPage: number;
  pageSize: number;
  message: string;
  status: string;
  totalElements: number;
}

interface UseSelectOptions {
  preOption?: any;
  size?: number;
  sortBy?: string;
  labelKey?: string;
  valueKey?: string;
  labelFormatter?: (item: any) => string;
  autoSelectFirst?: boolean;
  onAutoSelect?: (value: number) => void;
  additionalBody?: Record<string, any>;
  enabled?: boolean;
}

export const useSelect = (
  endpoint: string,
  method: "POST" | "GET",
  options?: Partial<UseSelectOptions>,
) => {
  const {
    preOption = [],
    size = 20,
    sortBy = "name",
    labelKey = "name",
    valueKey = "id",
    autoSelectFirst = false,
    onAutoSelect,
    additionalBody = {},
    enabled = true,
  } = options || {};

  // State management
  const [allOptions, setAllOptions] = useState<UseSelectOption[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<
    UseSelectOption | UseSelectOption[] | null
  >(null);

  const isSearchingRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null!);
  const searchInputRef = useRef<HTMLInputElement>(null!);
  const scrollContainerRef = useRef<HTMLDivElement>(null!);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialLoadRef = useRef(false);
  const selectedOptionRef = useRef<UseSelectOption | UseSelectOption[] | null>(
    null,
  );
  selectedOptionRef.current = selectedOption;

  const pagination: PaginationRequest = {
    page: currentPage,
    size,
    sortBy,
    sortDirection: "ASC",
    searchKeyword: searchKeyword,
    dateFrom: "",
    dateTo: "",
    filters: {},
  };

  const requestBody = {
    ...pagination,
    ...additionalBody,
  };

  const { data, isLoading, isFetching } = useApiQuery<
    ApiResponse,
    PaginationRequest
  >({
    method: method,
    endpoint: endpoint,
    body: requestBody,
    enabled: enabled,
    queryKey: [
      endpoint,
      "select",
      currentPage,
      searchKeyword,
      JSON.stringify(additionalBody),
    ],
  });

  useEffect(() => {
    if (data) {
      const hasMoreData = data.pageNumber < data.totalPage - 1;
      // Defer state update to avoid possible setState-in-render timing issues
      Promise.resolve().then(() => setHasMore(hasMoreData));
    }
  }, [data]);

  const transformToOptions = (items: any[]): UseSelectOption[] => {
    return items.map((item) => ({
      value: item[valueKey] ?? item.id,
      label: options?.labelFormatter
        ? options.labelFormatter(item)
        : (item[labelKey] ?? item.name),
    }));
  };

  useEffect(() => {
    if (data?.data) {
      const newOptions = transformToOptions(data.data);

      if (currentPage === 0) {
        // Defer state mutation to next microtask to avoid React's "setState in render"
        Promise.resolve().then(() => {
          setAllOptions(newOptions);
          isSearchingRef.current = false;
        });
      } else {
        Promise.resolve().then(() => {
          setAllOptions((prev) => {
            const existingValues = new Set(prev.map((opt) => opt.value));
            const uniqueNewOptions = newOptions.filter(
              (opt) => !existingValues.has(opt.value),
            );
            return [...prev, ...uniqueNewOptions];
          });
        });
      }
    }
  }, [data]);
  useEffect(() => {
    if (!enabled) {
      // Defer resets to avoid possible render-time updates
      Promise.resolve().then(() => {
        setAllOptions([]);
        setCurrentPage(0);
        setHasMore(true);
        setSelectedOption(null);
      });
    }
  }, [enabled]);

  useEffect(() => {
    if (
      autoSelectFirst &&
      !selectedOption &&
      allOptions.length > 0 &&
      !isLoading &&
      onAutoSelect
    ) {
      const firstOption = allOptions[0];
      // Defer auto-select to next microtask so parent consumers can safely update
      Promise.resolve().then(() => {
        setSelectedOption(firstOption);
        try {
          onAutoSelect(firstOption.value);
        } catch (e) {
          // swallow errors from consumer callback to avoid breaking the hook
          // consumer may perform its own state updates
          // errors should be handled by the consumer
        }
      });
    }
  }, [autoSelectFirst, allOptions, isLoading, selectedOption, onAutoSelect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      setSearchKeyword("");
      setCurrentPage(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (hasInitialLoadRef.current) {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      searchDebounceRef.current = setTimeout(() => {
        setSearchKeyword(searchTerm);
        setCurrentPage(0);
        isSearchingRef.current = true;
      }, 500);
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!hasMore || isLoading || isFetching) return;

      const target = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < 100) {
        setCurrentPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading, isFetching],
  );

  const handleSelect = useCallback(
    (
      option: UseSelectOption,
      onChange: (value: number | number[]) => void,
      isMulti = false,
    ) => {
      if (!isMulti) {
        onChange(option.value);
        setSelectedOption(option);
        setIsOpen(false);
        setSearchTerm("");
        return;
      }

      // Read current selection from ref (always up-to-date, no stale closure).
      const prev = selectedOptionRef.current;
      const prevArr = Array.isArray(prev) ? prev : [];
      const exists = prevArr.some((o) => o.value === option.value);
      const updated = exists
        ? prevArr.filter((o) => o.value !== option.value)
        : [...prevArr, option];

      // Call onChange BEFORE setSelectedOption so it is never called inside
      // a React state updater — that was the root cause of the
      // "Cannot update a component (Controller) while rendering" error.
      onChange(updated.map((o) => o.value));
      setSelectedOption(updated);
    },
    [],
  );

  const toggleDropdown = useCallback((disabled: boolean) => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, []);

  const filteredOptions = preOption.length > 0 ? preOption : allOptions;

  // Helper to extract a single number from Select onChange value
  const extractNumber = (
    value: number | string | number[] | string[],
  ): number | undefined => {
    const extracted = Array.isArray(value) ? value[0] : value;
    return typeof extracted === "number" ? extracted : undefined;
  };

  return {
    options: allOptions as any,
    filteredOptions: filteredOptions as any,
    isLoading: isLoading || isFetching,
    hasMore,
    currentPage,
    totalItems: data?.totalElements || 0,
    selectedOption: selectedOption as any,

    data,
    isOpen,
    searchTerm,

    dropdownRef,
    searchInputRef,
    scrollContainerRef,

    handleSearchChange,
    handleScroll,
    handleSelect: handleSelect as any,
    toggleDropdown,
    extractNumber,
  };
};
