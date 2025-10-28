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
import { Partner } from "./types";

// --- Prop Types ---
type PartnersProps = {
  partners: Partner[];
  title?: string;
  carouselThreshold?: number;
};

// --- Logo Component ---
const PartnerLogo = ({ partner }: { partner: Partner }) => (
  <div
    className="group block relative aspect-[3/2]"
    title={partner.name}
  >
    <Image
      src={partner.logo_url}
      alt={`${partner.name} logo`}
      fill
      className="object-contain"
      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
    />
  </div>
);

// --- Main Component ---
export default function Partners({
  partners = [],
  title = "Partners",
  carouselThreshold = 8,
}: PartnersProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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

  if (!partners || partners.length === 0) return null;

  const useCarousel = partners.length > carouselThreshold;

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <SectionTitle>{title}</SectionTitle>

        {useCarousel ? (
          <div className="relative w-full px-8">
            <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: false }}
              className="w-full"
              role="region"
              aria-roledescription="carousel"
              aria-label={title || "Partner Logos"}
            >
              <CarouselContent className="-ml-4">
                {partners.map((partner, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                    role="group"
                    aria-roledescription="slide"
                  >
                    <div className="p-1">
                      <PartnerLogo partner={partner} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className={cn(
                  "absolute -left-8 top-1/2 -translate-y-1/2 disabled:opacity-30",
                  "bg-[#F7D27F] text-[#2C305F] border-none"
                )}
                aria-label="Previous page of logos"
              />
              <CarouselNext
                className={cn(
                  "absolute -right-8 top-1/2 -translate-y-1/2 disabled:opacity-30",
                  "bg-[#F7D27F] text-[#2C305F] border-none"
                )}
                aria-label="Next page of logos"
              />
            </Carousel>

            {count > 1 && (
              <div
                className="mt-6 flex justify-center gap-2"
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
        ) : (
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="w-[120px] sm:w-[140px] md:w-[150px]">
                <PartnerLogo partner={partner} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}