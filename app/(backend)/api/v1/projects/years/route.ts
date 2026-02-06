import { NextResponse } from "next/server";
import { getProjectYears } from "@/app/(backend)/controllers/projectController";
import { publicRoute } from "@/app/(backend)/libs/api-handler";

export const GET = publicRoute(async () => {
  const years = await getProjectYears();
  return NextResponse.json({ data: years });
});