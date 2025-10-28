"use client";
import HonoreeCard from "./honoreeCard";
import type { HonoreeListProps } from "../types";

const categoriesWithoutAchievement = ["Community Builder", "Rookie of the Semester", "Club MVP"];

export default function HonoreeList({ members }: HonoreeListProps) {
  // Ưu tiên kiểm tra xem đây có phải là danh sách cho "Best Department" không
  const isBestDepartmentList = members.length > 0 && members[0].category === "Best Department";

  // Layout 2x2 cho Best Department
  if (isBestDepartmentList) {
    const topRowMembers = members.slice(0, 2);
    const bottomRowMembers = members.slice(2, 4);

    return (
      <div className="m-5 flex flex-col items-center gap-4 md:gap-6">
        {/* Hàng trên (2 cards) */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {topRowMembers.map((one, idx) => (
            <HonoreeCard
              key={one.name || idx}
              name={one.name}
              achievement={one.achievement}
              photo_url={one.photo_url}
              category={one.category}
              hideAchievement={categoriesWithoutAchievement.includes(one.category)}
            />
          ))}
        </div>

        {/* Hàng dưới (2 cards) */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {bottomRowMembers.map((one, idx) => (
            <HonoreeCard
              key={one.name || idx}
              name={one.name}
              achievement={one.achievement}
              photo_url={one.photo_url}
              category={one.category}
              hideAchievement={categoriesWithoutAchievement.includes(one.category)}
            />
          ))}
        </div>
      </div>
    );
  }

  // --- Trường hợp > 4 members (không phải Best Department) ---
  if (members.length > 4) {
    const topRowMembers = members.slice(0, 3);
    const bottomRowMembers = members.slice(3);

    return (
      <div className="m-5 flex flex-col items-center gap-4 md:gap-6">
        {/* Hàng trên (3 cards) */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {topRowMembers.map((one, idx) => (
            <HonoreeCard
              key={one.name || idx}
              name={one.name}
              achievement={one.achievement}
              photo_url={one.photo_url}
              category={one.category}
              hideAchievement={categoriesWithoutAchievement.includes(one.category)}
            />
          ))}
        </div>

        {/* Hàng dưới (phần còn lại) */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {bottomRowMembers.map((one, idx) => (
            <HonoreeCard
              key={one.name || idx}
              name={one.name}
              achievement={one.achievement}
              photo_url={one.photo_url}
              category={one.category}
              hideAchievement={categoriesWithoutAchievement.includes(one.category)}
            />
          ))}
        </div>
      </div>
    );
  }

  // --- Trường hợp mặc định (4 members trở xuống) ---
  return (
    <div className="m-5 flex flex-col md:flex-row gap-4 justify-center items-center">
      {members.map((one, idx) => (
        <HonoreeCard
          key={one.name || idx}
          name={one.name}
          achievement={one.achievement}
          photo_url={one.photo_url}
          category={one.category}
          hideAchievement={categoriesWithoutAchievement.includes(one.category)}
        />
      ))}
    </div>
  );
}