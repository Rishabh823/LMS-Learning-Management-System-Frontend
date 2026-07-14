import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "./apiClient";

interface UseApiQueryOptions<TBody = any, TParams = any> {
  method?: "GET" | "POST" | "DELETE";
  body?: TBody;
  params?: TParams;
  config?: any;
  enabled?: boolean;
  queryKey?: any[];
}

export function useApiQuery<TResponse = any, TBody = any>(
  options: {
    endpoint: string;
  } & UseApiQueryOptions<TBody>,
) {
  const method = options.method ?? "GET";
  // Implement the query logic here
  return useQuery<TResponse>({
    queryKey: options.queryKey || [
      options.endpoint,
      options.body ?? options.params,
    ],

    enabled: options.enabled ?? true,
    queryFn: async () => {
      if (method === "POST") {
        const res = await apiClient.post<TResponse>(
          options.endpoint,
          options.body,
          options.config,
        );
        return res.data;
      }
      const res = await apiClient.get<TResponse>(options.endpoint, {
        params: options.params,
        ...options.config,
      });

      return res.data;
    },
    retry: 2,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 5,
  } as any);
}
