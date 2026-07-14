import { useState, useEffect, useCallback, useRef } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { PaginationRequest } from "@/utils/pagination";

interface SelectOption {
  value: number | string;
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

interface UseSimpleSelectOptions {
  size?: number;
  sortBy?: string;
  labelKey?: string;
  valueKey?: string;
  labelFormatter?: (item: any) => string;
  additionalBody?: Record<string, any>;
  enabled?: boolean;
  enablePagination?: boolean; // Props for infinite scroll pagination
  enableServerSearch?: boolean; // New option for server-side search
  searchDebounceMs?: number; // Debounce delay for search
}

export const useSimpleSelect = (
  endpoint: string,
  method: "POST" | "GET",
  options?: UseSimpleSelectOptions,
) => {
  const {
    size = 5,
    sortBy = "name",
    labelKey = "name",
    valueKey = "id",
    additionalBody = {},
    enabled = true,
    enablePagination = false,
    enableServerSearch = false, // Default to client-side search
    searchDebounceMs = 500,
  } = options || {};

  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const isSearchingRef = useRef(false);

  const pagination: PaginationRequest = {
    page: currentPage,
    size: enablePagination ? size : 1000,
    sortBy,
    sortDirection: "ASC",
    searchKeyword: enableServerSearch ? searchKeyword : "",
    dateFrom: "",
    dateTo: "",
    filters: {},
  };

  const requestBody = {
    ...pagination,
    ...additionalBody,
  };

  const { data, isLoading, error, isFetching } = useApiQuery<
    ApiResponse,
    PaginationRequest
  >({
    method,
    endpoint,
    body: requestBody,
    enabled,
    queryKey: [
      endpoint,
      "simple-select",
      currentPage,
      searchKeyword,
      JSON.stringify(additionalBody),
    ],
  });

  useEffect(() => {
    if (data?.data) {
      const transformedOptions = data.data.map((item) => ({
        value: item[valueKey] ?? item.id,
        label: options?.labelFormatter
          ? options.labelFormatter(item)
          : (item[labelKey] ?? item.name),
      }));

      if (enablePagination) {
        // Infinite scroll mode
        if (currentPage === 0 || isSearchingRef.current) {
          setSelectOptions(transformedOptions);
          isSearchingRef.current = false;
        } else {
          setSelectOptions((prev) => {
            const existingValues = new Set(prev.map((opt) => opt.value));
            const uniqueNewOptions = transformedOptions.filter(
              (opt) => !existingValues.has(opt.value),
            );
            return [...prev, ...uniqueNewOptions];
          });
        }

        setHasMore(data.pageNumber < data.totalPage - 1);
      } else {
        // Load all mode
        setSelectOptions(transformedOptions);
        setHasMore(false);
      }
    }
  }, [
    data,
    labelKey,
    valueKey,
    options?.labelFormatter,
    currentPage,
    enablePagination,
  ]);

  // Reset when enabled changes
  useEffect(() => {
    if (!enabled) {
      setSelectOptions([]);
      setCurrentPage(0);
      setHasMore(false);
      setSearchKeyword("");
    }
  }, [enabled]);

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading && !isFetching && enablePagination) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore, isLoading, isFetching, enablePagination]);

  // Search function with debouncing
  const search = useCallback(
    (term: string) => {
      if (!enableServerSearch) {
        // Client-side search - no need to update state
        return;
      }

      // Clear existing debounce timer
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      // Set new debounce timer
      searchDebounceRef.current = setTimeout(() => {
        setSearchKeyword(term);
        setCurrentPage(0);
        isSearchingRef.current = true;
      }, searchDebounceMs);
    },
    [enableServerSearch, searchDebounceMs],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  return {
    options: selectOptions,
    isLoading: isLoading || isFetching,
    error,
    totalItems: data?.totalElements || 0,
    hasMore,
    loadMore,
    currentPage,
    search, // New search function
    enableServerSearch, // Return this so component knows which mode
  };
};
