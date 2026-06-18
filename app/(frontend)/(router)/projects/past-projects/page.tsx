"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePastHighlightedData } from "./hooks/usePastHighlightedData";
import { ExternalLink, Award, Calendar, X, Tag } from "lucide-react";
import { Button, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PastHighlightedProjects() {
  const { groupedProjects, years, loading, error } = usePastHighlightedData();
  const [selectedYear, setSelectedYear] = useState<number>(0);

  // State quản lý dự án đang được chọn để xem Modal chi tiết
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(years[0]);
    }
  }, [years]);

  const currentYearItems = useMemo(() => {
    return groupedProjects[selectedYear] || [];
  }, [groupedProjects, selectedYear]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen p-8">
        <Spinner
          size="lg"
          classNames={{
            wrapper: "w-16 h-16",
            circle1: "border-b-ft-primary-yellow border-[4px]",
            circle2: "border-b-ft-primary-yellow border-[4px]",
          }}
        />
        <p className="mt-5 text-lg font-semibold text-[#5E5E92] animate-pulse tracking-wide">
          Loading Past Projects...
        </p>
      </div>
    );
  }

  if (error || years.length === 0) return null;

  return (
    <section className="w-full max-w-[1400px] mx-auto flex flex-col py-16 px-6 md:px-16 border-t border-gray-100 bg-[#F9FAFB]/50">
      {/* --- 1. TITLE CENTERED --- */}
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-[#2C305F] text-3xl md:text-4xl font-[1000] tracking-wider uppercase flex items-center gap-2">
          PAST HIGHLIGHTED PROJECTS
        </h2>
        <div className="w-24 h-1 bg-[#2C305F] mt-3 rounded-full" />
      </div>

      {/* --- 2. DYNAMIC TIMELINE HEADER --- */}
      <div className="w-full flex items-center gap-4 mb-6 overflow-x-auto hide-scrollbar py-2">
        {years.map((year) => {
          const isActive = selectedYear === year;
          return (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`text-2xl md:text-3xl font-black transition-all duration-300 px-2 ${
                isActive
                  ? "text-[#DBB968] scale-110"
                  : "text-gray-300 hover:text-gray-400"
              }`}
            >
              {year}
            </button>
          );
        })}
        <div className="flex-1 h-[2px] bg-[#DBB968] min-w-[100px]" />
      </div>

      {/* --- 3. CARDS GRID SYSTEM --- */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-1">
        <AnimatePresence mode="popLayout">
          {currentYearItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedProject(item)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#DBB968]/60 flex flex-col h-full transition-all duration-300"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-fill transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <Award size={48} />
                  </div>
                )}
                {/* Lớp phủ hover nhẹ */}
                <div className="absolute inset-0 bg-[#2C305F]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Text Meta */}
              <div className="p-6 flex flex-col flex-1 bg-white">
                <h3 className="font-extrabold text-lg text-gray-800 group-hover:text-[#2C305F] transition-colors line-clamp-2 leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <span className="text-[11px] font-bold text-[#DBB968] mt-4 tracking-wider uppercase inline-flex items-center gap-1">
                  Click to view details &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- 4. DETAILS POPUP MODAL --- */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Lớp phủ mờ nền tối phía sau */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#0D1742]/60 backdrop-blur-sm"
            />

            {/* Khung nội dung Pop-up chính */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] z-10"
            >
              {/* Nút Đóng góc trên bên phải */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[#2C305F] hover:bg-gray-100 transition-colors shadow-sm"
              >
                <X size={18} />
              </button>

              {/* Nội dung chi tiết văn bản (Có hỗ trợ cuộn dọc nếu chữ quá nhiều) */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-4">
                {/* Cụm thẻ Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#2C305F]/10 text-[#2C305F] text-[11px] font-extrabold uppercase tracking-wider rounded-md flex items-center gap-1.5">
                    <Calendar size={12} /> Year: {selectedYear}
                  </span>
                  {selectedProject.labels.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#DBB968]/20 text-[#856b2a] text-[11px] font-extrabold uppercase tracking-wider rounded-md flex items-center gap-1"
                    >
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-[#2C305F] leading-tight">
                  {selectedProject.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-base text-justify whitespace-pre-wrap">
                  {selectedProject.description}
                </p>
              </div>

              {/* Phần Footer chứa nút liên kết ngoài */}
              {selectedProject.link && selectedProject.link !== "#" && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
                  <Button
                    as="a"
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#2C305F] text-white font-bold px-6 py-2 shadow-md hover:bg-[#1f2244] transition-all rounded-xl text-sm"
                    endContent={<ExternalLink size={14} />}
                  >
                    Explore more
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
