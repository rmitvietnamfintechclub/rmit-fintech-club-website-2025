"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchX } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { Spinner } from "@heroui/react";

import { Event } from "./types";
import { EventTicket } from "./components/EventTicket";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-20">
      <Spinner
        size="lg"
        classNames={{
          wrapper: "w-16 h-16",
          circle1: "border-b-ft-primary-yellow border-[4px]",
          circle2: "border-b-ft-primary-yellow border-[4px]",
        }}
      />
      <p className="mt-6 text-lg font-semibold text-ft-primary-blue animate-pulse tracking-wide">
        Loading Upcoming Events...
      </p>
    </div>
  );
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/v1/event", {
          params: {
            type: "upcoming",
            limit: 10,
          },
        });
        const eventData = res.data.data?.events || [];
        setEvents(eventData);
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
             setEvents([]);
             return;
        }

        console.error("Failed to fetch events:", error);
        toast.error("Could not load upcoming events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-ft-background relative overflow-hidden">
      <Toaster position="top-center" />

      {/* --- MAIN CONTENT --- */}
      <div className="container px-20 py-16 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-4 space-y-6">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            {/* --- LEFT DECORATION LINE --- */}
            <div className="relative h-[3px] w-16 md:w-32 bg-ft-primary-blue rounded-full">
              <div className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ft-primary-blue" />
            </div>

            {/* --- TITLE --- */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-ft-primary-blue uppercase tracking-wider drop-shadow-sm">
              Our Upcoming Events
            </h1>

            {/* --- RIGHT DECORATION LINE --- */}
            <div className="relative h-[3px] w-16 md:w-32 bg-ft-primary-blue rounded-full">
              <div className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-ft-primary-blue" />
            </div>
          </div>
        </div>

        {/* Events List Container */}
        <div className="w-full mx-auto space-y-8">
          {loading ? (
            <LoadingState />
          ) : events.length > 0 ? (
            // 2. Render Events
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {events.map((event) => (
                <EventTicket key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="w-full flex justify-center md:mt-8">
              <div className="w-full p-10 md:p-16 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-gray-300/80 shadow-sm">
                <div className="bg-gray-100 p-6 rounded-full mb-6 shadow-inner">
                  <SearchX size={48} className="text-gray-400" />
                </div>

                <div className="space-y-3 mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#2C305F]">
                    No Upcoming Events
                  </h3>
                  <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                    We're busy planning more exciting events for you. Please
                    check back later!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
