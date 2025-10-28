"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link"; // Import the Link component
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";

// Types remain the same
type ProjectItem = {
  id: string | number;
  title: string;
  imageUrl?: string;
  description?: string;
  slug?: string;
};

function ProjectCard({ item }: { item: ProjectItem }) {
  return (
    <Link
      href={`/projects/${item.slug ?? '#'}`}
      className="group block h-full bg-white rounded-xl overflow-hidden shadow-sm 
                 border-4 border-[#F9FAFB] hover:border-[#DBB968] transition"
    >
      <article className="h-full flex flex-col">
        {/* Image Area with a subtle zoom effect on hover */}
        <div className="relative w-full aspect-[10/7] border-[10px] border-[#2C305F] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-[#2C305F]/40">
            <PhotoIcon className="h-12 w-12" />
          </div>
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-fill transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          )}
        </div>

        <div className="bg-[#2C305F] text-white px-4 pb-4 flex-1">
          <h3 className="font-bold text-lg leading-tight line-clamp-2">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-white/80 mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

function usePerPage() {
  const mq = "(min-width: 768px)";
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(mq);
    const apply = () => setIsDesktop(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  return isDesktop ? 2 : 1;
}

export default function ProjectCarousel({ items }: { items: ProjectItem[] }) {
  const perPage = usePerPage();
  const [page, setPage] = React.useState(0);

  const pages = React.useMemo(() => {
    const out: ProjectItem[][] = [];
    for (let i = 0; i < items.length; i += perPage) {
      out.push(items.slice(i, i + perPage));
    }
    return out;
  }, [items, perPage]);

  React.useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pages.length - 1)));
  }, [pages.length]);
  
  const canPrev = page > 0;
  const canNext = page < pages.length - 1;

  const goPrev = () => canPrev && setPage((p) => p - 1);
  const goNext = () => canNext && setPage((p) => p + 1);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((group, i) => (
            <div
              key={i}
              className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 gap-8 px-8"
            >
              {group.map((item) => (
                <ProjectCard key={item.id} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {pages.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous Project"
            disabled={!canPrev}
            className="absolute top-1/2 left-0 md:-left-10 transform -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-[#DBB968] hover:bg-[#DBB968]/80 text-[#2C305F shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next Project"
            disabled={!canNext}
            className="absolute top-1/2 right-0 md:-right-10 transform -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-[#DBB968] hover:bg-[#DBB968]/80 text-[#2C305F] shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {pages.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition hover:bg-[#DBB968]/60 ${i === page ? "bg-[#DBB968]" : "bg-[#C5C5BF]"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}