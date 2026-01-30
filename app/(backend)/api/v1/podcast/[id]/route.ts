import { NextResponse } from "next/server";
import {
  getPodcastById,
  updatePodcast,
  deletePodcast,
} from "@/app/(backend)/controllers/podcastController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req, { params }) => {
  const result = await getPodcastById(params.id);

  if (!result) {
    return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
});

// --- PUT: ADMIN ONLY ---
export const PUT = adminRoute(async (req, { params }) => {
  const data = await req.json();
  const podcast = await updatePodcast(params.id, data);

  if (!podcast) {
    return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Podcast updated successfully", podcast },
    { status: 200 }
  );
});

// --- DELETE: ADMIN ONLY ---
export const DELETE = adminRoute(async (req, { params }) => {
  const podcast = await deletePodcast(params.id);

  if (!podcast) {
    return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Podcast deleted successfully" },
    { status: 200 }
  );
});