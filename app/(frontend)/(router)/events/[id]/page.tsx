"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  Clock,
  Linkedin,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Spinner } from "@heroui/react";
import { Toaster, toast } from "react-hot-toast";

import { Event } from "../types";
import { EventCountdown } from "../components/EventCountdown";

// --- HELPER COMPONENTS ---

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center w-full h-screen p-8 bg-[#F9FAFB]">
    <Spinner
      size="lg"
      classNames={{
        wrapper: "w-16 h-16",
        circle1: "border-b-ft-primary-yellow border-[4px]",
        circle2: "border-b-ft-primary-yellow border-[4px]",
      }}
    />
    <p className="mt-5 text-lg font-semibold text-[#5E5E92] animate-pulse tracking-wide">
      Loading Event Details...
    </p>
  </div>
);

const OtherEventCard = ({ event }: { event: Event }) => {
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
            className="object-cover transition-transform duration-500 group-hover:scale-110"
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
        <div className="flex flex-col flex-1 p-5">
          <h3
            className="text-lg font-bold text-[#2C305F] line-clamp-1 mb-3 group-hover:text-[#DCB968] transition-colors"
            title={event.name}
          >
            {event.name}
          </h3>

          <div className="mt-auto space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#DCB968]" />
              <span>{event.startTime}</span>
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

export default function EventDetailPage() {
  const params = useParams();

  const [data, setData] = useState<{
    event: Event;
    otherEvents: Event[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const res = await axios.get(`/api/v1/event/${params.id}`);
        setData(res.data.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Could not load event details.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchEventDetail();
  }, [params.id]);

  if (loading) return <LoadingScreen />;
  if (!data || !data.event)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2C305F] font-bold text-xl bg-[#F9FAFB]">
        Event not found.
      </div>
    );

  const { event, otherEvents } = data;

  // Format Date Main Event
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const now = new Date();
  const deadline = event.registrationDeadline
    ? new Date(event.registrationDeadline)
    : null;

  const isExpired = deadline && now > deadline;
  const hasLink = !!event.registrationLink;

  const hasSidebar = event.agenda && event.agenda.length > 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      <Toaster position="top-center" />

      {/* --- HERO SECTION --- */}
      <section
        className="relative w-full text-white py-12 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(to top, #2C305F, #5E5E92)",
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DCB968] rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[120px] opacity-10 -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <Link
            href="/events"
            className="inline-flex items-center text-[#DCB968] hover:text-white transition-colors mb-8 font-medium"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Events
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: Text Info */}
            <div className="flex-1 space-y-6">
              <span className="inline-block px-4 py-1 rounded-full bg-[#DCB968]/20 text-[#DCB968] font-bold text-sm tracking-wider border border-[#DCB968]/50 uppercase">
                {event.mode} Event
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                {event.name}
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                {event.description}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                {hasLink && !isExpired ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-4 bg-[#DCB968] text-[#2C305F] font-bold text-lg rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(220,185,104,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-1"
                  >
                    Register Now
                  </a>
                ) : hasLink && isExpired ? (
                  <button
                    disabled
                    className="px-8 py-4 bg-gray-500 text-white font-bold text-lg rounded-full cursor-not-allowed opacity-70"
                  >
                    Registrations Closed
                  </button>
                ) : null}
              </div>
            </div>

            {/* Right: Poster */}
            <div className="w-full lg:w-[40%] relative group">
              <div className="absolute inset-0 bg-[#DCB968] rounded-3xl rotate-6 opacity-30 group-hover:rotate-3 transition-transform duration-500" />
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                <Image
                  src={event.posterUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COUNTDOWN SECTION --- */}
      {event.registrationDeadline && (
        <section className="-mt-7 relative z-20 container mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
            <EventCountdown date={new Date(event.registrationDeadline)} />
          </div>
        </section>
      )}

      {/* --- MAIN CONTENT GRID --- */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div
          className={`grid grid-cols-1 gap-12 ${
            hasSidebar ? "lg:grid-cols-3" : "lg:grid-cols-1 mx-auto"
          }`}
        >
          <div
            className={hasSidebar ? "lg:col-span-2 space-y-12" : "space-y-12"}
          >
            {/* 1. Event Timeline & Info */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#2C305F] mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-[#DCB968] rounded-full" />
                Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-[#F9FAFB] rounded-2xl">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-[#DCB968]">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                      Time
                    </p>
                    <p className="text-[#2C305F] font-bold text-lg">
                      {event.startTime} - {event.endTime}
                    </p>
                    <p className="text-[#2C305F]/70 text-sm">{dateStr}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[#F9FAFB] rounded-2xl">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-[#DCB968]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                      Location / Platform
                    </p>
                    <p className="text-[#2C305F] font-bold text-lg line-clamp-2">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              {event.audience && event.audience.length > 0 && (
                <div className="mt-6 p-4 bg-[#F9FAFB] rounded-2xl">
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">
                    Who should attend?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {event.audience.map((aud, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[#2C305F] text-sm font-medium"
                      >
                        {aud}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Guest Speakers */}
            {event.guest_speaker && event.guest_speaker.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#2C305F] mb-8 text-center uppercase tracking-wider">
                  Our Guest Speakers
                </h2>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {event.guest_speaker.map((speaker, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col items-center text-center w-40 md:w-48"
                    >
                      {/* Avatar Container */}
                      <div
                        className="relative w-32 h-32 md:w-40 md:h-40 mb-4 rounded-full p-1 shadow-lg group-hover:scale-105 transition-transform duration-300"
                        style={{
                          background:
                            "linear-gradient(to bottom right, #DCB968, #2C305F)",
                        }}
                      >
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-white border-4 border-white">
                          <Image
                            src={
                              speaker.avatar_url ||
                              `https://ui-avatars.com/api/?name=${speaker.name}&background=2C305F&color=fff`
                            }
                            alt={speaker.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* LinkedIn Button (Only visible on hover) */}
                        {speaker.linkedIn_url && (
                          <a
                            href={speaker.linkedIn_url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#2C305F] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-20 hover:bg-[#2C305F] hover:text-white"
                            title="Connect on LinkedIn"
                          >
                            <Linkedin size={20} />
                          </a>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="text-lg md:text-xl font-bold text-[#2C305F] leading-tight group-hover:text-[#DCB968] transition-colors">
                        {speaker.name}
                      </h3>

                      {/* Dùng Bio làm chức danh ngắn gọn, cắt bớt nếu dài */}
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {speaker.bio}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Partners */}
            {event.partners && event.partners.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#2C305F] mb-8 text-center uppercase tracking-wider">
                  Our Partners
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80">
                  {event.partners.map((logoUrl, idx) => (
                    <div
                      key={idx}
                      className="relative h-12 w-32 md:h-16 md:w-40"
                    >
                      <Image
                        src={logoUrl}
                        alt="Partner Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL (1/3) - Sticky Sidebar */}
          {hasSidebar && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="bg-white rounded-[2rem] p-6 shadow-lg border-t-4 border-[#DCB968]">
                  <h3 className="text-xl font-bold text-[#2C305F] mb-6">
                    Agenda
                  </h3>
                  <div className="space-y-0">
                    {event.agenda.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 pb-6 last:pb-0 relative"
                      >
                        {idx !== event.agenda!.length - 1 && (
                          <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gray-100" />
                        )}
                        <div className="relative z-10 mt-1">
                          <CheckCircle2
                            size={24}
                            className="text-[#DCB968] bg-white"
                          />
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium leading-relaxed">
                            {item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- OTHER EVENTS SECTION --- */}
      {otherEvents && otherEvents.length > 0 && (
        <section>
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C305F] uppercase">
                  Other Events
                </h2>
              </div>
              <Link
                href="/events"
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-[#2C305F]/20 text-[#2C305F] font-semibold hover:bg-[#2C305F] hover:text-white transition-all"
              >
                View All Events
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherEvents.map((ev) => (
                <div key={ev._id} className="h-full">
                  <OtherEventCard event={ev} />
                </div>
              ))}
            </div>

            <div className="md:hidden mt-8 text-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#2C305F]/20 text-[#2C305F] font-semibold hover:bg-[#2C305F] hover:text-white transition-all"
              >
                View All Events
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
