import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Company } from "./types";

// --- Prop Types ---
type CompanyHighlightProps = {
  company: Company;
  label?: string;
};

// --- Main Component ---
export default function CompanyHighlight({
  company,
  label = "In Partnership With",
}: CompanyHighlightProps) {
  if (!company) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          {label && (
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider md:border-r md:py-8 md:pr-8 md:mr-2">
              {label}
            </span>
          )}

          <Link
            href={company.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 transition-opacity hover:opacity-80"
            title={`Visit ${company.name} website`}
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
              <Image
                src={company.logo_url}
                alt={`${company.name} logo`}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#2C305F]">
                {company.name}
              </h3>
              {company.tagline && (
                <p className="text-gray-600 mt-1">{company.tagline}</p>
              )}
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}