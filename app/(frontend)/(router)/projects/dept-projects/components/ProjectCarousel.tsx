"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  MousePointerClick,
} from "lucide-react";
import { Project } from "../../types";

type CarouselProps = {
  items: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

function ProjectCard({
  item,
  isActive,
  onClick,
}: {
  item: Project;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative group/card cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300
        ${
          isActive
            ? "ring-4 ring-[#DBB968] scale-[1.02] z-10"
            : "border border-gray-100 hover:shadow-lg hover:border-[#DBB968]/50 opacity-80 hover:opacity-100 hover:scale-[1.01] hover:z-20"
        }

      `}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-gray-200">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover/card:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <ImageIcon size={32} />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 transition-colors duration-300 bg-white group-hover/card:bg-gray-50">
        <h3
          className={`font-bold text-base line-clamp-2 transition-colors text-gray-800 group-hover/card:text-[#2C305F] ${isActive ? "text-[#2C305F]" : ""}`}
        >
          {item.title}
        </h3>
      </div>
    </div>
  );
}

export default function ProjectCarousel({
  items,
  activeId,
  onSelect,
}: CarouselProps) {
  const [page, setPage] = useState(0);

  const itemsPerPage = 3;

  const pages = useMemo(() => {
    if (!items || items.length === 0) return [];

    const chunks = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      chunks.push(items.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [items]);

  useEffect(() => {
    setPage(0);
  }, [items]);

  if (!items || items.length === 0) return null;

  const canPrev = page > 0;
  const canNext = page < pages.length - 1;

  return (
    <div className="relative w-full group/carousel">
      {/* ========================================== */}
      {/* 📱 NATIVE MOBILE CAROUSEL */}
      {/* ========================================== */}
      <div className="flex md:hidden flex-row gap-6 overflow-x-auto snap-x snap-mandatory px-2 pb-6 pt-2 no-scrollbar">
        {items.map((item) => (
          <div key={`mb-${item.id}`} className="w-[60vw] shrink-0 snap-center">
            <ProjectCard
              item={item}
              isActive={item.id === activeId}
              onClick={() => onSelect(item.id)}
            />
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* 💻 DESKTOP GRID CAROUSEL */}
      {/* ========================================== */}
      <div className="hidden md:block relative w-full px-1">
        <div className="overflow-x-hidden overflow-y-visible py-6 -my-6 px-2">
          <div
            className="flex gap-8 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(calc(-${page * 100}% - ${page * 2}rem))`,
            }}
          >
            {pages.map((group, i) => (
              <div key={i} className="w-full shrink-0 grid grid-cols-3 gap-8">
                {group.map((item: Project) => (
                  <ProjectCard
                    key={`dk-${item.id}`}
                    item={item}
                    isActive={item.id === activeId}
                    onClick={() => onSelect(item.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* --- DESKTOP CONTROLS --- */}
        {pages.length > 1 && (
          <>
            <button
              onClick={() => canPrev && setPage((p) => p - 1)}
              disabled={!canPrev}
              className="absolute top-1/2 -left-5 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/95 shadow-xl text-[#2C305F] hover:bg-[#DBB968] border border-gray-100 disabled:opacity-0 disabled:pointer-events-none transition-all scale-90 hover:scale-100"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => canNext && setPage((p) => p + 1)}
              disabled={!canNext}
              className="absolute top-1/2 -right-5 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/95 shadow-xl text-[#2C305F] hover:bg-[#DBB968] border border-gray-100 disabled:opacity-0 disabled:pointer-events-none transition-all scale-90 hover:scale-100"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>

            {/* Dots Indicator Desktop */}
            <div className="flex justify-center mt-4 gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === page
                      ? "w-6 bg-[#2C305F]"
                      : "w-2 bg-[#2C305F]/20 hover:bg-[#DBB968]"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
