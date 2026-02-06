// app/(admin)/admin/projects/components/ProjectCard.tsx
import React from "react";
import Image from "next/image";
import {
  Edit2,
  Trash2,
  Globe,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: () => void;
}

export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) => {
  const isCompleted = project.status === "completed";

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-ft-primary-yellow/50 transition-all duration-300 flex flex-col h-full overflow-hidden relative">
      {/* Thumbnail Area */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 shrink-0">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-fill group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <Globe size={48} />
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="p-3 bg-white text-ft-primary-blue rounded-full hover:scale-110 transition-transform shadow-lg hover:bg-gray-50"
            title="Edit Project"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-3 bg-white text-ft-danger rounded-full hover:scale-110 transition-transform shadow-lg hover:bg-red-50"
            title="Delete Project"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 shadow-md z-10 border ${
            isCompleted
              ? "bg-[#334155] border-[#475569] text-white"
              : "bg-[#10B981] border-[#34D399] text-white"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 size={12} strokeWidth={3} />
          ) : (
            <Clock size={12} strokeWidth={3} />
          )}
          <span>{project.status}</span>
        </div>

        {/* Year Badge */}
        {isCompleted && project.year && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-sm z-10">
            <Calendar size={12} />
            {project.year}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Labels Row */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[26px]">
          {project.labels && project.labels.length > 0 ? (
            <>
              {project.labels.slice(0, 3).map((label, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wide border border-gray-200"
                >
                  {label}
                </span>
              ))}
              {project.labels.length > 3 && (
                <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-400 text-[10px] font-bold border border-gray-100">
                  +{project.labels.length - 3}
                </span>
              )}
            </>
          ) : (
            <span className="text-[10px] text-transparent select-none bg-gray-50 px-2 py-1 rounded-md">
              No Label
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-ft-primary-blue transition-colors leading-tight">
          {project.title}
        </h3>

        {/* Description */}
        <div className="relative mb-4 flex-1">
          <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Footer Area */}
        <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-end">
          {project.exploreLink ? (
            <a
              href={project.exploreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2 px-4 py-2 rounded-full
                border border-ft-primary-blue
                text-ft-primary-blue text-[11px] font-bold uppercase tracking-wider
                transition-all duration-300 ease-in-out
                hover:bg-ft-primary-blue hover:text-ft-primary-yellow hover:shadow-md hover:-translate-y-0.5
                active:scale-95
                group/link
            "
              onClick={(e) => e.stopPropagation()}
            >
              <Globe
                size={14}
                className="transition-transform duration-300 group-hover/link:rotate-12"
              />
              Visit Website
            </a>
          ) : (
            <div
              className="flex items-center gap-1.5 text-gray-300 select-none cursor-help"
              title="No external link configured"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                No External Link
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
