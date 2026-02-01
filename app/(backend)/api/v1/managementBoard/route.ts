import { NextResponse } from "next/server";
import ManagementBoard from "@/app/(backend)/models/managementBoard";
import { addManagementBoard } from "@/app/(backend)/controllers/managementBoard";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req) => {
    const { searchParams } = new URL(req.url);
    const generation = searchParams.get("generation");
    
    const filter: Record<string, any> = generation 
        ? { generation: Number(generation) } 
        : {};

    const members = await ManagementBoard.find(filter);
    
    return NextResponse.json({
        status: 200,
        members,
    });
});

// --- POST: ADMIN ONLY ---
export const POST = adminRoute(async (req) => {
    const data = await req.json();
    
    const result = await addManagementBoard(data);
    
    return NextResponse.json(result, { status: result.status });
});