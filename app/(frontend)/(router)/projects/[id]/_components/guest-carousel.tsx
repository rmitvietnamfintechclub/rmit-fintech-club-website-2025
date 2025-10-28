"use client"; 

import React, { useState, useEffect, useCallback } from "react";
import SectionTitle from "./SectionTitle";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Guest } from "./types";

// --- Prop Types ---
type GuestCarouselProps = {
  guest_speakers: Guest[];
  title?: string;
};

// --- Main Component ---
export default function GuestCarousel({
  guest_speakers = [],
  title = "Guest Speakers",
}: GuestCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // --- Carousel State Logic ---
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = (a?: CarouselApi) => { if (!a) return; setCurrent(a.selectedScrollSnap()); };
    const onReInit = (a?: CarouselApi) => { if (!a) return; setCount(a.scrollSnapList().length); setCurrent(a.selectedScrollSnap()); };

    api.on("select", onSelect);
    api.on("reInit", onReInit);

    return () => { api.off("select", onSelect); api.off("reInit", onReInit); };
  }, [api]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  if (!guest_speakers || guest_speakers.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <SectionTitle>{title}</SectionTitle>

        <div className="relative w-full px-16">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
            role="region"
            aria-roledescription="carousel"
            aria-label={title || "Guest Speakers"}
          >
            <CarouselContent className="-ml-4 md:-ml-8">
              {guest_speakers.map((guest) => (
                <CarouselItem
                  key={guest.id}
                  className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
                  role="group"
                  aria-roledescription="slide"
                >
                  <div className="p-1 h-full group">
                    <Card
                      className={cn(
                        "h-full flex flex-col overflow-hidden rounded-2xl shadow-md bg-white border border-gray-100 transition-all duration-300 ease-in-out"
                      )}
                    >
                      <CardBody className="p-0 relative overflow-hidden aspect-[9/10]">
                        <Image
                          src={guest.avatar_url}
                          alt={guest.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </CardBody>
                      <CardFooter className="flex flex-col items-start justify-center flex-grow bg-[#2C305F] text-white p-4">
                        <span className="font-bold text-lg leading-tight mb-0.5">
                          {guest.name}
                        </span>
                        <span className="text-sm text-white/80">
                          {guest.position}
                        </span>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                "absolute -left-16 top-1/2 -translate-y-1/2 disabled:opacity-30",
                "bg-[#F7D27F] text-[#2C305F] border-none shadow-md"
              )}
              aria-label="Previous page of speakers"
            />
            <CarouselNext
              className={cn(
                "absolute -right-16 top-1/2 -translate-y-1/2 disabled:opacity-30",
                "bg-[#F7D27F] text-[#2C305F] border-none shadow-md"
              )}
              aria-label="Next page of speakers"
            />
          </Carousel>

          {count > 1 && (
            <div
              className="mt-8 flex justify-center gap-2"
              aria-label="Carousel Pagination"
            >
              {Array.from(Array(count).keys()).map((index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out",
                    current === index
                      ? "bg-[#2C305F] scale-125"
                      : "bg-[#DBB968]/50 hover:bg-[#DBB968]"
                  )}
                  aria-label={`Go to page ${index + 1}`}
                  aria-current={current === index ? "true" : "false"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}