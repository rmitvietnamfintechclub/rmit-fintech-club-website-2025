"use client";

import Image from "next/image";
import { FC } from "react";
import { motion } from "framer-motion";

interface ArticleCardProps {
  imageSrc: string;
  imageAlt: string;
  labels: string[];
  title: string;
  description: string;
  date: string;
}

const ArticleCard: FC<ArticleCardProps> = ({
  imageSrc,
  imageAlt,
  labels,
  title,
  description,
  date,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      // --- RESPONSIVE LAYOUT ---
      // Stacks vertically on mobile, row on desktop
      // Height is auto on mobile, fixed on desktop
      // Width is full on mobile, max-w-6xl on desktop
      className="flex flex-col md:flex-row rounded-xl shadow-lg border border-transparent hover:border-[#DBB968] overflow-hidden 
                 w-full max-w-lg mx-auto md:max-w-6xl h-auto md:h-[25rem] mb-8 cursor-pointer"
    >
      {/* --- RESPONSIVE IMAGE --- */}
      {/* Full width, fixed height on mobile */}
      {/* Fixed width, full height on desktop */}
      <div className="relative w-full h-96 md:w-[30%] md:h-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-fill"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>

      {/* --- RESPONSIVE TEXT --- */}
      {/* Full width on mobile, 70% width on desktop */}
      <div className="w-full md:w-[70%] p-4 md:p-6 flex flex-col justify-between bg-[#F9FAFB]">
        <div>
          {/* Labels */}
          <div className="flex flex-wrap gap-2 mb-2">
            {labels.map((label, index) => (
              <span
                key={index}
                className="bg-[#F7D27F] px-3 py-1 rounded-md font-semibold text-sm text-[#2A2A57]"
              >
                {label}
              </span>
            ))}
          </div>
          {/* Responsive Title */}
          <h2 className="text-xl md:text-2xl font-bold text-[#2C305F] line-clamp-2">
            {title}
          </h2>
          {/* Responsive Description */}
          <p className="text-[#2A2A57] text-base mt-2 mb-4 line-clamp-3 md:line-clamp-[9] whitespace-pre-wrap">
            {description}
          </p>
        </div>
        {/* Date */}
        <p className="text-[#2A2A57] italic font-medium text-sm mt-0 md:mt-auto">
          {date}
        </p>
      </div>
    </motion.div>
  );
};

export default ArticleCard;