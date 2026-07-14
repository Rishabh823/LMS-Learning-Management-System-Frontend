import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import apiClient from "./apiClient";

export interface ApiMutationArgs<TBody = any> {
  method?: "post" | "put" | "delete" | "patch";
  endpoint?: string;
  body?: TBody;
  config?: AxiosRequestConfig;
  queryKey?: any[];
}

export function useApiMutation(args?: { queryKey?: any[] }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutationArgs?: ApiMutationArgs) => {
      const _args = mutationArgs || {};
      const method = (_args.method || "post").toLowerCase();
      const url = _args.endpoint || "";
      const body = _args.body || {};
      const config = _args.config || {};
      let res;
      switch (method) {
        case "post":
          res = (await apiClient.post(url, body, config))?.data;
          break;
        case "put":
          res = (await apiClient.put(url, body, config))?.data;
          break;
        case "delete":
          res = (await apiClient.delete(url, config))?.data;
          break;
        case "patch":
          res = (await apiClient.patch(url, body, config))?.data;
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      return res;
    },
    onSuccess: (_data: any, variables?: ApiMutationArgs) => {
      // Prefer queryKey supplied with this mutate call, otherwise use hook-level key
      const key = (variables as any)?.queryKey || args?.queryKey;
      if (key) {
        // allow key to be either a single key (array) or an array of keys
        if (Array.isArray(key) && key.length > 0 && Array.isArray(key[0])) {
          // array of keys
          (key as any[]).forEach((k) =>
            queryClient.invalidateQueries({ queryKey: k, exact: false })
          );
        } else {
          queryClient.invalidateQueries({
            queryKey: key as any[],
            exact: false,
          });
        }
      }
    },
  });
}
