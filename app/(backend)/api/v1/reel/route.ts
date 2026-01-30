import { NextResponse } from "next/server";
import { getReels, createReel } from "@/app/(backend)/controllers/reelController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req) => {
  const { searchParams } = new URL(req.url);

  // 1. Parse params
  const labels = searchParams.getAll("labels");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  // 2. Validate params
  if (page < 1 || limit < 1) {
    return NextResponse.json(
      { message: "Invalid pagination parameters" },
      { status: 400 }
    );
  }

  // 3. Call Service
  const result = await getReels(labels, page, limit);

  return NextResponse.json(result, { status: 200 });
});

// --- POST: ADMIN ONLY ---
export const POST = adminRoute(async (req) => {
  const data = await req.json();
  const reel = await createReel(data);
  
  return NextResponse.json(
    { message: "Reel created successfully", reel },
    { status: 201 }
  );
});