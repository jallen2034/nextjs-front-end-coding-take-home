// useClientPagination.ts
import {useMemo, useState} from "react";
import {Property} from "@/app/map/types";

interface ClientPaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

interface ClientPaginationOptions {
  itemsPerPage: number;
  initialPage?: number;
}

export interface UseClientPaginationReturn {
  currentPage: number;
  totalPages: number;
  paginatedData: Property[];
  setCurrentPage: (page: number) => void;
}

export const useClientPagination = (
  data: Property[],
  options: ClientPaginationOptions
): UseClientPaginationReturn => {
  const [paginationState, setPaginationState] = useState<ClientPaginationState>({
    currentPage: options.initialPage || 1,
    totalPages: Math.ceil(data.length / options.itemsPerPage),
    itemsPerPage: options.itemsPerPage
  });

  const setCurrentPage = (page: number) => {
    setPaginationState((prev: ClientPaginationState): ClientPaginationState => ({
      ...prev,
      currentPage: page
    }));
  };

  const paginatedData: Property[] = useMemo((): Property[] => {
    const startIndex: number = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex: number = startIndex + paginationState.itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, paginationState.currentPage, paginationState.itemsPerPage]);

  return {
    currentPage: paginationState.currentPage,
    totalPages: paginationState.totalPages,
    paginatedData,
    setCurrentPage
  };
};