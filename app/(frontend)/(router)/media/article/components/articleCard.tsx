"use client";

import Image from "next/image";
import { FC } from "react";
import { motion } from "framer-motion"; // Import motion for animations

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
    // Applied motion.div and consistent styling from PodcastCard
    <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex rounded-xl shadow-lg border border-transparent hover:border-[#DBB968] overflow-hidden max-w-6xl h-[25rem] m-auto mb-8 cursor-pointer"
    >
      <div className="relative w-[30%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="h-full aspect-auto object-fill"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>
      {/* Text section */}
      <div className="w-[70%] p-6 flex flex-col justify-between bg-[#F9FAFB]">
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
            {/* Title */}
            <h2 className="text-2xl font-bold text-[#2C305F] line-clamp-2">{title}</h2>
            {/* Description */}
            <p className="text-[#2A2A57] text-base mt-2 mb-4 line-clamp-[9] whitespace-pre-wrap">
              {description}
            </p>
          </div>
          {/* Date */}
          <p className="text-[#2A2A57] italic font-medium text-sm mt-auto">
            {date}
          </p>
      </div>
    </motion.div>
  );
};

export default ArticleCard;
