"use client";
import React from "react";

export default function StackedLabel({ label }: { label: string }) {
  const isHR = label.toUpperCase() === "HUMAN RESOURCES";
  
  const charClass = "text-[clamp(1.5rem,1vw+1rem,2.2rem)] py-0.5 font-extrabold leading-none";

  if (isHR) {
    const [first, second] = ["HUMAN", "RESOURCES"];
    return (
      <div className="hidden lg:flex relative h-full w-full items-center justify-center pointer-events-none" aria-hidden="true">
        {/* Đường kẻ dọc màu vàng chạy suốt chiều cao */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#DBB968] z-0" />

        {/* Container chứa chữ - Căn giữa chiều dọc */}
        <div className="relative z-10 flex flex-col gap-12 h-full justify-center">
          
          {/* Chữ HUMAN - Nền màu xanh để che đường kẻ */}
          <div className="flex flex-col items-center bg-[#2C305F] py-2">
            {first.split("").map((c, i) => (
              <span key={`h-${i}`} className={charClass}>{c}</span>
            ))}
          </div>

          {/* Chữ RESOURCES - Nền màu xanh để che đường kẻ */}
          <div className="flex flex-col items-center bg-[#2C305F] py-2">
            {second.split("").map((c, i) => (
              <span key={`r-${i}`} className={charClass}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Các Department khác (Technology, Business...)
  return (
    <div className="hidden lg:flex h-full items-center justify-center pointer-events-none" aria-hidden="true">
      <div className="flex flex-col items-center gap-1">
        {label.split("").map((c, i) => (
          <span key={i} className={charClass}>{c}</span>
        ))}
      </div>
    </div>
  );
}