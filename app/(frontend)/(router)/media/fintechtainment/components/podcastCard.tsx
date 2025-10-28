"use client";

import Image from "next/image";
import { FC } from "react";
import { motion } from "framer-motion"; // Import motion for animations

interface PodcastCardProps {
  imageSrc: string;
  imageAlt: string;
  labels: string[];
  title: string;
  description: string;
  date: string;
}

const PodcastCard: FC<PodcastCardProps> = ({
  imageSrc,
  imageAlt,
  labels,
  title,
  description,
  date,
}) => {
  return (
    // Added motion.div for a subtle hover effect
    <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="flex rounded-xl shadow-lg border border-transparent hover:border-[#DBB968] overflow-hidden max-w-6xl h-[19rem] m-auto mb-8 cursor-pointer"
    >
      <div className="relative w-[40%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-fill"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>
      {/* Text section */}
      <div className="w-[60%] p-6 flex flex-col justify-between bg-[#F9FAFB]">
          <div>
            {/* Labels */}
            <div className="flex gap-2 mb-2">
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
            <p className="text-[#2A2A57] text-base mt-2 mb-4 line-clamp-5 whitespace-pre-wrap">
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

export default PodcastCard;
