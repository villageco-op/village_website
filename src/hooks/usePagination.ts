import { useState, useCallback } from 'react';

/**
 * Hook that handles the pagination state and limits using useState.
 * @param initialLimit - The initial page limit
 * @returns An object containing the page, limit, and callbacks
 */
export function usePagination(initialLimit = 10) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    limit,
    setPage,
    setLimit,
    resetPage,
  };
}
