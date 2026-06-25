"use client";

import HeaderTitle from "./headerTitle";
import HoFFilter from "./hall-display/hofFilter";
import Categories from "./hall-display/categories";
import type { HallDisplayProps } from "./types";
import { useSemester } from "./hooks/useSemester";
import Image from "next/image";
import { BulletproofSpinner } from "@/components/BulletproofSpinner";

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
        <div className="flex flex-col items-center pb-6 md:py-10 w-full px-4 md:w-10/12 lg:w-8/12 transition-all duration-300">
          {/* HEADER & FILTER */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end items-center w-full gap-4">
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <HeaderTitle text="Hall of Fame" year={semester.slice(0, 4)} />
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
          <div className="w-full flex justify-center mt-4 min-h-[300px]">
            {isLoading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-64 animate-in fade-in duration-300 w-full">
                <BulletproofSpinner />
                <p
                  className="mt-5 text-lg font-semibold text-ft-primary-blue tracking-wide uppercase"
                  style={{
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                >
                  Loading Hall of Fame...
                </p>
              </div>
            ) : isEmpty ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex justify-center">
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
