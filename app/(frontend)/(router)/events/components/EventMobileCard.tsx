"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Event } from "../types";

interface EventMobileCardProps {
  event: Event;
}

export const EventMobileCard = ({ event }: EventMobileCardProps) => {
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const pageBgColor = "#F9FAFB";

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col relative transition-transform active:scale-[0.98]">
      
      {/* =========================================================
          1. TOP: IMAGE & INFO (White Body)
          ========================================================= */}
      <div className="bg-white rounded-t-3xl overflow-hidden flex flex-col border border-gray-100 border-b-0">
        
        {/* Poster Image */}
        <div className="relative w-full h-48 bg-[#1C2039] shrink-0">
          <Image
            src={event.posterUrl}
            alt={event.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 384px"
          />
          {/* Gradient overlay cho ảnh đỡ bị gắt */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Info Content */}
        <div className="p-6 pb-8 space-y-5">
          <h3 className="text-2xl font-[900] text-[#2C305F] uppercase tracking-tight leading-tight line-clamp-2">
            {event.name}
          </h3>

          <div className="space-y-4 mt-1">
            {/* Time */}
            <div className="flex items-start gap-4">
              <div className="mt-0.5 text-[#DCB968]">
                <Clock size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#2C305F] text-lg leading-tight mb-1">
                  {dateStr}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="mt-0.5 text-[#DCB968]">
                <MapPin size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#2C305F] text-lg leading-tight mb-1 capitalize">
                  {event.mode}
                </span>
                <span className="text-sm font-medium text-gray-500 line-clamp-2">
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. MIDDLE: CONNECTOR (Perforated Line & Holes)
          ========================================================= */}
      <div className="relative w-full h-0 flex items-center justify-between z-10 bg-white">
        {/* Lỗ đục bên trái */}
        <div 
          className="absolute -left-4 w-8 h-8 rounded-full z-20" 
          style={{ 
            backgroundColor: pageBgColor,
            boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.04)' 
          }} 
        />
        
        {/* Đường cắt nét đứt */}
        <div className="w-full border-t-[3px] border-dashed border-[#2C305F] mx-6 opacity-30" />
        
        {/* Lỗ đục bên phải */}
        <div 
          className="absolute -right-4 w-8 h-8 rounded-full z-20" 
          style={{ 
            backgroundColor: pageBgColor,
            boxShadow: 'inset 2px 0 3px rgba(0,0,0,0.04)'
          }} 
        />
      </div>

      {/* =========================================================
          3. BOTTOM: STUB (Blue Button)
          ========================================================= */}
      <div className="bg-[#2C305F] rounded-b-3xl overflow-hidden hover:bg-[#1a1d3a] transition-colors relative group">
        <Link href={`/events/${event._id}`} className="block w-full">
          
          {/* Hiệu ứng Shine (bê từ Desktop xuống) */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out z-0" />
          
          <div className="relative w-full py-5 flex items-center justify-center cursor-pointer z-10">
            <span className="text-[#DCB968] font-bold tracking-[0.2em] text-sm uppercase">
              Explore More
            </span>
          </div>

        </Link>
      </div>

    </div>
  );
};