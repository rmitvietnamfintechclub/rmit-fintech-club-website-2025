import { NextResponse } from "next/server";
import { getUniqueLabels } from "@/app/(backend)/controllers/podcastController";
import { publicRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: Get All Unique Labels (Public) ---
export const GET = publicRoute(async () => {
  const labels = await getUniqueLabels();
  return NextResponse.json(labels, { status: 200 });
});