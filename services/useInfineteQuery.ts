/**
 * -------------------------------------------------------------
 * useApiInfiniteQuery
 * -------------------------------------------------------------
 * A reusable wrapper around TanStack React Query's useInfiniteQuery.
 *
 * Purpose:
 * - Used for infinite scrolling / load more pagination.
 * - Automatically handles page increment.
 * - Works with both GET and POST APIs.
 * - Injects page number dynamically into request.
 *
 * How it works:
 * - React Query manages pages internally.
 * - We define how to fetch each page.
 * - We tell React Query how to determine next page.
 *
 * Backend Expected Format (example):
 * {
 *   pageNumber: 0,
 *   data: [],
 *   totalPage: 6
 * }
 * -------------------------------------------------------------
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "./apiClient";

interface UseApiInfiniteQueryOptions<TBody = any, TParams = any> {
  method?: "GET" | "POST";          // HTTP method
  body?: TBody;                     // Body for POST request
  params?: TParams;                 // Params for GET request
  config?: any;                     // Axios config
  enabled?: boolean;                // Enable/disable query
  queryKey: any[];                  // Cache key (important for refetch)
  pageParamKey?: string;            // Page key name (default: "page")
}

export function useApiInfiniteQuery<TResponse = any, TBody = any>(
  options: {
    endpoint: string;
  } & UseApiInfiniteQueryOptions<TBody>
) {
  const method = options.method ?? "GET";
  const pageKey = options.pageParamKey ?? "page";

  return useInfiniteQuery({
    /**
     * queryKey:
     * - Used by React Query for caching.
     * - When queryKey changes → query resets automatically.
     * - Always include filters/search values inside queryKey.
     */
    queryKey: options.queryKey,

    /**
     * REQUIRED in React Query v5.
     * Defines the first page to load.
     */
    initialPageParam: 0,

    /**
     * Allows conditional execution.
     * Example: only run if projectId exists.
     */
    enabled: options.enabled ?? true,

    /**
     * queryFn:
     * - Called every time a new page is fetched.
     * - pageParam is automatically provided by React Query.
     * - First call → pageParam = 0
     * - Next call → pageParam = 1, 2, 3 ...
     */
    queryFn: async ({ pageParam }) => {
      if (method === "POST") {
        const res = await apiClient.post<TResponse>(
          options.endpoint,
          {
            ...options.body,
            [pageKey]: pageParam, // inject page dynamically
          },
          options.config
        );
        return res.data;
      }

      // GET request case
      const res = await apiClient.get<TResponse>(options.endpoint, {
        params: {
          ...options.params,
          [pageKey]: pageParam,
        },
        ...options.config,
      });

      return res.data;
    },

    /**
     * getNextPageParam:
     * - Determines if another page exists.
     * - If returns undefined → infinite stops.
     * - If returns number → that number becomes next pageParam.
     *
     * Backend example:
     * pageNumber = 0
     * totalPage = 6
     *
     * Logic:
     * If currentPage + 1 < totalPages → fetch next
     */
    getNextPageParam: (lastPage: any) => {
      if (!lastPage) return undefined;

      const currentPage = lastPage.pageNumber;
      const totalPages = lastPage.totalPage;

      if (
        typeof currentPage !== "number" ||
        typeof totalPages !== "number"
      ) {
        return undefined;
      }

      return currentPage + 1 < totalPages
        ? currentPage + 1
        : undefined;
    },

    retry: 2, // Retry failed request twice
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
}
