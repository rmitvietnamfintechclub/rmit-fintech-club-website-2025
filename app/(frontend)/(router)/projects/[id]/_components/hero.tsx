import { Button, Chip } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

type HeroProps = {
  title: string;
  description: string;
  image_url: string;
  labels: string[];
  status: string;
  detailsUrl?: string;
};

export default function Hero({
  title,
  description,
  image_url,
  labels,
  status,
  detailsUrl,
}: HeroProps) {
  return (
    <section className="h-[92vh]">
      <div className="w-full h-full flex gap-4 items-center">
        {/* Left Column */}
        <div className="w-[58%] h-full bg-ft-primary-blue-200 rounded-br-[2.5rem] flex flex-col justify-center px-20 text-ft-primary-blue-100">
          <div className="flex justify-between">
            <div className="flex flex-wrap gap-3 mb-4 mr-4">
              {labels.map((label) => (
                <Chip
                  key={label}
                  className="bg-ft-primary-blue-300 text-ft-text-dark"
                >
                  {label}
                </Chip>
              ))}
            </div>
            <Chip className="bg-ft-primary-yellow-300 text-ft-primary-yellow-100">
              {status}
            </Chip>
          </div>

          <h1 className="text-[2rem] lg:text-[2.5rem] font-bold mb-4 leading-tight text-ft-primary-blue-300">
            {title}
          </h1>

          <p className="text-ft-text-bright text-base mb-4 leading-relaxed text-justify">
            {description}
          </p>

          <div className="flex flex-start gap-4">
            {detailsUrl ? (
              <Button
                as={Link}
                href={detailsUrl}
                className="bg-ft-primary-yellow hover:bg-ft-primary-yellow/90 text-ft-text-dark rounded-lg px-6 w-fit text-md font-semibold"
              >
                Visit our Website
              </Button>
            ) : null}

            <Button
              as={Link}
              href="/projects"
              className="bg-ft-primary-blue-300 hover:bg-ft-primary-blue-300/90 text-ft-text-dark rounded-lg px-6 w-fit text-md font-semibold"
            >
              Back to Projects
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-between h-full flex-1 gap-4">
          <div className="h-[75%] relative">
            <Image
              src={image_url}
              alt={`${title} hero graphic`}
              fill
              className="w-full h-full object-fill rounded-bl-large bg-white border-ft-primary-yellow border-l-4 border-b-4"
              priority
            />
          </div>
          <div className="flex-1 bg-ft-primary-yellow rounded-tl-[2rem] rounded-bl-[2rem]"></div>
        </div>
      </div>
    </section>
  );
}
