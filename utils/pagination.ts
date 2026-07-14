export interface PaginationRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  searchKeyword?: string;
  dateFrom: string;
  dateTo: string;
  filters?: Record<string, any>;
}
export interface PaginationResponse<T> {
  data: T[];
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  message?: string;
  status?: string;
}

/**
 * Appends page/size query params to an endpoint, e.g.
 * withPaginationQuery("user/allTrainers", 0, 10) -> "user/allTrainers?page=0&size=10"
 */
export const withPaginationQuery = (
  endpoint: string,
  pageNumber: number,
  pageSize: number,
): string => `${endpoint}?page=${pageNumber}&size=${pageSize}`;
