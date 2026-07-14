import Button from "./Button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface PaginationMeta {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const computedTotalPages =
    typeof meta.pageSize === "number" && typeof meta.totalElements === "number"
      ? Math.max(1, Math.ceil(meta.totalElements / meta.pageSize))
      : Math.max(1, meta.totalPages || 1);

  const currentPage = meta.pageNumber + 1;
  const prevDisabled = meta.pageNumber <= 0;
  const nextDisabled =
    (typeof meta.totalElements === "number" && meta.totalElements === 0) ||
    meta.pageNumber + 1 >= computedTotalPages;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = computedTotalPages;
    const current = currentPage;

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current <= 4) {
        // Near the start
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        // Near the end
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between gap-2 mt-4 px-2">
      {/* Page Info */}
      <div className="text-sm text-gray-600 hidden sm:block">
        Showing page{" "}
        <span className="font-medium text-gray-900">{currentPage}</span> of{" "}
        <span className="font-medium text-gray-900">{computedTotalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 ml-auto">
        {/* First Page */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => onPageChange(0)}
          disabled={prevDisabled}
          className="px-2 py-1.5 min-w-9 h-9 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          <ChevronsLeft size={16} />
        </Button>

        {/* Previous Page */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => onPageChange(Math.max(0, meta.pageNumber - 1))}
          disabled={prevDisabled}
          className="px-2 py-1.5 min-w-9 h-9 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1.5 text-sm text-gray-400"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum - 1)}
                className={`px-3 py-1.5 min-w-9 h-9 text-sm border rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-[#0066FF] text-white border-[#0066FF] hover:bg-[#0052CC] hover:border-[#0052CC] font-semibold shadow-sm"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            onPageChange(Math.min(computedTotalPages - 1, meta.pageNumber + 1))
          }
          disabled={nextDisabled}
          className="px-2 py-1.5 min-w-9 h-9 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>

        {/* Last Page */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => onPageChange(computedTotalPages - 1)}
          disabled={nextDisabled}
          className="px-2 py-1.5 min-w-9 h-9 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  );
}
