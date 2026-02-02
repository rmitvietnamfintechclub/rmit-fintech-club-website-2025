import React from "react";
import { Pagination } from "@heroui/react";

interface PaginationRoundedProps {
  page: number;
  onPageChange: (value: number) => void;
  count: number;
}

export default function PaginationRounded({
  page,
  onPageChange,
  count,
}: PaginationRoundedProps) {
  return (
    <div className="flex justify-center w-full pb-8">
      <Pagination
        total={count}
        page={page}
        onChange={onPageChange}
        initialPage={1}
        variant="light" 
        radius="full" 
        showControls
        loop={false}
        disableAnimation={false} 
        classNames={{
          wrapper: "gap-2 overflow-visible",
          item: "w-9 h-9 text-ft-primary-blue text-sm font-semibold bg-transparent hover:bg-ft-primary-yellow/20 transition-all duration-200",
          cursor:
            "w-9 h-9 bg-ft-primary-blue text-white font-bold shadow-lg shadow-ft-primary-blue/20 transform transition-transform active:scale-95",
          prev: "text-ft-primary-blue hover:bg-ft-primary-yellow/20 data-[disabled=true]:text-gray-300 data-[disabled=true]:opacity-50",
          next: "text-ft-primary-blue hover:bg-ft-primary-yellow/20 data-[disabled=true]:text-gray-300 data-[disabled=true]:opacity-50",
        }}
      />
    </div>
  );
}