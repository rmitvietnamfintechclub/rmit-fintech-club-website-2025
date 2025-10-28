import React from "react";
import SectionTitle from "./SectionTitle";

// --- Prop Types ---
type FeaturedActivitiesProps = {
  featured_activities: string[];
};

// --- Main Component ---
export default function FeaturedActivities({
  featured_activities = [],
}: FeaturedActivitiesProps) {
  if (!featured_activities || featured_activities.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto px-20">
        <SectionTitle>Featured Activities</SectionTitle>
        <div className="relative pl-6">
          <div className="absolute left-5 top-0 bottom-0 w-1 h-full bg-[#DBB968]/50 rounded-full"></div>
          
          <ul className="space-y-8">
            {featured_activities.map((activity, index) => (
              <li key={index} className="relative pl-8">
                <div className="absolute left-0 top-6 transform -translate-x-[11.5px] z-10 flex items-center justify-center">
                  <div className="w-5 h-5 bg-[#2C305F] rounded-full border-4 border-white shadow-md"></div>
                </div>

                <div
                  className={`bg-ft-primary-blue-300 rounded-lg shadow-sm p-5 ml-2 transition-shadow hover:shadow-md 
                            border-l-4 border-[#2C305F]`}
                >
                  <span className="text-lg font-semibold text-[#2C305F]">
                    {activity}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}