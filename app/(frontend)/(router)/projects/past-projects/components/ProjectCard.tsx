"use client";

import React from "react";
import Image from "next/image";
import { Award } from "lucide-react";

interface ProjectCardProps {
  item: any;
  onClick: () => void;
}

export default function ProjectCard({ item, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#DBB968]/60 flex flex-col h-full transition-all duration-300"
    >
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <Award size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-[#2C305F]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-1 bg-white">
        <h3 className="font-extrabold text-lg md:text-xl text-gray-800 group-hover:text-[#2C305F] transition-colors line-clamp-2 leading-snug mb-2">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <span className="text-[11px] font-bold text-[#DBB968] mt-4 tracking-wider uppercase inline-flex items-center gap-1">
          Click to view details &rarr;
        </span>
      </div>
    </div>
  );
}