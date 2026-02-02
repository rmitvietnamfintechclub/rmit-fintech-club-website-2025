import { NextResponse } from "next/server";
import { getUniqueLabels } from "@/app/(backend)/controllers/articleController";
import { publicRoute } from "@/app/(backend)/libs/api-handler";

export const GET = publicRoute(async () => {
  const labels = await getUniqueLabels();
  return NextResponse.json(labels, { status: 200 });
});