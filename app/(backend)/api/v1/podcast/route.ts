import type { NextRequest } from "next/server";
import { getPodcasts, createPodcast } from "@/app/(backend)/controllers/podcastController";

/**
 * Handles GET requests to fetch all podcasts, with support for
 * filtering by labels and pagination.
 */
export async function GET(request: NextRequest) {
  return getPodcasts(request);
}

/**
 * Handles POST requests to create a new podcast.
 */
export async function POST(request: NextRequest) {
  const podcastData = await request.json();
  return createPodcast(podcastData);
}
