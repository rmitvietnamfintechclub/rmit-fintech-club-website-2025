import { NextResponse } from "next/server";
import { getPodcasts, createPodcast } from "@/app/(backend)/controllers/podcastController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req) => {
  const { searchParams } = new URL(req.url);

  // 1. Parse params
  const labels = searchParams.getAll("labels");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  // 2. Validate params (Optional)
  if (page < 1 || limit < 1) {
    return NextResponse.json(
      { message: "Invalid pagination parameters" },
      { status: 400 }
    );
  }

  // 3. Gọi Service
  const result = await getPodcasts(labels, page, limit);

  return NextResponse.json(result, { status: 200 });
});

// --- POST: ADMIN ONLY ---
export const POST = adminRoute(async (req) => {
  const data = await req.json();
  const podcast = await createPodcast(data);
  
  return NextResponse.json(
    { message: "Podcast created successfully", podcast },
    { status: 201 }
  );
});