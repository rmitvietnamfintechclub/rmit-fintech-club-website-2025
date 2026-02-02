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
      {/* 1. Image Cover */}
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

        {/* Date Badge Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-ft-primary-blue shadow-sm flex items-center gap-1.5">
          <Calendar size={12} />
          {article.publicationDate
            ? new Date(article.publicationDate).toLocaleDateString("en-GB")
            : "N/A"}
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3 h-6 overflow-hidden">
          {safeLabels.slice(0, 3).map((label, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md bg-ft-background text-[10px] font-bold text-gray-500 uppercase tracking-wide border border-gray-200 whitespace-nowrap"
            >
              {label}
            </span>
          ))}
          {safeLabels.length > 3 && (
            <span className="text-[10px] text-gray-400 flex items-center">
              +{safeLabels.length - 3}
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
              className="truncate max-w-[120px]"
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
              className="group/link flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-100 transition-all duration-200"
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

      {/* 3. Actions Overlay */}
      <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(article);
          }}
          className="p-2 bg-white/90 backdrop-blur-sm text-ft-primary-blue rounded-full shadow-md hover:bg-ft-primary-blue hover:text-white transition"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 bg-white/90 backdrop-blur-sm text-ft-danger rounded-full shadow-md hover:bg-ft-danger hover:text-white transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
