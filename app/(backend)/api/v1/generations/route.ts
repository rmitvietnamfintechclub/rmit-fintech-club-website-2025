import { NextResponse } from "next/server";
import { getGenerations } from "@/app/(backend)/controllers/generationController";
import { publicRoute } from "@/app/(backend)/libs/api-handler";

export const GET = publicRoute(async () => {
  const result = await getGenerations();
  
  return NextResponse.json(result);
});