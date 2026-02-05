import React from "react";
import Image from "next/image";
import { Edit2, Trash2, Calendar, Play } from "lucide-react";
import { Reel } from "../types";

interface ReelCardProps {
  reel: Reel;
  onEdit: (reel: Reel) => void;
  onDelete: () => void;
}

export const ReelCard = ({ reel, onEdit, onDelete }: ReelCardProps) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-ft-primary-yellow/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {reel.thumbnailUrl ? (
          <Image
            src={reel.thumbnailUrl}
            alt={reel.title}
            fill
            className="object-fill group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <Play size={48} />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(reel)}
            className="p-2 bg-white text-ft-primary-blue rounded-full hover:scale-110 transition-transform shadow-lg"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white text-ft-danger rounded-full hover:scale-110 transition-transform shadow-lg"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Date Badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
          <Calendar size={10} />
          {new Date(reel.publicationDate).toLocaleDateString("en-GB")}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Labels */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {reel.labels.slice(0, 3).map((label, idx) => (
            <span
              key={idx}
              className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-ft-primary-blue border border-blue-100"
            >
              {label}
            </span>
          ))}
          {reel.labels.length > 3 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-50 text-gray-500">
              +{reel.labels.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-ft-primary-blue transition-colors" title={reel.title}>
          {reel.title}
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-3">
          {reel.description}
        </p>
      </div>
    </div>
  );
};