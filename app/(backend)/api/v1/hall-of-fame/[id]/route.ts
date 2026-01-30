import { NextResponse } from "next/server";
import { updateHonoree, deleteHonoree } from "@/app/(backend)/controllers/hallOfFameController";
import { adminRoute } from "@/app/(backend)/libs/api-handler";

// --- PUT: ADMIN ONLY ---
export const PUT = adminRoute(async (req, { params }) => {
  const body = await req.json();
  
  const honoree = await updateHonoree(params.id, body);

  if (!honoree) {
    return NextResponse.json({ error: "Honoree not found" }, { status: 404 });
  }

  return NextResponse.json({ status: 200, honoree });
});

// --- DELETE: ADMIN ONLY ---
export const DELETE = adminRoute(async (req, { params }) => {
  const result = await deleteHonoree(params.id);

  if (!result) {
    return NextResponse.json({ error: "Honoree not found" }, { status: 404 });
  }

  return NextResponse.json({ status: 200, message: "Honoree deleted" });
});