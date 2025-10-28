"use client";

import Image from "next/image";

// Define interfaces for type safety
interface Reel {
  id: number;
  title: string;
  thumbnailUrl: string;
}

interface ReelLibraryGridProps {
  reels: Reel[];
  onReelSelect: (index: number) => void;
}

const ReelLibraryGrid: React.FC<ReelLibraryGridProps> = ({
  reels,
  onReelSelect,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
      {reels.map((reel, index) => (
        <div
          key={reel.id}
          onClick={() => onReelSelect(index)}
          className="relative aspect-[9/16] overflow-hidden rounded-xl group cursor-pointer shadow-lg transform transition-transform duration-300 hover:-translate-y-1"
        >
          {/* 2. Replace <img> with <Image> */}
          <Image
            src={reel.thumbnailUrl}
            alt={reel.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            priority={index < 6}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <h3 className="absolute bottom-0 left-0 p-3 text-sm font-semibold text-white md:p-4 md:text-base drop-shadow-md">
            {reel.title}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default ReelLibraryGrid;