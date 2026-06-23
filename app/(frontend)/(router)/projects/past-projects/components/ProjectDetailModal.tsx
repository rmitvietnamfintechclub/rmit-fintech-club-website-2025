"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, Calendar, Tag, Award, ExternalLink } from "lucide-react";
import { Button } from "@heroui/react";

interface ProjectDetailModalProps {
  project: any;
  selectedYear: number;
  onClose: () => void;
}

export default function ProjectDetailModal({
  project,
  selectedYear,
  onClose,
}: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <motion.div
      key="modal-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Lớp phủ mờ nền tối phía sau */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0D1742]/70 backdrop-blur-sm"
      />

      {/* Khung nội dung Pop-up chính */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white rounded-[1rem] w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-[#2C305F] max-md:p-2 max-md:rounded-full max-md:bg-white/50 max-md:backdrop-blur-md shadow-sm"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* --- CỘT TRÁI: Khu vực Hình ảnh --- */}
        <div className="relative w-full md:w-[45%] h-48 md:h-auto bg-[#2C305F]/10 shrink-0 order-1">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2C305F]/10 to-[#DBB968]/20 flex items-center justify-center text-[#2C305F]/40">
              <Award size={80} strokeWidth={1} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none md:hidden" />
        </div>

        {/* --- CỘT PHẢI: Khu vực Nội dung --- */}
        <div className="flex flex-col flex-1 w-full order-2 bg-white h-[calc(90vh-12rem)] md:h-[90vh]">
          {/* Content Scrollable Area */}
          <div className="p-6 pt-0 mt-6 md:p-10 md:pt-0 md:mt-10 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
            {/* Thẻ Phân Loại */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#2C305F]/10 text-[#2C305F] text-xs font-black uppercase tracking-wider rounded-md flex items-center gap-1.5 border border-[#2C305F]/10">
                <Calendar size={14} /> Year: {selectedYear}
              </span>
              {project.labels.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#DBB968]/20 text-[#856b2a] text-xs font-black uppercase tracking-wider rounded-md flex items-center gap-1 border border-[#DBB968]/20"
                >
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>

            <h3 className="text-3xl md:text-4xl font-extrabold text-[#2C305F] leading-[1.1] tracking-tight">
              {project.title}
            </h3>

            {/* Đường kẻ phân cách nghệ thuật */}
            <div className="w-16 h-1.5 bg-[#DBB968] rounded-full my-2" />

            {/* Đoạn mô tả chi tiết */}
            <p className="text-gray-600 leading-[1.8] text-base md:text-lg text-justify whitespace-pre-wrap font-medium">
              {project.description}
            </p>

            {project.link && project.link !== "#" && (
            <div className="flex justify-end">
              <Button
                as="a"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2C305F] text-white font-bold px-8 py-6 shadow-lg hover:bg-[#1f2244] hover:shadow-xl transition-all rounded-xl text-base w-full md:w-auto flex items-center justify-center gap-2"
                endContent={<ExternalLink size={18} />}
              >
                Explore More
              </Button>
            </div>
          )}
          </div>

          {/* Footer Cố định (Fixed) chứa Nút Link */}
          
        </div>
      </motion.div>
    </motion.div>
  );
}
