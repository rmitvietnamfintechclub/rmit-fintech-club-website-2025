import connectMongoDB from "@/app/(backend)/libs/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { getExecutiveMembers, addExecutiveMember } from "@/app/(backend)/controllers/executiveController";
import { requireAdmin } from "@/app/(backend)/middleware/middleware";

export async function GET(req: NextRequest) {
  await connectMongoDB();

  const { searchParams } = new URL(req.url);
  const generation = searchParams.get("generation");

  const result = await getExecutiveMembers(generation || undefined);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  // Require admin for POST
	const isAdmin = await requireAdmin(req);
	if (!isAdmin) {
		return NextResponse.json(
			{ status: 403, message: "Forbidden" },
			{ status: 403 },
		);
	}
  await connectMongoDB();
  const data = await req.json();
  const result = await addExecutiveMember(data);
  return NextResponse.json(result);
} 