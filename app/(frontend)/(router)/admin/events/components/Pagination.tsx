import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Logic to determine which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Total max visible buttons (including ellipsis)

    if (totalPages <= maxVisible) {
      // If few pages, show all: [1, 2, 3, 4, 5]
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first, last, current, and neighbors
      if (currentPage <= 3) {
        // Near start: [1, 2, 3, 4, ..., 100]
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: [1, ..., 97, 98, 99, 100]
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle: [1, ..., 49, 50, 51, ..., 100]
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                <MoreHorizontal size={16} />
              </span>
            );
          }

          return (
            <button
              key={index}
              onClick={() => onPageChange(Number(page))}
              className={`
                min-w-[36px] h-9 px-3 rounded-lg text-sm font-bold transition-all duration-200
                ${currentPage === page
                  ? "bg-ft-primary-blue text-white shadow-md shadow-blue-500/20"
                  : "text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                }
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};