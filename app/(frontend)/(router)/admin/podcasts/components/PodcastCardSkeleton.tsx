import React from "react";

export const PodcastCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-[16/9] bg-gray-200 animate-pulse">
        <div className="absolute top-3 right-3 h-6 w-20 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        {/* Labels */}
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-5 w-12 bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        {/* Summary */}
        <div className="space-y-2 flex-1">
          <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
          <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
          <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse"></div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};