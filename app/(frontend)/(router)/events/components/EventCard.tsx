"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const dateObj = new Date(event.date);

  const day = dateObj.getDate();

  const month = dateObj.toLocaleString("en-US", { month: "short" });

  return (
    <Link href={`/events/${event._id}`} className="group h-full">
      <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image Container */}

        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={event.posterUrl}
            alt={event.name}
            fill
            className="object-fill"
          />

          {/* Date Badge */}

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-lg">
            <span className="block text-xl font-bold text-[#2C305F] leading-none">
              {day}
            </span>

            <span className="block text-xs font-bold text-[#DCB968] uppercase">
              {month}
            </span>
          </div>

          {/* Mode Badge */}
          <div className="absolute top-4 right-4 bg-[#2C305F]/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              {event.mode}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 md:p-5">
          <h3
            className="text-lg font-bold text-[#2C305F] line-clamp-2 max-md:truncate max-md:max-w-[300px] mb-3 group-hover:text-[#DCB968] transition-colors"
            title={event.name}
          >
            {event.name}
          </h3>

          <div className="mt-auto space-y-2 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#DCB968]" />

              <span>{event.startTime} - {event.endTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#DCB968]" />

              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Mini Button */}

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[#2C305F] font-semibold text-sm">
            <span>Details</span>

            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
