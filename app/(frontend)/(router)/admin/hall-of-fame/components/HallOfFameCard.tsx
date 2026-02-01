import React from "react";
import Image from "next/image";
import { Edit2, Trash2, Trophy, Calendar } from "lucide-react";
import { Honoree } from "../types";

interface HallOfFameCardProps {
  honoree: Honoree;
  onEdit: (honoree: Honoree) => void;
  onDelete: () => void;
}

export const HallOfFameCard = ({ honoree, onEdit, onDelete }: HallOfFameCardProps) => {
  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-ft-primary-yellow/50 transition-all duration-300 flex flex-col h-full">
      
      <div className="flex justify-between items-center mb-3 px-1">
        {/* Category Badge */}
        <div className="flex items-center gap-1.5 text-ft-primary-blue">
          <div className="p-1.5 bg-ft-primary-yellow/10 rounded-full">
            <Trophy size={14} className="text-ft-primary-yellow" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {honoree.category}
          </span>
        </div>

        {/* Semester Badge */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
           <Calendar size={12} className="text-gray-400" />
           <span className="text-[11px] font-bold text-gray-600">{honoree.semester}</span>
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 group-hover:shadow-md transition-all">
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity z-10 pointer-events-none" />

        <Image
          src={honoree.photo_url}
          alt={honoree.name}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* 3. Content Area */}
      <div className="flex flex-col flex-1 items-center text-center">
        <h3 className="font-bold text-ft-primary-blue text-lg leading-tight mb-2 group-hover:text-ft-primary-yellow transition-colors line-clamp-2">
          {honoree.name}
        </h3>
        
        <div className="w-8 h-0.5 rounded-full mb-3 bg-ft-primary-yellow/50"></div>

        <p className="text-sm text-gray-500 line-clamp-3 italic font-light px-1">
          "{honoree.achievement}"
        </p>
      </div>

      {/* 4. Actions Overlay - Vẫn giữ overlay trên ảnh hoặc chuyển xuống dưới góc */}
      {/* Ở đây mình để full card overlay cho gọn */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl" />
        
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(honoree); }}
          className="pointer-events-auto p-3 bg-white border border-ft-primary-blue-200 text-ft-primary-blue rounded-full shadow-lg hover:bg-ft-primary-blue hover:text-white transition transform hover:scale-110"
          title="Edit"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="pointer-events-auto p-3 bg-white border border-ft-danger text-ft-danger rounded-full shadow-lg hover:bg-ft-danger hover:text-white transition transform hover:scale-110"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};