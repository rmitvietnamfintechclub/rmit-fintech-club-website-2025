"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon, MousePointerClick } from "lucide-react";
import { Project } from "../../types";

type CarouselProps = {
  items: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

function ProjectCard({ item, isActive, onClick }: { item: Project; isActive: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative group/card cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300
        ${isActive 
          ? "ring-4 ring-[#DBB968] shadow-xl scale-[1.02] z-10"
          : "border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#DBB968]/50 opacity-80 hover:opacity-100 hover:scale-[1.01] hover:z-20"
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
        
        {!isActive && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white backdrop-blur-[1px]">
            <MousePointerClick size={32} className="drop-shadow-md" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 transition-colors duration-300 bg-white group-hover/card:bg-gray-50">
        <h3 className={`font-bold text-base line-clamp-2 transition-colors text-gray-800 group-hover/card:text-[#2C305F] ${isActive ? "text-[#2C305F]" : ""}`}>
          {item.title}
        </h3>
      </div>
    </div>
  );
}

export default function ProjectCarousel({ items, activeId, onSelect }: CarouselProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [page, setPage] = useState(0);

  // State quản lý tọa độ chạm vuốt trên Mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const checkMedia = () => setIsDesktop(window.innerWidth >= 768);
    checkMedia();
    window.addEventListener("resize", checkMedia);
    return () => window.removeEventListener("resize", checkMedia);
  }, []);

  const itemsPerPage = isDesktop ? 3 : 2; 

  const pages = useMemo(() => {
    if (!items || items.length === 0) return []; 
    
    const chunks = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      chunks.push(items.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [items, itemsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [items]);

  if (!items || items.length === 0) return null;

  const canPrev = page > 0;
  const canNext = page < pages.length - 1;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canNext) setPage((p) => p + 1);
    if (isRightSwipe && canPrev) setPage((p) => p - 1);

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div 
      className="relative w-full group/carousel px-1 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="overflow-visible rounded-xl py-2"> 
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((group, i) => (
            <div key={i} className="w-full shrink-0 grid grid-cols-2 md:grid-cols-3 gap-8 px-1">
              {group.map((item) => (
                <ProjectCard 
                  key={item.id} 
                  item={item} 
                  isActive={item.id === activeId}
                  onClick={() => onSelect(item.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {pages.length > 1 && (
        <>
          <button
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev}
            className="absolute top-1/2 -left-3 md:-left-5 -translate-y-1/2 z-30 p-2 rounded-full bg-white/90 shadow-lg text-[#2C305F] hover:bg-[#DBB968] border border-gray-100 disabled:opacity-0 disabled:pointer-events-none transition-all scale-90 hover:scale-100"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            className="absolute top-1/2 -right-3 md:-right-5 -translate-y-1/2 z-30 p-2 rounded-full bg-white/90 shadow-lg text-[#2C305F] hover:bg-[#DBB968] border border-gray-100 disabled:opacity-0 disabled:pointer-events-none transition-all scale-90 hover:scale-100"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 gap-2 py-2">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page ? "w-6 bg-[#2C305F]" : "w-2 bg-[#2C305F]/10 hover:bg-[#DBB968]"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}