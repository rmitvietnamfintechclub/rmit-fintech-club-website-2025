"use client";

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
    <div className="flex justify-center w-full">
      <div className="bg-[#F7D27F] p-2 mb-8 rounded-lg w-fit">
        <Pagination
          total={count}
          page={page}
          onChange={onPageChange}
          initialPage={1}
          siblings={0}
          boundaries={1}
          variant="light"
          radius="md"
          showControls
          loop={false} 
          classNames={{
            wrapper: "gap-2 overflow-visible",
            
            item: "w-8 h-8 text-[#2C305F] font-bold bg-transparent hover:bg-[#FFEFCA] data-[hover=true]:bg-[#FFEFCA] transition-colors rounded-lg",
            
            cursor:
              "w-8 h-8 bg-[#2C305F] text-white font-bold shadow-[0_3px_5px_rgba(0,0,0,0.2)] rounded-lg",
            
            prev: [
              "text-[#2C305F] hover:bg-[#FFEFCA] rounded-lg",
              "data-[disabled=true]:text-[#2C305F] data-[disabled=true]:opacity-30 data-[disabled=true]:cursor-not-allowed hover:data-[disabled=true]:bg-transparent",
            ].join(" "),

            next: [
              "text-[#2C305F] hover:bg-[#FFEFCA] rounded-lg",
              "data-[disabled=true]:text-[#2C305F] data-[disabled=true]:opacity-30 data-[disabled=true]:cursor-not-allowed hover:data-[disabled=true]:bg-transparent",
            ].join(" "),
          }}
        />
      </div>
    </div>
  );
}