import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationRoundedProps {
  page: number;
  onPageChange: (value: number) => void;
  count: number;
  siblingCount?: number; 
}

export default function PaginationRounded({
  page,
  onPageChange,
  count,
  siblingCount = 1,
}: PaginationRoundedProps) {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= count) {
      return Array.from({ length: count }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, count);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < count - 2;

    const firstPageIndex = 1;
    const lastPageIndex = count;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "DOTS", count];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => count - rightItemCount + i + 1
      );
      return [firstPageIndex, "DOTS", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, "DOTS", ...middleRange, "DOTS", lastPageIndex];
    }
    
    return [];
  }, [count, page, siblingCount]);

  if (page === 0 || paginationRange.length < 2) {
    return null;
  }

  // --- 2. Handlers ---
  const onNext = () => {
    if (page < count) onPageChange(page + 1);
  };

  const onPrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  return (
    <div className="flex justify-center items-center gap-2 w-full pb-8 select-none">
      {/* Nút Prev */}
      <button
        onClick={onPrevious}
        disabled={page === 1}
        className={`
          flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200
          ${
            page === 1
              ? "text-[#2C305F]/30 cursor-not-allowed pointer-events-none" // Disable state
              : "text-[#2C305F] hover:bg-[#DCB968]/20 cursor-pointer" // Normal state
          }
        `}
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      {/* Danh sách các trang */}
      {paginationRange.map((pageNumber, index) => {
        // Render dấu 3 chấm
        if (pageNumber === "DOTS") {
          return (
            <div
              key={`dots-${index}`}
              className="flex items-end justify-center w-9 h-9 pb-2 text-gray-400"
            >
              <MoreHorizontal size={20} />
            </div>
          );
        }

        // Render số trang
        return (
          <button
            key={index}
            onClick={() => onPageChange(pageNumber as number)}
            className={`
              flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-200 transform active:scale-95
              ${
                pageNumber === page
                  ? "bg-[#2C305F] text-white shadow-lg shadow-[#2C305F]/30 scale-105" // Active
                  : "text-[#2C305F] hover:bg-[#DCB968]/20 bg-transparent" // Inactive
              }
            `}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Nút Next */}
      <button
        onClick={onNext}
        disabled={page === count}
        className={`
          flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200
          ${
            page === count
              ? "text-[#2C305F]/30 cursor-not-allowed pointer-events-none" // Disable state
              : "text-[#2C305F] hover:bg-[#DCB968]/20 cursor-pointer" // Normal state
          }
        `}
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}