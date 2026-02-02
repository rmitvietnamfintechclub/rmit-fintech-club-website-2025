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
  if (count <= 1) return null;

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
          item: "w-9 h-9 text-[#2C305F] text-sm font-semibold bg-transparent hover:bg-[#DCB968]/20 transition-all duration-200",
          cursor:
            "w-9 h-9 !bg-[#2C305F] text-white font-bold shadow-lg shadow-[#2C305F]/20 transform transition-transform active:scale-95",
          
          // Nút Prev
          prev: [
            "text-[#2C305F] hover:bg-[#DCB968]/20",
            "data-[disabled=true]:text-gray-300 data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
          ].join(" "),

          // Nút Next
          next: [
            "text-[#2C305F] hover:bg-[#DCB968]/20",
            "data-[disabled=true]:text-gray-300 data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
          ].join(" "),
        }}
      />
    </div>
  );
}