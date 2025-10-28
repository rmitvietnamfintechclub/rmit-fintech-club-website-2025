import { Project } from "./types";
import { Poppins } from "next/font/google";
import ProjectCarousel from "./ProjectCarousel";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "600", "800"] });

export default function DeptSection({
  label,
  description,
  items,
}: {
  label: string;
  description: React.ReactNode;
  items: Project[];
}) {
  return (
    <section className="relative w-[74.45vw] space-y-4">
      <div className="w-full">

          <div
            className="bg-[#2C305F] h-12 w-56 absolute hidden lg:block
                          lg:top-48 [@media(min-width:1160px)]:top-16 [@media(min-width:1160px)]:-left-8"
            style={{
              clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
            }}
          ></div>

        <div className="relative w-full min-h-[6rem]">
          <div className="relative z-10">
            <h1
              className={`${poppins.className} leading-[1.1] text-3xl md:text-4xl lg:text-5xl`}
            >
              <span className="font-normal text-[#0B0B0B]">Visit </span>
              <span className="font-extrabold tracking-wide text-[#DBB968]">
                {label}
              </span>
              <span className="font-normal text-[#0B0B0B]"> department</span>
            </h1>

            <h2
              className={`${poppins.className} block w-fit ml-auto mt-2 text-right font-bold text-[#2C305F] text-3xl md:text-4xl lg:text-5xl`}
            >
              Ongoing Projects
            </h2>

            <div
              className="clamp-4 md:clamp-6 lg:clamp-8 md:text-base md:max-lg:py-4 lg:py-7
                       md:max-lg:text-sm md:max-lg:leading-[1.5] lg:text-base lg:leading-7
                       break-words hyphens-auto"
            >
              {description}
            </div>

            <div className="px-12 md:max-lg:px-8">
              <ProjectCarousel items={items} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
