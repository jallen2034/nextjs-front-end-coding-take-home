"use client"
import React, {useEffect} from 'react'
import {
  useClientPagination,
  UseClientPaginationReturn
} from "@/app/shared-components/PaginationContainer/CustomHooks/useClientPagination";
import {Property, ResaleDataFromAPI} from "@/app/map/types";
import CustomPagination from "@/app/shared-components/PaginateItems/custom-pagination";
import {ServerPaginationResponse} from "@/app/api/getPaginatedResults/route";
import {
  useServerPagination,
  UseServerPaginationReturn
} from "@/app/shared-components/PaginationContainer/CustomHooks/useServerPagination";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import {PropertyItem} from "@/app/shared-components/DisplayPropertyItems/displayPropertyItems";
import "./pagination-container.scss"

interface PaginationContainerProps {
  records: ResaleDataFromAPI
}

export const PaginationContainer = ({
  records
}: PaginationContainerProps) => {
  const itemsPerPage = 20;
  const initialPage = 1;

  // Custom hook for Client-side pagination.
  const {
    currentPage: clientPage,
    totalPages: clientTotalPages,
    paginatedData: clientData,
    setCurrentPage: setClientPage
  }: UseClientPaginationReturn = useClientPagination(records, {
    itemsPerPage,
    initialPage
  });

  // Custom hook for Server-side pagination.
  const {
    currentPage: serverPage,
    totalPages: serverTotalPages,
    paginatedData: serverData,
    setCurrentPage: setServerPage,
    getQueryParams,
    handleServerResponse
  }: UseServerPaginationReturn = useServerPagination({
    itemsPerPage,
    initialPage
  });

  // Fetch API paginated data for properties from the API.
  const fetchProperties = async (page: number) => {
    try {
      const { limit } = getQueryParams();
      const response: Response = await fetch(
        `/api/getPaginatedResults?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data: ServerPaginationResponse = await response.json();
      handleServerResponse(data);
      setServerPage(page);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Fetch the server-side data for the initial page when component mounts
  useEffect(() => {
    fetchProperties(initialPage);
  }, []);

  return (
    <div className="pagination-container">
      {/* Client-side container */}
      <div className="pagination-section">
        <Typography variant="h4" color="textPrimary" gutterBottom>
          Client-side Pagination
        </Typography>
        <Card>
          <CardContent>
            {/* Header showing counts */}
            <div className="header">
              <Typography variant="subtitle1" color="textSecondary">
                Showing {clientData.length} properties (Page {clientPage} of{" "}
                {clientTotalPages})
              </Typography>
            </div>
            <Divider />
            {/* Scrollable data container */}
            <div className="scrollable-content">
              <div className="property-list">
                {clientData.map((property: Property) => (
                  <PropertyItem key={property.id} property={property} />
                ))}
              </div>
            </div>
            <Divider />
            {/* Pagination controls */}
            <div className="pagination-controls">
              <CustomPagination
                currentPage={clientPage}
                totalPages={clientTotalPages}
                onPageChange={setClientPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Server-side container */}
      <div className="pagination-section">
        <Typography variant="h4" color="textPrimary" gutterBottom>
          Server-side Pagination
        </Typography>
        <Card>
          <CardContent>
            {/* Header showing counts */}
            <div className="header">
              <Typography variant="subtitle1" color="textSecondary">
                Showing {serverData.length} properties (Page {serverPage} of{" "}
                {serverTotalPages})
              </Typography>
            </div>
            <Divider />
            {/* Scrollable data container */}
            <div className="scrollable-content">
              <div className="property-list">
                {serverData.map((property: Property) => (
                  <PropertyItem
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            </div>
            <Divider />
            {/* Pagination controls */}
            <div className="pagination-controls">
              <CustomPagination
                currentPage={serverPage}
                totalPages={serverTotalPages}
                onPageChange={fetchProperties}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
