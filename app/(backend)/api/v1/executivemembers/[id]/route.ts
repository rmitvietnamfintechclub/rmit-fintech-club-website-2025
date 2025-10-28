import connectMongoDB from "@/app/(backend)/libs/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { getExecutiveMemberById, updateExecutiveMember, deleteExecutiveMember } from "@/app/(backend)/controllers/executiveController";
import { requireAdmin } from "@/app/(backend)/middleware/middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const memberId = params.id;
  await connectMongoDB();
  const result = await getExecutiveMemberById(memberId);
  return NextResponse.json(result);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  // Require admin for PATCH
	const isAdmin = await requireAdmin(req);
	if (!isAdmin) {
		return NextResponse.json(
			{ status: 403, message: "Forbidden" },
			{ status: 403 },
		);
	}
  const memberId = params.id;
  await connectMongoDB();
  const data = await req.json();
  const result = await updateExecutiveMember(memberId, data);
  return NextResponse.json(result);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  // Require admin for DELETE
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json(
      { status: 403, message: "Forbidden" },
      { status: 403 },
    );
  }
  const memberId = params.id;
  await connectMongoDB();
  const result = await deleteExecutiveMember(memberId);
  return NextResponse.json(result);
} 
