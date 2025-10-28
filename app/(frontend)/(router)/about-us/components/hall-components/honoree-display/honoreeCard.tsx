"use client";
import type { HonoreeCardProps } from "../types";
import Image from "next/image";
import clsx from "clsx";

export default function HonoreeCard({
  name,
  achievement,
  photo_url,
  hideAchievement,
  category,
}: HonoreeCardProps) {
  const isBestDepartment = category === "Best Department";
  return (
    <div
      className={clsx(
        "inline-block bg-[#DBB968] p-1 m-1 rounded-[40px]",
        "xl:h-64 lg:h-60 md:h-56 h-52",
        {
          // Điều kiện cho chiều rộng của thẻ
          "xl:w-[27rem] lg:w-[23rem] md:w-[21rem] w-[19rem]": isBestDepartment, // Rộng hơn cho Best Department
          "xl:w-64 lg:w-60 md:w-56 w-52": !isBestDepartment, // Chiều rộng mặc định
        }
      )}
    >
      <div className="bg-[#2C305F] px-4 py-2 rounded-[36px] hover:shadow-lg w-full h-full">
        <div className="w-full h-full rounded-[30px] overflow-hidden">
          <Image
            src={photo_url}
            alt={name}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            fetchPriority="high"
            loading="eager"
            priority={true}
          />
        </div>

        <div
          className={clsx(
            "absolute rounded-[30px] overflow-hidden",
            "lg:-translate-y-14 md:-translate-y-12 sm:-translate-y-10 -translate-y-8",
            "lg:-translate-x-3 md:-translate-x-3 sm:-translate-x-1 -translate-x-3",
            "xl:h-16 lg:h-14 md:h-12 h-10", // Giữ chiều cao của overlay
            {
              // Điều kiện cho chiều rộng của overlay text
              "xl:w-[26rem] lg:w-[22rem] md:w-[20rem] w-[18rem]": isBestDepartment,
              "xl:w-60 lg:w-56 md:w-52 w-48": !isBestDepartment,
            }
          )}
        >
          {/* Layer 1: bottom gradient */}
          <div
            className="
                    absolute inset-0
                    rounded-[30px]
                    bg-[linear-gradient(to_bottom,rgba(240,237,255,0.3)_0%,rgba(13,23,66,0.9)_50%,rgba(94,94,146,0.9)_100%)]
                    "
          ></div>

          {/* Layer 2: top gradient with blur */}
          <div
            className="
                        absolute inset-0
                        rounded-[30px]
                        p-4
                        flex flex-col justify-center items-center
                    "
            style={{
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              background:
                "linear-gradient(to_top, rgba(240,237,255,0.3) 0%, rgba(13,23,66,0.9) 50%, rgba(94,94,146,0.8) 100%)",
            }}
          >
            <div className="w-full px-2">
              <p className="text-xs md:text-sm lg:text-sm xl:text-sm uppercase font-extrabold text-[#DBB968] text-center">
                {name}
              </p>
              <p className="text-xs md:text-sm lg:text-sm xl:text-sm font-medium text-white text-center">
                {!hideAchievement && achievement}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
