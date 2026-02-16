import React from "react";
import Image from "next/image";
import { Edit2, Trash2, Calendar, MapPin, Clock } from "lucide-react";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: () => void;
}

export const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
  const eventDate = new Date(event.date).toLocaleDateString("en-GB");

  const hasLink = !!event.registrationLink;
  const isExpired = event.registrationDeadline
    ? new Date(event.registrationDeadline) < new Date()
    : false;

  let badgeText = "No Registration";
  let badgeStyle = "bg-[#F3F4F6]/90 text-[#6B7280] border-[#E5E7EB]"; 

  if (hasLink) {
    if (isExpired) {
      badgeText = "Registration Closed";
      badgeStyle = "bg-[#FEF2F2]/90 text-[#DC2626] border-[#FECACA]";
    } else {
      badgeText = "Registration Open";
      badgeStyle = "bg-[#ECFDF5]/90 text-[#059669] border-[#A7F3D0]";
    }
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#DCB968]/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Poster Area */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {event.posterUrl ? (
          <Image
            src={event.posterUrl}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <Calendar size={48} />
          </div>
        )}

        {/* --- BADGES --- */}
        <div className="absolute top-3 left-3 flex gap-2">
          {/* Mode Badge */}
          <div className="px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm uppercase tracking-wider bg-white/90 text-[#2C305F] backdrop-blur-sm border border-gray-100">
            {event.mode}
          </div>
        </div>

        {/* Registration Status Badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm uppercase tracking-wider backdrop-blur-sm border ${badgeStyle}`}
        >
          {badgeText}
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onEdit(event)}
            className="p-2 bg-white text-[#2C305F] rounded-full hover:scale-110 transition-transform shadow-lg hover:bg-[#EFF6FF]"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white text-[#EF4444] rounded-full hover:scale-110 transition-transform shadow-lg hover:bg-[#FEF2F2]"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Date & Time */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-[#DCB968]" />
            <span>{eventDate}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-[#DCB968]" />
            <span>
              {event.startTime} - {event.endTime}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-[#2C305F] mb-2 line-clamp-1 group-hover:text-[#DCB968] transition-colors"
          title={event.name}
        >
          {event.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <MapPin size={14} className="shrink-0 text-gray-400" />
          <span className="truncate max-w-[200px]" title={event.location}>
            {event.location}
          </span>
        </div>

        {/* Description (New) */}
        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mt-auto">
          {event.description}
        </p>
      </div>
    </div>
  );
};
