"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchX, History, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@heroui/react";
import { Toaster, toast } from "react-hot-toast";
import { BulletproofSpinner } from "@/components/BulletproofSpinner";

import { Event } from "./types";
import { EventTicket } from "./components/EventTicket";
import { EventCard } from "./components/EventCard";
import { EventMobileCard } from "./components/EventMobileCard";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-40">
      <BulletproofSpinner />
      <p
        className="mt-5 text-lg font-bold text-ft-primary-blue tracking-wide uppercase"
        style={{
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      >
        Loading Events...
      </p>
    </div>
  );
};

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [pastPage, setPastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMorePast, setHasMorePast] = useState(true);

  const PAST_LIMIT = 3;

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const [upcomingRes, pastRes] = await Promise.all([
          axios.get("/api/v1/event", {
            params: { type: "upcoming", limit: 5 },
          }),
          axios.get("/api/v1/event", {
            params: { type: "past", page: 1, limit: PAST_LIMIT },
          }),
        ]);

        setUpcomingEvents(upcomingRes.data.data?.events || []);

        const initialPastEvents = pastRes.data.data?.events || [];
        const totalPastCount = pastRes.data.data?.totalCount || 0;

        setPastEvents(initialPastEvents);

        setHasMorePast(initialPastEvents.length < totalPastCount);
      } catch (error: any) {
        console.error("Failed to fetch events:", error);
        toast.error("Could not load events data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMorePast) return;

    setLoadingMore(true);
    const nextPage = pastPage + 1;

    try {
      const res = await axios.get("/api/v1/event", {
        params: { type: "past", page: nextPage, limit: PAST_LIMIT },
      });

      const newEvents = res.data.data?.events || [];
      const totalPastCount = res.data.data?.totalCount || 0;

      const updatedEvents = [...pastEvents, ...newEvents];
      setPastEvents(updatedEvents);
      setPastPage(nextPage);

      if (updatedEvents.length >= totalPastCount) {
        setHasMorePast(false);
      }
    } catch (error) {
      console.error("Failed to load more past events:", error);
      toast.error("Could not load more events.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="bg-ft-background relative font-sans">
      <Toaster position="top-center" />

      <div className="container px-4 md:px-16 pt-8 relative z-10 mx-auto max-w-7xl">
        {/* =========================================================
            1. KHU VỰC SỰ KIỆN SẮP TỚI (UPCOMING)
            ========================================================= */}
        <div className="mb-8 md:mb-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 md:gap-6">
              <div className="relative h-[3px] w-8 md:w-24 bg-ft-primary-blue rounded-full opacity-70">
                <div className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ft-primary-blue" />
              </div>

              <h1 className="text-2xl md:text-5xl font-[1000] text-ft-primary-blue drop-shadow-[0_2px_4px_rgba(255,204,102,0.4)] uppercase tracking-tight">
                <span className="max-md:hidden">Our </span> Upcoming Events
              </h1>

              <div className="relative h-[3px] w-8 md:w-24 bg-ft-primary-blue rounded-full opacity-70">
                <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-ft-primary-blue" />
              </div>
            </div>
          </div>

          <div className="w-full mx-auto">
            {loading ? (
              <LoadingState />
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-6 md:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {upcomingEvents.map((event) => (
                  <React.Fragment key={event._id}>
                    <div className="hidden md:block">
                      <EventTicket event={event} />
                    </div>

                    <div className="block md:hidden">
                      <EventMobileCard event={event} />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center mt-4 md:mt-8">
                <div className="w-full p-10 md:p-14 flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-300 shadow-sm">
                  <div className="mb-5 text-gray-400">
                    <SearchX size={56} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3 mx-auto">
                    <h3 className="text-2xl md:text-3xl font-black text-[#2C305F]">
                      No Upcoming Events
                    </h3>
                    <p className="text-base text-gray-500 font-medium">
                      We're busy planning more exciting events for you.{" "}
                      <br className="hidden md:block" /> Please check back
                      later!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
            2. KHU VỰC LỊCH SỬ SỰ KIỆN (PAST EVENTS ARCHIVE)
            ========================================================= */}
        {!loading && pastEvents.length > 0 && (
          <div className="pt-6 md:pt-8 mb-8 md:mb-12 border-t border-gray-200/60 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row items-center justify-between mb-2 md:mb-6 gap-4">
              <div className="flex items-center gap-3">
                <History
                  className="text-[#DCB968]"
                  size={32}
                  strokeWidth={2.5}
                />
                <h2 className="text-2xl md:text-4xl font-[900] text-[#2C305F] uppercase tracking-wide">
                  Event Archive
                </h2>
              </div>
              <p className="max-md:hidden text-gray-500 font-medium text-sm md:text-base">
                Discover what we've accomplished
              </p>
            </div>

            {/* List hiển thị danh sách Past Events */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 -mx-4 px-4 md:mx-0 md:px-0">
              {pastEvents.map((event) => (
                <div
                  key={event._id}
                  className="min-w-[85vw] sm:min-w-[60vw] md:min-w-0 snap-center shrink-0"
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>

            {/* Nút Load More Tự động Giấu */}
            {hasMorePast && (
              <div className="flex justify-center w-full max-md:mt-2">
                <Button
                  onClick={handleLoadMore}
                  isLoading={loadingMore}
                  spinner={
                    <BulletproofSpinner size={20} className="text-white" />
                  }
                  className="bg-[#2C305F] hover:bg-[#1a1d3a] text-white font-bold px-8 py-6 rounded-full shadow-lg shadow-blue-900/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  {!loadingMore && (
                    <>
                      View More Events{" "}
                      <ChevronDown size={18} className="max-md:hidden" />{" "}
                      <ChevronRight size={18} className="md:hidden" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
