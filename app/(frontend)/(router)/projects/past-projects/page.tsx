"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePastHighlightedData } from "./hooks/usePastHighlightedData";
import { BulletproofSpinner } from "@/components/BulletproofSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import YearSelector from "./components/YearSelector";
import ProjectCard from "./components/ProjectCard";
import ProjectDetailModal from "./components/ProjectDetailModal";

const ITEMS_PER_PAGE = 6;

export default function PastHighlightedProjects() {
  const { groupedProjects, years, loading, error } = usePastHighlightedData();
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(years[0]);
    }
  }, [years]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  const currentYearItems = useMemo(() => {
    return groupedProjects[selectedYear] || [];
  }, [groupedProjects, selectedYear]);

  const totalPages = Math.ceil(currentYearItems.length / ITEMS_PER_PAGE);
  const displayedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return currentYearItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentYearItems, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById("past-projects-grid");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen p-8">
        <BulletproofSpinner />
        <p
          className="mt-5 text-lg font-semibold text-[#5E5E92] tracking-wide uppercase"
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          Loading Past Projects...
        </p>
      </div>
    );
  }

  if (error || years.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] mx-auto flex flex-col py-8 md:py-12 px-0 md:px-16 border-t border-gray-100 bg-[#F9FAFB]/50">
      <div className="flex flex-col items-center text-center mb-8 px-6 md:px-0">
        <h2 className="text-[#2C305F] text-2xl md:text-4xl font-[1000] tracking-tight uppercase flex items-center gap-2">
          PAST HIGHLIGHTED PROJECTS
        </h2>
        <div className="w-16 md:w-24 h-1 bg-[#2C305F] mt-3 rounded-full" />
      </div>

      <YearSelector
        years={years}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
      />

      {/* Lưới dự án */}
      <div id="past-projects-grid" className="w-full scroll-mt-[10vh]">
        {/* Mobile View: Swipe ngang */}
        <div className="md:hidden flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-6 no-scrollbar">
          {currentYearItems.map((item) => (
            <div
              key={`mb-${item.id}`}
              className="w-[75vw] shrink-0 snap-center"
            >
              <ProjectCard
                item={item}
                onClick={() => setSelectedProject(item)}
              />
            </div>
          ))}
        </div>

        {/* Desktop View: Grid + Pagination */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 px-1">
            <AnimatePresence mode="popLayout">
              {displayedItems.map((item) => (
                <motion.div
                  key={`dk-${item.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard
                    item={item}
                    onClick={() => setSelectedProject(item)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors text-gray-600"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                        currentPage === page
                          ? "bg-[#2C305F] text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors text-gray-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup Chi Tiết */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            selectedYear={selectedYear}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
