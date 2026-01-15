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
  isLoading = false, // <--- Nhận prop loading
}: HallDisplayProps) => {
  const { semester, setSemester } = useSemester();

  return (
    <section className="relative py-4 md:py-12 w-full min-h-[80vh]"> {/* Thêm min-h để tránh co giật chiều cao */}
      <div className="flex flex-row justify-center">
        {/* Mascot */}
        <div className="hidden lg:block">
          <Image
            src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
            alt="Mascot"
            width={420}
            height={420}
            loading="lazy"
            className="absolute z-10 left-[-11.5rem] top-[2rem] rotate-[40deg] h-full"
          />
        </div>

        <div className="flex flex-col items-center py-10 lg:w-8/12 md:w-7/12 w-6/12">
          
          {/* --- KHU VỰC TĨNH (HEADER & FILTER) --- */}
          {/* Luôn hiển thị bất kể đang loading hay không */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end items-center w-full mb-8">
            <HeaderTitle text="Hall of Fame" />
            <HoFFilter
              semesters={semesters}
              onSelect={setSemester}
              selectedLabel={semester}
            />
          </div>

          {/* --- KHU VỰC NỘI DUNG ĐỘNG --- */}
          <div className="w-full flex justify-center mt-4 min-h-[300px]">
            {isLoading ? (
              // 1. STATE LOADING (Giữ nguyên style loading cũ của bạn nhưng đưa vào đây)
              <div className="p-8 text-center flex flex-col items-center justify-center h-64 animate-in fade-in duration-300">
                <div className="w-12 h-12 border-[5px] border-[#F0EDFF] border-t-[#DCB968] rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-[#5E5E92]">Fetching Data...</p>
              </div>
            ) : isEmpty ? (
              // 2. STATE EMPTY
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                 {emptyComponent}
              </div>
            ) : (
              // 3. STATE CÓ DỮ LIỆU
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