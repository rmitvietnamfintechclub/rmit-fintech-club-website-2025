"use client";

import { Button, Card, CardBody, CardFooter, cn } from "@heroui/react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import React, { useState, useEffect, useCallback } from "react";
import SectionTitle from "./SectionTitle";
import Image from "next/image";
import { Product } from "./types";

// --- Prop Types ---
type ProductCarouselProps = {
  products: Product[];
  title?: string;
  exploreLink?: string;
};

// Helper function for formatting dates

const addOrdinalSuffix = (day: number): string => {
  if (day > 10 && day < 14) return `${day}th`;
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

const formatPublicationDate = (isoString?: string): string => {
  if (!isoString) return "";
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) return "";
  const day = addOrdinalSuffix(dateObj.getDate());
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
};

// --- Main Component ---
export default function ProductCarousel({
  products = [],
  title = "Our Latest Products",
  exploreLink = "/media",
}: ProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = (a?: CarouselApi) => {
      if (!a) return;
      setCurrent(a.selectedScrollSnap());
    };
    const onReInit = (a?: CarouselApi) => {
      if (!a) return;
      setCount(a.scrollSnapList().length);
      setCurrent(a.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onReInit);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onReInit);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="flex flex-col items-center mx-auto px-20">
        <SectionTitle>{title}</SectionTitle>
        <div className="relative w-full px-8 md:px-16">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
            role="region"
            aria-roledescription="carousel"
            aria-label={title}
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                  role="group"
                  aria-roledescription="slide"
                >
                  <div className="p-1 h-full">
                    <Link
                      href={`${exploreLink}/${product.id}`}
                      key={`${product.id}`}
                    >
                      <Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-md border-2 border-transparent hover:border-[#DBB968] transition-shadow hover:shadow-lg group duration-300">
                        <CardBody className={`p-0 relative w-full ${exploreLink === "/media/article" ? 'h-80' : 'h-48'} overflow-hidden`}>
                          <Image
                            src={product.image}
                            alt={product.title}
                            layout="fill"
                            objectFit="fill"
                            className="transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </CardBody>
                        <CardFooter className="flex flex-col gap-2 items-start justify-center flex-grow bg-[#2C305F] text-white p-4">
                          <span className="font-semibold text-base leading-tight">
                            {product.title}
                          </span>
                          <span className="font-light text-sm italic">
                            {formatPublicationDate(product.publicationDate)}
                          </span>
                        </CardFooter>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={cn(
                "absolute -left-16 top-1/2 -translate-y-1/2 disabled:opacity-30",
                "bg-[#F7D27F] text-[#2C305F] border-none shadow-md"
              )}
              aria-label="Previous page of products"
            />
            <CarouselNext
              className={cn(
                "absolute -right-16 top-1/2 -translate-y-1/2 disabled:opacity-30",
                "bg-[#F7D27F] text-[#2C305F] border-none shadow-md"
              )}
              aria-label="Next page of products"
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
          <div className="w-full flex justify-center">
            <Button
              as={Link}
              href={exploreLink}
              className="mt-6 max-w-fit bg-[#DBB968] text-[#2C305F] font-semibold rounded-lg hover:brightness-105"
            >
              Explore More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
