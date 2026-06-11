import { NextResponse } from "next/server";
import { getHallOfFameMetadata } from "@/app/(backend)/controllers/hallOfFameController";
import { publicRoute } from "@/app/(backend)/libs/api-handler";

export const GET = publicRoute(async () => {
  const metadata = await getHallOfFameMetadata();
  return NextResponse.json(metadata, { status: 200 });
});