"use client"; 

import Image from "next/image";
import React, { useState } from "react";
import SectionTitle from "./SectionTitle";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- Prop Types ---
type GalleryProps = {
  gallery: string[];
  imagesPerPage?: number;
};

export default function Gallery({
  gallery = [],
  imagesPerPage = 6,
}: GalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(gallery.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = gallery.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <SectionTitle>Project Gallery</SectionTitle>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {currentImages.map((src, index) => (
              <div
                key={startIndex + index} 
                className="overflow-hidden rounded-lg shadow-sm group relative aspect-video cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`Project Image ${startIndex + index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <nav
              aria-label="Gallery Pagination"
              className="flex items-center justify-center gap-3 mt-4"
            >
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-200 hover:bg-[#DBB968]/30 text-[#2C305F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={cn(
                      "w-9 h-9 rounded-md text-sm font-medium transition-colors",
                      currentPage === pageNumber
                        ? "bg-[#2C305F] text-white shadow-sm"
                        : "bg-gray-200 hover:bg-[#DBB968]/30 text-[#2C305F]"
                    )}
                    aria-current={
                      currentPage === pageNumber ? "page" : undefined
                    }
                    aria-label={`Go to page ${pageNumber}`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md bg-gray-200 hover:bg-[#DBB968]/30 text-[#2C305F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}