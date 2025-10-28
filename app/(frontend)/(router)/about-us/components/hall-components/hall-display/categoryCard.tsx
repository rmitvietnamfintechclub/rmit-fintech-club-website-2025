"use client";
import { useRouter } from "next/navigation";
import type { CategoryCardProps } from "../types";

export default function CategoryCard({ category, setSelectedCategory }: CategoryCardProps) {
  const router = useRouter();

  return (
    <div 
        className="
            inline-block
            bg-[linear-gradient(to_bottom,#C9D6EA,#DBB968)]
            p-2
            m-1
            rounded-xl
            xl:w-96
            lg:w-72
            md:w-56
            w-52
        "
        style={{
            boxShadow: "0 3px 0 0 #2C305F" // X-offset, Y-offset, blur, spread, color
        }}
    >
        <button
          key={category}
          onClick={() => setSelectedCategory?.(category)}
          className="bg-[#2C305F] text-[#DCB968] font-semibold px-4 py-2 rounded-md hover:shadow-lg w-full xl:text-2xl lg:text-lg text-sm"
        >
          {category}
        </button>
    </div>
  );
}