/**
 * -------------------------------------------------------------
 * useInfiniteScroll
 * -------------------------------------------------------------
 * A reusable hook that connects scrolling to infinite query.
 *
 * Purpose:
 * - Automatically loads next page when user scrolls near bottom.
 * - Uses IntersectionObserver (modern browser API).
 *
 * How it works:
 * - You attach returned ref to a div at bottom.
 * - When that div becomes visible in viewport,
 *   it triggers fetchNextPage().
 *
 * enabled flag:
 * - Allows turning infinite scroll on/off.
 * -------------------------------------------------------------
 */

import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  hasNextPage?: boolean;     // Provided by useInfiniteQuery
  fetchNextPage: () => void; // Function to fetch next page
  enabled?: boolean;         // Optional toggle
}

const useInfiniteScroll = ({
  hasNextPage,
  fetchNextPage,
  enabled = true,
}: UseInfiniteScrollProps) => {

  /**
   * This ref will be attached to a div at bottom of page.
   * When this div becomes visible → observer triggers.
   */
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!loadMoreRef.current) return;

    /**
     * IntersectionObserver:
     * Watches an element and detects when it enters viewport.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        /**
         * entries[0].isIntersecting
         * = true when element is visible on screen.
         */
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        /**
         * rootMargin:
         * Triggers earlier before exact bottom.
         * Makes scrolling smoother.
         */
        rootMargin: "150px",
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, enabled]);

  return loadMoreRef;
};

export default useInfiniteScroll;
