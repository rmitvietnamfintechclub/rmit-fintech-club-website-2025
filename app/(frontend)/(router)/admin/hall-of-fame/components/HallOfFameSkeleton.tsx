import React from "react";

export const HallOfFameSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col h-full">
      {/* Header Badges Skeleton */}
      <div className="flex justify-between items-center mb-3">
        <div className="h-6 w-24 bg-gray-100 rounded-md animate-pulse"></div>
        <div className="h-6 w-12 bg-gray-100 rounded-md animate-pulse"></div>
      </div>

      {/* Image Skeleton - Quan trọng nhất */}
      <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-xl bg-gray-200 animate-pulse">
        {/* Shimmer effect chạy qua */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 items-center space-y-3 mt-1">
        {/* Name lines */}
        <div className="h-5 w-3/4 bg-gray-200 rounded-full animate-pulse"></div>
        
        {/* Divider dot */}
        <div className="h-1 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        
        {/* Achievement lines */}
        <div className="w-full space-y-2">
          <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse"></div>
          <div className="h-3 w-5/6 mx-auto bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};