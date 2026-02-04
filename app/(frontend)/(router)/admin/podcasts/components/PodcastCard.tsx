import React from "react";
import Image from "next/image";
import { Edit2, Trash2, Calendar, Youtube, Linkedin, User } from "lucide-react";
import { Podcast } from "../types";

interface PodcastCardProps {
  podcast: Podcast;
  onEdit: (podcast: Podcast) => void;
  onDelete: () => void;
}

export const PodcastCard = ({
  podcast,
  onEdit,
  onDelete,
}: PodcastCardProps) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-ft-primary-yellow/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Thumbnail Area */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {podcast.thumbnail_url ? (
          <Image
            src={podcast.thumbnail_url}
            alt={podcast.title}
            fill
            className="object-fill group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <Youtube size={48} />
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(podcast)}
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
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm">
          <Calendar size={12} />
          {new Date(podcast.publicationDate).toLocaleDateString("en-GB")}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Labels */}
        <div className="flex flex-wrap gap-1.5 mb-3 h-6 overflow-hidden">
          {podcast.labels.slice(0, 3).map((label, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-ft-background text-[10px] font-bold text-gray-500 uppercase tracking-wide border border-gray-200 whitespace-nowrap"
            >
              {label}
            </span>
          ))}
          {podcast.labels.length > 3 && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-gray-50 text-gray-500">
              +{podcast.labels.length - 3}
            </span>
          )}
        </div>
        {/* Title */}
        <h3 className="text-lg font-bold text-ft-primary-blue mb-2 line-clamp-2 group-hover:text-ft-primary-yellow transition-colors min-h-[3.5rem]">
          {podcast.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3">
          {podcast.summary}
        </p>
        {/* Guest Speaker Info (Mini Card) */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
            {podcast.guest_speaker.avatar_url ? (
              <Image
                src={podcast.guest_speaker.avatar_url}
                alt={podcast.guest_speaker.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-700 truncate">
              {podcast.guest_speaker.name}
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              {podcast.guest_speaker.description}
            </p>
          </div>
          {podcast.guest_speaker.linkedIn_url && (
            <a
              href={podcast.guest_speaker.linkedIn_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
