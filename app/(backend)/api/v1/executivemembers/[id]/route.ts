import { NextResponse } from "next/server";
import { 
  updateExecutiveMember, 
  deleteExecutiveMember 
} from "@/app/(backend)/controllers/executiveController";
import { adminRoute } from "@/app/(backend)/libs/api-handler";

// --- PATCH: ADMIN ONLY ---
export const PATCH = adminRoute(async (req, { params }) => {
  const memberId = params.id;
  const data = await req.json();
  
  const result = await updateExecutiveMember(memberId, data);
  
  return NextResponse.json(result);
});

// --- DELETE: ADMIN ONLY ---
export const DELETE = adminRoute(async (req, { params }) => {
  const memberId = params.id;
  
  const result = await deleteExecutiveMember(memberId);
  
  return NextResponse.json(result);
});