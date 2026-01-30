import { NextResponse } from "next/server";
import {
  getReelById,
  updateReel,
  deleteReel,
} from "@/app/(backend)/controllers/reelController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req, { params }) => {
  const reel = await getReelById(params.id);

  if (!reel) {
    return NextResponse.json({ error: "Reel not found" }, { status: 404 });
  }

  return NextResponse.json({ reel }, { status: 200 });
});

// --- PUT: ADMIN ONLY ---
export const PUT = adminRoute(async (req, { params }) => {
  const data = await req.json();
  const reel = await updateReel(params.id, data);

  if (!reel) {
    return NextResponse.json({ error: "Reel not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Reel updated successfully", reel },
    { status: 200 }
  );
});

// --- DELETE: ADMIN ONLY ---
export const DELETE = adminRoute(async (req, { params }) => {
  const reel = await deleteReel(params.id);

  if (!reel) {
    return NextResponse.json({ error: "Reel not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Reel deleted successfully" },
    { status: 200 }
  );
});