import connectMongoDb from "@/app/(backend)/libs/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { updateManagementBoard, deleteManagementBoard } from "@/app/(backend)/controllers/managementBoard";
import { requireAdmin } from "@/app/(backend)/middleware/middleware";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	// Require admin for PUT
	const isAdmin = await requireAdmin(req);
	if (!isAdmin) {
		return NextResponse.json(
			{ status: 403, message: "Forbidden" },
			{ status: 403 },
		);
	}
	await connectMongoDb();
	const id = params.id;
	const data = await req.json();
	const result = await updateManagementBoard(id, data);
	return NextResponse.json(result, { status: result.status });
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
	await connectMongoDb();
	const id = params.id;
	const result = await deleteManagementBoard(id);
	return NextResponse.json(result, { status: result.status });
}
