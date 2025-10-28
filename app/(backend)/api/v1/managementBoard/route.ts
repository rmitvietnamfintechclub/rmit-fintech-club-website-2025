import { addManagementBoard } from "@/app/(backend)/controllers/managementBoard";
import connectMongoDb from "@/app/(backend)/libs/mongodb";
import ManagementBoard from "@/app/(backend)/models/managementBoard";
import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/(backend)/middleware/middleware";

export async function GET(req: NextRequest) {
	await connectMongoDb();

	const { searchParams } = new URL(req.url);
	const generation = searchParams.get("generation");
	const filter: Record<string, any> = {};

	if (generation) {
		filter.generation = Number(generation);
	}

	try {
		const members = await ManagementBoard.find(filter);
		return NextResponse.json({
			status: 200,
			members,
		});
	} catch (err) {
		return NextResponse.json({
			status: 200,
			message: "Error fetching management board members",
		});
	}
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
	await connectMongoDb();
	const data = await req.json();
	const result = await addManagementBoard(data);
	return NextResponse.json(result);
}
