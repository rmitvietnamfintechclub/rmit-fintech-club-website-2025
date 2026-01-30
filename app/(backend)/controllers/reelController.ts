import Reel from "@/app/(backend)/models/reel";
import type { Reel as ReelType } from "@/app/(backend)/types/reel";

// --- Service: Get All Reels (Pagination & Filter) ---
export async function getReels(
  labels: string[] = [],
  page: number = 1,
  limit: number = 12
) {
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};
  if (labels.length > 0 && !labels.includes("All")) {
    query.labels = {
      $in: labels.map((label) => new RegExp(`^${label}$`, "i")),
    };
  }

  // Run Count and Find in parallel for performance
  const [totalReels, reels] = await Promise.all([
    Reel.countDocuments(query),
    Reel.find(query)
      .select("_id title description videoId thumbnailUrl publicationDate labels")
      .sort({ publicationDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(), // Use .lean() for plain JS objects
  ]);

  const totalPages = Math.ceil(totalReels / limit);

  return { reels, totalPages };
}

// --- Service: Get Single Reel ---
export async function getReelById(id: string) {
  const reel = await Reel.findById(id).lean();
  return reel;
}

// --- Service: Create Reel ---
export async function createReel(
  data: Omit<ReelType, "_id" | "createdAt" | "updatedAt">
) {
  const reel = await Reel.create(data);
  return reel;
}

// --- Service: Update Reel ---
export async function updateReel(id: string, data: Partial<ReelType>) {
  const reel = await Reel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  
  return reel;
}

// --- Service: Delete Reel ---
export async function deleteReel(id: string) {
  const reel = await Reel.findByIdAndDelete(id).lean();
  return reel;
}