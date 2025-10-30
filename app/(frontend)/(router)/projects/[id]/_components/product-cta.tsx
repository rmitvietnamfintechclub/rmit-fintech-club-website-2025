import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// --- Prop Types ---
type ProductCtaProps = {
  productUrl?: string;
};

export default function ProductCta({ productUrl }: ProductCtaProps) {
  if (!productUrl) {
    return null;
  }

  return (
    <section className="bg-ft-primary-yellow-300 relative py-8 md:py-16">
      <div className="container px-20">
        <div className="grid lg:grid-cols-3 lg:gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6 text-center lg:text-left lg:col-span-2">
            <h2 className="text-4xl lg:text-5xl font-bold text-ft-text-dark leading-tight">
              Explore Our Product!
            </h2>

            <Button
              as={Link}
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ft-primary-yellow rounded-lg text-black font-medium px-8 py-3 text-lg"
            >
              View Product
            </Button>
          </div>

          <div className="hidden lg:block relative lg:col-span-1">
            <div className="absolute w-[50vw] h-[410px] -right-20 -top-[18rem] z-10 overflow-hidden">
              <Image
                src="https://d2uq10394z5icp.cloudfront.net/global/Mascot+-+M%E1%BA%B7t+tr%C6%B0%E1%BB%9Bc.svg"
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