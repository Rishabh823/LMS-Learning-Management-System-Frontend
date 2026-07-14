"use client";
import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export default function ReactQueryProvider({
  children,
}: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // React Query v5 removed the per-query onError callback from
        // useQuery, so failures were being silently swallowed with no
        // console signal (axios's own interceptor only toasts HTTP-level
        // errors, not query-level ones like aborted/cancelled requests).
        queryCache: new QueryCache({
          onError: (error, query) => {
            console.error(`Query failed [${JSON.stringify(query.queryKey)}]:`, error);
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
