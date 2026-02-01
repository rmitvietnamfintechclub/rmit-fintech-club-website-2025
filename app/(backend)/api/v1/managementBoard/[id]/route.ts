import { NextResponse } from "next/server";
import { updateManagementBoard, deleteManagementBoard } from "@/app/(backend)/controllers/managementBoard";
import { adminRoute } from "@/app/(backend)/libs/api-handler";

// --- PUT: ADMIN ONLY ---
export const PATCH = adminRoute(async (req, { params }) => {
    const id = params.id;
    const data = await req.json();
    
    const result = await updateManagementBoard(id, data);
    
    return NextResponse.json(result, { status: result.status });
});

// --- DELETE: ADMIN ONLY ---
export const DELETE = adminRoute(async (req, { params }) => {
    const id = params.id;
    
    const result = await deleteManagementBoard(id);
    
    return NextResponse.json(result, { status: result.status });
});