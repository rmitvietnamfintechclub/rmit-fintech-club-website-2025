"use client";

import React from "react";
import Image from "next/image";
import {
  Edit2,
  Trash2,
  Calendar,
  Users,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Article } from "../types";

interface ArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: () => void;
}

export const ArticleCard = ({
  article,
  onEdit,
  onDelete,
}: ArticleCardProps) => {
  const safeAuthors = article.authors || [];
  const safeLabels = article.labels || [];

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-ft-primary-blue/30 transition-all duration-300 flex flex-col h-full overflow-hidden">
      <div className="relative w-full aspect-[8/9] bg-gray-100 overflow-hidden shrink-0">
        {article.illustration_url ? (
          <Image
            src={article.illustration_url}
            alt={article.title}
            fill
            className="object-fill transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
            No Image
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(article);
            }}
            className="p-2 bg-white text-ft-primary-blue rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 bg-white text-ft-danger rounded-full hover:scale-110 transition-transform shadow-lg pointer-events-auto"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Date Badge Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-ft-primary-blue shadow-sm flex items-center gap-1.5 z-10">
          <Calendar size={12} />
          {article.publicationDate
            ? new Date(article.publicationDate).toLocaleDateString("en-GB")
            : "N/A"}
        </div>
      </div>

      {/* === 2. CONTENT BODY (Sạch bóng quân thù, không lo bị đè chữ) === */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3 h-6 overflow-hidden">
          {safeLabels.slice(0, 2).map((label, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md bg-ft-background text-[10px] font-bold text-gray-500 uppercase tracking-wide border border-gray-200 whitespace-nowrap"
            >
              {label}
            </span>
          ))}
          {safeLabels.length > 2 && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-gray-50 text-gray-500">
              +{safeLabels.length - 2}
            </span>
          )}
        </div>

        <h3
          className="text-lg font-bold text-ft-primary-blue mb-2 line-clamp-2 group-hover:text-ft-primary-yellow transition-colors min-h-[3.5rem]"
          title={article.title}
        >
          {article.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-3 mb-4">
          {article.summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Users size={14} className="text-ft-primary-yellow" />
            <span
              className="truncate max-w-[180px] lg:max-w-[220px]"
              title={safeAuthors.join(", ")}
            >
              {safeAuthors.length > 0
                ? safeAuthors.join(", ")
                : "Unknown Author"}
            </span>
          </div>

          {/* Link Preview */}
          {article.content_url && (
            <a
              href={article.content_url}
              target="_blank"
              rel="noreferrer"
              title="Open PDF in new tab"
              className="group/link flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-100 transition-all duration-200 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <FileText
                size={12}
                className="text-gray-500 group-hover/link:text-red-500 transition-colors"
              />
              <span className="text-[10px] font-bold text-gray-600 group-hover/link:text-red-600 uppercase tracking-wide">
                PDF
              </span>
              <ExternalLink
                size={10}
                className="text-gray-400 group-hover/link:text-red-400"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
