import React from "react";

export const MemberSkeleton = () => {
  return (
    <div className="flex flex-col items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse">
      
      {/* Image Skeleton */}
      <div className="w-32 h-32 mb-4 rounded-full bg-gray-200" />

      {/* Name Skeleton */}
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
      
      {/* Position Skeleton */}
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2 w-full">
         {/* Generation Badge */}
         <div className="h-6 w-16 bg-gray-200 rounded-md" />
         
         {/* Icon */}
         <div className="h-5 w-5 bg-gray-200 rounded" />
      </div>
    </div>
  );
};