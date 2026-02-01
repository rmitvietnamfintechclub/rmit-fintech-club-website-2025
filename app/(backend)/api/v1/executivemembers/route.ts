import { NextResponse } from "next/server";
import {
  getExecutiveMembers,
  addExecutiveMember,
} from "@/app/(backend)/controllers/executiveController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  const generation = searchParams.get("generation");

  const result = await getExecutiveMembers(generation || undefined);

  return NextResponse.json(result);
});

// --- POST: ADMIN ONLY ---
export const POST = adminRoute(async (req) => {
  const data = await req.json();

  const result = await addExecutiveMember(data);

  return NextResponse.json(result, { status: result.status });
});
