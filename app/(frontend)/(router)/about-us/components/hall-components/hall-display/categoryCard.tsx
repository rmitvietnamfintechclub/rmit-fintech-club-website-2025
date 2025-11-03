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
            md:m-1 max-md:my-2
            rounded-xl
            md:w-96
            w-[87vw]
        "
        style={{
            boxShadow: "0 3px 0 0 #2C305F" // X-offset, Y-offset, blur, spread, color
        }}
    >
        <button
          key={category}
          onClick={() => setSelectedCategory?.(category)}
          className="bg-[#2C305F] text-[#DCB968] font-semibold px-4 py-2 rounded-md hover:shadow-lg w-full md:text-2xl text-lg"
        >
          {category}
        </button>
    </div>
  );
}