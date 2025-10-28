import React from "react";
import { Card, CardBody, Chip } from "@heroui/react";
import SectionTitle from "./SectionTitle";
import { TimelineEvent } from "./types";

// --- Prop Types ---
type TimelineProps = {
  timeline: TimelineEvent[];
};

const EventCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <>
    <h3 className="font-bold text-[#2C305F] mb-2 text-lg">{title}</h3>
    <Card className="bg-ft-primary-blue-300 border-none rounded-lg shadow-md transition-transform hover:scale-105">
      <CardBody className="p-4">
        <p className="text-gray-600 text-sm">{description}</p>
      </CardBody>
    </Card>
  </>
);

// --- The Main Component ---
export default function Timeline({ timeline = [] }: TimelineProps) {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <SectionTitle>Timeline</SectionTitle>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#DBB968]/50 rounded-full"></div>

          <div className="space-y-12">
            {timeline.map((event, index) => {
              const isRightSide = index % 2 === 0;

              return (
                <div key={index} className="relative flex items-center min-h-[120px]">
                  <div className="w-1/2 pr-8 text-right">
                    {isRightSide ? (
                      <Chip className="bg-[#DAB868] text-[#2C305F] text-sm font-semibold p-2">
                        {event.time}
                      </Chip>
                    ) : (
                      <EventCard
                        title={event.milestoneTitle}
                        description={event.milestoneDescription}
                      />
                    )}
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center">
                    <div className="w-5 h-5 bg-[#2C305F] rounded-full border-4 border-white shadow-md"></div>
                  </div>

                  <div className="w-1/2 pl-8 text-left">
                    {isRightSide ? (
                      <EventCard
                        title={event.milestoneTitle}
                        description={event.milestoneDescription}
                      />
                    ) : (
                      <Chip className="bg-[#DAB868] text-[#2C305F] text-sm font-semibold p-2">
                        {event.time}
                      </Chip>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}