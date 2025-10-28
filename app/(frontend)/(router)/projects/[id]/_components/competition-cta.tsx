import { Button } from "@heroui/react";
import Image from "next/image";
import React from "react";
import Link from "next/link";

// --- Prop Types ---
type CompetitionCtaProps = {
  detailsUrl?: string;
};

export default function CompetitionCta({ detailsUrl }: CompetitionCtaProps) {
  if (!detailsUrl) {
    return null;
  }

  return (
    <section className="bg-ft-primary-yellow-300 relative py-8 md:py-16 mt-12 mb-20">
      <div className="container px-20">
        <div className="grid lg:grid-cols-3 lg:gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6 text-center lg:text-left lg:col-span-2">
            <h2 className="text-[2.25rem] lg:text-[3rem] max-w-lg font-bold text-ft-text-dark leading-tight">
              Learn more about our competition!
            </h2>

            <Button
              as={Link}
              href={detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ft-primary-yellow rounded-lg text-black font-medium px-8 py-3 text-lg"
            >
              Explore More
            </Button>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="absolute w-[50vw] h-[395px] -right-[2rem] -top-[5.25rem] z-10 overflow-hidden">
              <Image
                src="https://d2prwyp3rwi40.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+b%C3%AAn.svg"
                alt="Bear Mascot Illustration"
                width={600}
                height={600}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
