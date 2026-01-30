import { NextResponse } from "next/server";
import { getEvents, addEvent } from "@/app/(backend)/controllers/event";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req) => {
    const { searchParams } = new URL(req.url);
    
    // Parse params
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    
    const limit = Math.min(Math.max(parseInt(limitParam || '10', 10), 1), 100);
    const offset = Math.max(parseInt(offsetParam || '0', 10), 0);

    // Gọi Service
    const result = await getEvents(limit, offset);

    return NextResponse.json({
        status: 200,
        ...result
    });
});

// --- POST: ADMIN ONLY ---
export const POST = adminRoute(async (req) => {
    const data = await req.json();
    const result = await addEvent(data);
    
    return NextResponse.json(result, { status: 201 });
});