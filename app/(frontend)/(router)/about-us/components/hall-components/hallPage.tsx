import HeaderTitle from "./headerTitle";
import HoFFilter from "./hall-display/hofFilter";
import Categories from "./hall-display/categories";
import type { HallDisplayProps } from "./types";
import { useSemester } from "./hooks/useSemester";
import Image from "next/image";

const HallDisplay = ({
  categories,
  semesters,
  onCategorySelect,
}: HallDisplayProps) => {
  const { semesterLabel, setSemester } = useSemester();

  return (
    <section className="relative py-12 overflow-hidden bg-[#F9FAFB]">
      <div className="flex flex-row justify-center">
        <div className="hidden lg:block">
          <Image
            src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
            alt="Mascot"
            width={420}
            height={420}
            loading="lazy"
            className="
                absolute z-10 left-[-11.5rem] top-[2rem] rotate-[40deg] h-full
              "
          />
        </div>

        <div className="flex flex-col items-center py-10 lg:w-8/12 md:w-7/12 w-6/12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end items-center w-full">
            <HeaderTitle text="Hall of Fame" />
            <HoFFilter
              semesters={semesters}
              onSelect={setSemester}
              selectedLabel={semesterLabel}
            />
          </div>

          <Categories
            categories={categories}
            setSelectedCategory={onCategorySelect}
          />
        </div>
      </div>
    </section>
  );
};

export default HallDisplay;
