"use client";

import HeaderTitle from "./headerTitle";
import HoFFilter from "./hall-display/hofFilter";
import Categories from "./hall-display/categories";
import type { HallDisplayProps } from "./types";
import { useSemester } from "./hooks/useSemester";
import Image from "next/image";

const HallPage = ({
  categories,
  semesters,
  onCategorySelect,
  isEmpty = false,
  emptyComponent,
  isLoading = false,
}: HallDisplayProps) => {
  const { semester, setSemester } = useSemester();

  return (
    <section className="relative py-4 md:py-12 w-full min-h-[80vh]">
      <div className="flex flex-row justify-center w-full">
        {/* Mascot - Giữ nguyên logic ẩn trên mobile */}
        <div className="hidden lg:block">
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
            alt="Mascot"
            width={420}
            height={420}
            loading="lazy"
            className="absolute z-10 left-[-11.5rem] top-[2rem] rotate-[40deg] h-full object-contain"
          />
        </div>

        {/* --- MAIN CONTENT WRAPPER --- */}
        {/* SỬA LỖI Ở ĐÂY: */}
        {/* Mobile: w-full px-4 (để không bị sát lề nhưng vẫn rộng) */}
        {/* Tablet: md:w-10/12 (Rộng hơn chút) */}
        {/* Desktop: lg:w-8/12 (Giữ nguyên tỉ lệ cũ cho màn to) */}
        <div className="flex flex-col items-center py-6 md:py-10 w-full px-4 md:w-10/12 lg:w-8/12 transition-all duration-300">
          
          {/* HEADER & FILTER */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end items-center w-full md:mb-8 gap-4">
            {/* HeaderTitle có thể cần w-full hoặc text-center trên mobile nếu nó chưa handle */}
            <div className="w-full md:w-auto flex justify-center md:justify-start">
               <HeaderTitle text="Hall of Fame" />
            </div>
            
            {/* Filter */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <HoFFilter
                semesters={semesters}
                onSelect={setSemester}
                selectedLabel={semester}
              />
            </div>
          </div>

          {/* CONTENT AREA */}
          {/* Đảm bảo width luôn full trong container cha */}
          <div className="w-full flex justify-center mt-4 min-h-[300px]">
            {isLoading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-64 animate-in fade-in duration-300 w-full">
                <div className="w-12 h-12 border-[5px] border-[#F0EDFF] border-t-[#DCB968] rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-[#5E5E92]">Loading Hall of Fame...</p>
              </div>
            ) : isEmpty ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex justify-center">
                 {/* Empty Component sẽ bung ra hết cỡ theo cha (w-full của cha giờ đã rộng) */}
                 {emptyComponent}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                <Categories
                  categories={categories}
                  setSelectedCategory={onCategorySelect}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HallPage;