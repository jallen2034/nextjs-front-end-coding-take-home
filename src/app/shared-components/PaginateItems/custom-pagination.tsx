import React from "react";
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from "lucide-react";
import "./custom-pagination.scss"

// Props interface for the Pagination component.
interface PaginationProps {
  // Required props.
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  // Optional props with defaults
  showFirstLast?: boolean;
  disabled?: boolean;
  className?: string;

  // Server-side specific props
  isLoading?: boolean;

  // Labels for accessibility
  ariaLabel?: string;
  nextLabel?: string;
  prevLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  disabled = false,
  isLoading = false,
  className = '',
  ariaLabel = 'Pagination',
  nextLabel = 'Next page',
  prevLabel = 'Previous page',
  firstLabel = 'First page',
  lastLabel = 'Last page',
}: PaginationProps) => {
  // Avoid using magic numbers.
  const firstPage: number = 1;
  const prevPage: number = currentPage - 1;
  const nextPage: number = currentPage + 1;
  const finalPage: number = totalPages;

  // This helper function determines if a page change is allowed.
  const canChangePage = (targetPage: number): boolean => {
    // Don't allow changes if disabled or loading.
    if (disabled || isLoading) return false;
    // Don't allow going below page 1.
    if (targetPage < 1) return false;
    // Don't allow going past total pages.
    if (targetPage > totalPages) return false;
    // Don't allow changing to current page.
    if (targetPage === currentPage) return false;

    return true;
  }

  // Handler for page changes.
  const handlePageChange = (page: number) => {
    if (canChangePage(page)) {
      onPageChange(page);
    }
  };

  // Get array of page numbers to display (current page and one on each side).
  const getVisiblePages = (): number[] => {
    const pages: number[] = [];

    // Previous page (if exists)
    if (currentPage > 1) {
      pages.push(currentPage - 1);
    }

    // Current page.
    pages.push(currentPage);

    // Next page (if exists)
    if (currentPage < totalPages) {
      pages.push(currentPage + 1);
    }

    return pages
  }

  return (
    <nav className={`pagination ${className}`} aria-label={ariaLabel}>
      {/* First page button. */}
      {showFirstLast && (
        <button
          onClick={(): void => handlePageChange(firstPage)}
          disabled={!canChangePage(firstPage)}
          className={currentPage === firstPage ? "active" : ""}
          aria-label={firstLabel}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      )}
      {/* Previous page button. */}
      <button
        onClick={(): void => handlePageChange(prevPage)}
        disabled={!canChangePage(prevPage)}
        className={currentPage === prevPage ? "active" : ""}
        aria-label={prevLabel}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {/* Page numbers. */}
      {getVisiblePages().map((page: number) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`${
            page === currentPage ? "active" : ""
          }`}
          disabled={disabled || isLoading}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      {/* Next page button. */}
      <button
        onClick={(): void => handlePageChange(nextPage)}
        disabled={!canChangePage(nextPage)}
        aria-label={nextLabel}
      >
        <ChevronRight className="w-4 h-4" />
        {/* Last page button. */}
      </button>
      {showFirstLast && (
        <button
          onClick={(): void => handlePageChange(finalPage)}
          disabled={!canChangePage(finalPage)}
          className={currentPage === finalPage ? "active" : ""}
          aria-label={lastLabel}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  );
};

export default CustomPagination;
