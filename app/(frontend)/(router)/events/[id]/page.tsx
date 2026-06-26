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
  Calendar,
  Users,
  ExternalLink,
} from "lucide-react";
import { Button } from "@heroui/react";
import { Toaster, toast } from "react-hot-toast";

import { Event } from "../types";
import { EventCountdown } from "../components/EventCountdown";
import { EventCard } from "../components/EventCard";
import { BulletproofSpinner } from "@/components/BulletproofSpinner";

// --- HELPER COMPONENTS ---

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center w-full h-screen p-8">
    <BulletproofSpinner />
    <p
      className="mt-5 text-lg font-semibold text-ft-primary-blue tracking-wide uppercase"
      style={{
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    >
      Loading Event Details...
    </p>
  </div>
);

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
    <div className="min-h-screen bg-[#F9FAFB] pb-12 font-sans">
      <Toaster position="top-center" />

      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[85vh] flex items-center bg-[#2C305F] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all"
          style={{ backgroundImage: `url(${event.posterUrl})` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(44, 48, 95, 0.85) 0%,
                rgba(28, 31, 66, 0.9) 40%,
                rgba(8, 13, 73, 0.95) 75%,
                rgba(249, 250, 251, 1) 100% 
              )`,
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-16 px-6 lg:px-16 pt-14 lg:pt-20 pb-16 lg:pb-24">
          {/* Top Floating Back Button */}
          <div className="absolute top-4 left-6 md:left-16 z-20">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white font-semibold text-sm transition-all border border-white/10 shadow-sm"
            >
              <ArrowLeft size={16} /> Back to Events
            </Link>
          </div>

          {/* Left Side: Text Info */}
          <div className="w-full lg:max-w-2xl text-white flex flex-col order-2 lg:order-1 mt-6 lg:mt-0">
            {/* Tags */}
            <div className="flex flex-wrap gap-2.5 mb-4 justify-center md:justify-start">
              <span className="bg-[#F7D27F] text-[#2C305F] px-4 py-1.5 rounded-md text-xs lg:text-sm font-bold shadow-sm uppercase tracking-widest">
                {event.mode} Event
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl lg:text-4xl font-[1000] mb-3 text-center md:text-left leading-tight drop-shadow-md tracking-wide uppercase">
              {event.name}
            </h2>

            {/* Description */}
            <p className="text-base lg:text-lg leading-relaxed mb-4 text-gray-200 text-justify md:text-left opacity-95">
              {event.description}
            </p>

            {/* Call to Action Button */}
            <div className="w-full flex justify-center md:justify-start">
              {hasLink && !isExpired ? (
                <div
                  className="w-fit h-fit rounded-md p-[2px] mt-[0.5rem]"
                  style={{
                    background: "linear-gradient(to top, #474A6E, #DBB968)",
                  }}
                >
                  <Button
                    className="bg-ft-primary-blue-300 text-bluePrimary font-bold px-4 py-2 rounded-md hover:bg-yellowCream w-fit md:w-full transition-colors duration-200"
                    as="a"
                    href={event.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    endContent={<ExternalLink size={18} />}
                  >
                    Register Now
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Side: Dynamic Rotated Poster */}
          <div className="w-full lg:w-[40%] relative group order-1 lg:order-2 shrink-0 mt-8 lg:mt-0 flex justify-center">
            <div className="relative w-[85vw] max-w-[450px] lg:max-w-none lg:w-full">
              <div className="absolute inset-0 bg-[#DCB968] rounded-3xl rotate-6 opacity-30 group-hover:rotate-3 transition-transform duration-500" />
              <div className="relative aspect-[16/10] w-full rounded-[1.5rem] lg:rounded-[30px] p-[4px] lg:p-[6px] bg-gradient-to-b from-[rgba(240,237,255,1)] to-[rgba(94,94,146,1)] shadow-2xl transition-transform duration-500">
                <div className="relative w-full h-full rounded-[1.25rem] lg:rounded-[24px] overflow-hidden bg-[#2C305F]">
                  <Image
                    src={event.posterUrl}
                    alt={event.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-fill group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COUNTDOWN SECTION --- */}
      {event.registrationDeadline && (
        <section className="-mt-12 relative z-20 container mx-auto px-4 md:px-20">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100">
            <EventCountdown date={new Date(event.registrationDeadline)} />
          </div>
        </section>
      )}

      {/* --- MAIN CONTENT GRID --- */}
      <section className="container mx-auto max-w-6xl px-4 pt-12 md:pt-14 pb-10 md:pb-12">
        <div
          className={`grid grid-cols-1 gap-8 md:gap-12 ${hasSidebar ? "lg:grid-cols-3" : "lg:grid-cols-1 mx-auto"}`}
        >
          <div
            className={
              hasSidebar
                ? "lg:col-span-2 space-y-8 md:space-y-12"
                : "space-y-8 md:space-y-12"
            }
          >
            {/* 1. Event Details Block */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#2C305F] mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-[#DCB968] rounded-full" />
                Event Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-[#F9FAFB] rounded-2xl border border-gray-50">
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

                <div className="flex items-start gap-4 p-4 bg-[#F9FAFB] rounded-2xl border border-gray-50">
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
                <div className="mt-6 p-6 bg-[#F9FAFB] rounded-2xl border border-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <Users size={20} className="text-[#DCB968]" />
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                      Target Audience
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {event.audience.map((aud, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-1.5 bg-white border border-gray-200 shadow-sm rounded-full text-[#2C305F] text-sm font-bold"
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
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-[900] text-[#2C305F] mb-10 text-center uppercase tracking-wide">
                  Our Guest Speakers
                </h2>
                <div className="flex flex-wrap justify-center gap-10 md:gap-14">
                  {event.guest_speaker.map((speaker, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col items-center text-center w-40 md:w-48"
                    >
                      {/* Avatar Container with Gradient Border */}
                      <div
                        className="relative w-36 h-36 md:w-44 md:h-44 mb-5 rounded-full p-1 shadow-lg group-hover:scale-105 transition-transform duration-300"
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

                        {/* LinkedIn Hover Button */}
                        {speaker.linkedIn_url && (
                          <a
                            href={speaker.linkedIn_url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-1 right-1 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg text-[#0077b5] z-20 hover:bg-[#0077b5] hover:text-white transition-colors border-2 border-white"
                            title="Connect on LinkedIn"
                          >
                            <Linkedin size={20} />
                          </a>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="text-lg md:text-xl font-[900] text-[#2C305F] leading-tight group-hover:text-[#DCB968] transition-colors">
                        {speaker.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mt-2">
                        {speaker.bio}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Partners */}
            {event.partners && event.partners.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-[900] text-[#2C305F] mb-10 text-center uppercase tracking-wide">
                  Our Partners
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 transition-all duration-500">
                  {event.partners.map((logoUrl, idx) => (
                    <div
                      key={idx}
                      className="relative h-14 w-32 md:h-20 md:w-44 hover:scale-105 transition-transform"
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

          {/* RIGHT COL (1/3) - Sticky Sidebar Agenda */}
          {hasSidebar && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl border-t-[6px] border-[#DCB968]">
                  <h3 className="text-2xl font-[900] text-[#2C305F] mb-8 uppercase tracking-wide">
                    Agenda
                  </h3>
                  <div className="space-y-0">
                    {event.agenda.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-5 pb-6 last:pb-0 relative group"
                      >
                        {/* Timeline Connector Line */}
                        {idx !== event.agenda!.length - 1 && (
                          <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-gray-100 group-hover:bg-[#DCB968]/30 transition-colors" />
                        )}
                        {/* Icon Marker */}
                        <div className="relative z-10 mt-0.5 shrink-0">
                          <CheckCircle2
                            size={32}
                            className="text-[#DCB968] bg-white rounded-full shadow-sm"
                          />
                        </div>
                        {/* Content */}
                        <div className="pt-1">
                          <p className="text-[#2C305F] font-bold text-base leading-relaxed">
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
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between mb-2 md:mb-4">
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

          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 -mx-4 px-4 md:mx-0 md:px-0">
            {otherEvents.map((ev) => (
              <div
                key={ev._id}
                className={`snap-center shrink-0 h-full  ${
                  otherEvents.length > 1 ? "w-[85vw] sm:w-[60vw] md:w-auto" : "w-full"
                }`}
              >
                <EventCard event={ev} />
              </div>
            ))}
          </div>

          <div className="md:hidden mt-4 text-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#2C305F]/20 text-[#2C305F] font-semibold hover:bg-[#2C305F] hover:text-white transition-all"
            >
              View All Events
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
