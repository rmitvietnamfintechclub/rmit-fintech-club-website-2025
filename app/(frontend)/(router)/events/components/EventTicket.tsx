"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { Event } from "../types";

interface EventTicketProps {
  event: Event;
}

export const EventTicket = ({ event }: EventTicketProps) => {
  // Format Date & Time
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // --- CONFIG ---
  const pageBgColor = "#F9FAFB";

  const sawtoothMaskLeft = {
    maskImage: `
        radial-gradient(circle at left, transparent 6px, black 6.5px), 
        linear-gradient(to right, black, black)
    `,
    WebkitMaskImage: `
        radial-gradient(circle at left, transparent 6px, black 6.5px), 
        linear-gradient(to right, black, black)
    `,
    maskPosition: "0 0, 10px 0",
    WebkitMaskPosition: "0 0, 10px 0",
    maskSize: "20px 20px, 100% 100%",
    WebkitMaskSize: "20px 20px, 100% 100%",
    maskRepeat: "repeat-y, no-repeat",
    WebkitMaskRepeat: "repeat-y, no-repeat",
  };

  const sawtoothMaskRight = {
    maskImage: `
        radial-gradient(circle at right, transparent 6px, black 6.5px),
        linear-gradient(to left, black, black)
    `,
    WebkitMaskImage: `
        radial-gradient(circle at right, transparent 6px, black 6.5px),
        linear-gradient(to left, black, black)
    `,
    maskPosition: "right, -10px 0",
    WebkitMaskPosition: "right, -10px 0",
    maskSize: "20px 20px, 100% 100%",
    WebkitMaskSize: "20px 20px, 100% 100%",
    maskRepeat: "repeat-y, no-repeat",
    WebkitMaskRepeat: "repeat-y, no-repeat",
  };

  return (
    <div className="w-full flex justify-center">
      <article className="group w-full flex flex-col md:flex-row drop-shadow-xl transition-transform duration-300 hover:-translate-y-1 relative z-0 mt-8">
        {/* =========================================================
            1. LEFT: MAIN BODY (White)
            ========================================================= */}
        <div
          className="flex-1 flex flex-col md:flex-row bg-white relative z-10 overflow-hidden"
          style={{
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
            borderTopRightRadius: "0px",
            ...sawtoothMaskLeft,
          }}
        >
          {/* Poster Image */}
          <div className="relative w-full md:w-[36%] h-56 md:h-auto shrink-0">
            <Image
              src={event.posterUrl}
              alt={event.name}
              fill
              className="object-fill transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />
          </div>

          {/* Info Content */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-4 relative">
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#2C305F] uppercase leading-tight tracking-tight line-clamp-2">
              {event.name}
            </h3>

            <div className="space-y-3 mt-1">
              {/* Time */}
              <div className="flex items-center gap-3 text-[#2C305F]">
                <div className="text-[#DCB968] shrink-0">
                  <Clock size={30} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-none mb-1">
                    {dateStr}
                  </span>
                  <span className="text-sm font-medium opacity-80">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-[#2C305F]">
                <div className="text-[#DCB968] shrink-0">
                  <MapPin size={30} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-none mb-1">
                    {event.mode}
                  </span>
                  <span className="text-sm font-medium opacity-80 line-clamp-1">
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. MIDDLE: CONNECTOR (Dashed Line & Holes)
            ========================================================= */}
        <div className="relative flex md:flex-col items-center justify-center">
          {/* Background fillers: Nối màu giữa 2 thẻ */}
          <div className="absolute inset-0 flex flex-col md:flex-row">
            <div className="w-full h-1/2 md:w-1/2 md:h-full bg-[#F2FAFB]"></div>
            <div className="w-full h-1/2 md:w-1/2 md:h-full bg-[#2C305F]"></div>
          </div>

          {/* Đường đứt nét */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-full h-[2px] md:w-[2px] md:h-full border-t-5 md:border-t-0 md:border-l-5 border-dashed border-ft-primary-blue mx-4 md:mx-0 my-2 md:my-0"></div>
          </div>
        </div>

        {/* =========================================================
            3. RIGHT: STUB (Blue)
            ========================================================= */}
        <Link
          href={`/events/${event._id}`}
          className="relative w-full md:w-32 bg-[#2C305F] hover:bg-[#34396e] transition-colors flex items-center justify-center cursor-pointer py-6 md:py-0 group/btn z-10 overflow-hidden"
          style={{
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            ...sawtoothMaskRight,
          }}
        >
          {/* Hiệu ứng Shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out z-0" />

          <div className="relative z-10">
            {/* Desktop */}
            <div className="hidden md:block -rotate-90">
              <span className="text-[#DCB968] font-bold tracking-[0.3em] text-sm uppercase whitespace-nowrap drop-shadow-md group-hover/btn:tracking-[0.4em] transition-all duration-300">
                Explore More
              </span>
            </div>
            {/* Mobile */}
            <div className="md:hidden flex items-center justify-center gap-2">
              <span className="text-[#DCB968] font-bold tracking-[0.2em] text-sm uppercase">
                Explore More
              </span>
            </div>
          </div>
          {/* Top/Left Hole */}
            <div 
                className="absolute z-20 w-12 h-12 rounded-full"
                style={{ 
                    backgroundColor: pageBgColor,
                    top: '-16px', 
                    right: '-24px',
                    boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.05)'
                }}
            >
                <style jsx>{`
                    @media (max-width: 768px) {
                        div { top: 50% !important; left: -16px !important; transform: translateY(-50%) !important; }
                    }
                `}</style>
            </div>

            {/* Bottom/Right Hole */}
            <div 
                className="absolute z-20 w-12 h-12 rounded-full"
                style={{ 
                    backgroundColor: pageBgColor,
                    bottom: '-16px', 
                    right: '-24px',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
            >
                 <style jsx>{`
                    @media (max-width: 768px) {
                        div { bottom: 50% !important; left: auto !important; right: -16px !important; transform: translateY(50%) !important; }
                    }
                `}</style>
            </div>
        </Link>
      </article>
    </div>
  );
};
