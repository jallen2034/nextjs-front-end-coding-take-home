// useServerPagination.ts
import {useState} from "react";
import {Property} from "@/app/map/types";
import {ServerPaginationResponse} from "@/app/api/getPaginatedResults/route";

interface ServerPaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

interface ServerPaginationOptions {
  itemsPerPage: number;
  initialPage?: number;
}

export interface UseServerPaginationReturn {
  currentPage: number;
  totalPages: number;
  paginatedData: Property[];
  setCurrentPage: (page: number) => void;
  getQueryParams: () => { page: number; limit: number };
  handleServerResponse: (response: ServerPaginationResponse) => void;
}

export const useServerPagination = (
  options: ServerPaginationOptions
): UseServerPaginationReturn => {
  const [paginationState, setPaginationState] = useState<ServerPaginationState>({
    currentPage: options.initialPage || 1,
    totalPages: 1,
    itemsPerPage: options.itemsPerPage
  });

  const [paginatedData, setPaginatedData] = useState<Property[]>([]);

  const setCurrentPage = (page: number) => {
    setPaginationState(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const handleServerResponse = (response: ServerPaginationResponse) => {
    setPaginatedData(response.data);
    setPaginationState(prev => ({
      ...prev,
      totalPages: Math.ceil(response.total / prev.itemsPerPage)
    }));
  };

  const getQueryParams = () => ({
    page: paginationState.currentPage,
    limit: paginationState.itemsPerPage
  });

  return {
    currentPage: paginationState.currentPage,
    totalPages: paginationState.totalPages,
    paginatedData,
    setCurrentPage,
    getQueryParams,
    handleServerResponse
  };
};