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
}: HallDisplayProps) => {
  const { semester, setSemester } = useSemester();

  return (
    <section className="relative py-4 md:py-12 w-full">
      <div className="flex flex-row justify-center">
        {/* Mascot trang trí bên trái */}
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
          {/* Header & Filter: LUÔN HIỂN THỊ để user đổi được kỳ */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end items-center w-full mb-8">
            <HeaderTitle text="Hall of Fame" />
            <HoFFilter
              semesters={semesters}
              onSelect={setSemester}
              selectedLabel={semester}
            />
          </div>

          {/* 👇 LOGIC QUAN TRỌNG Ở ĐÂY 👇 */}
          {isEmpty ? (
            // Nếu không có data -> Render component "Coming Soon"
            <div className="w-full flex justify-center mt-4">
              {emptyComponent}
            </div>
          ) : (
            // Nếu có data -> Render lưới danh mục như bình thường
            <Categories
              categories={categories}
              setSelectedCategory={onCategorySelect}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HallPage;