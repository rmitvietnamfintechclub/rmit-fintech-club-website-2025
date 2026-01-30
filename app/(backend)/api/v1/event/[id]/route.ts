import { NextResponse } from "next/server";
import { getEventById, updateEvent, deleteEvent } from "@/app/(backend)/controllers/event";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req, { params }) => {
    try {
        const event = await getEventById(params.id);

        if (!event) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(event, { status: 200 });
    } catch (error: any) {
        // Handle lỗi "Invalid event ID" ném từ controller
        if (error.message === "Invalid event ID") {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }
        throw error; // Các lỗi khác để wrapper xử lý
    }
});

// --- PUT: ADMIN ONLY ---
export const PUT = adminRoute(async (req, { params }) => {
    const data = await req.json();
    
    const result = await updateEvent(params.id, data);

    if (!result) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event: result }, { status: 200 });
});

// --- DELETE: ADMIN ONLY ---
export const DELETE = adminRoute(async (req, { params }) => {
    const result = await deleteEvent(params.id);

    if (!result) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event: result }, { status: 200 });
});