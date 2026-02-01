import { NextResponse } from "next/server";
import { getAvailableYears } from "@/app/(backend)/controllers/hallOfFameController";
import { publicRoute } from "@/app/(backend)/libs/api-handler";

export const GET = publicRoute(async () => {
  const years = await getAvailableYears();
  return NextResponse.json(years, { status: 200 });
});