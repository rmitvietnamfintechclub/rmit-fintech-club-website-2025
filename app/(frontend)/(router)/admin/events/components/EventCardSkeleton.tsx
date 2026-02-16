import React from "react";

export const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
      {/* 1. Poster Skeleton */}
      <div className="relative h-48 w-full bg-gray-200 animate-pulse">
        {/* Left Badge Skeleton */}
        <div className="absolute top-3 left-3 h-6 w-16 bg-gray-300 rounded-lg" />
        {/* Right Badge Skeleton */}
        <div className="absolute top-3 right-3 h-6 w-20 bg-gray-300 rounded-lg" />
      </div>

      {/* 2. Content Skeleton */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        
        {/* Date Row */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Title */}
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />

        {/* Location */}
        <div className="flex items-center gap-2">
           <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
           <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Description Lines (3 lines) */}
        <div className="space-y-2 pt-1 mt-auto">
           <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
           <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
           <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};