import type { NextRequest } from "next/server";
import { getReels, createReel } from "@/app/(backend)/controllers/reelController";

/**
 * Handles GET requests to fetch all reels with filtering and pagination.
 */
export async function GET(request: NextRequest) {
  return getReels(request);
}

/**
 * Handles POST requests to create a new reel.
 */
export async function POST(request: NextRequest) {
  const reelData = await request.json();
  return createReel(reelData);
}