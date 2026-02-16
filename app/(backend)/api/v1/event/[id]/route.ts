import { NextResponse } from "next/server";
import { 
  getEventById, 
  updateEvent, 
  deleteEvent 
} from "@/app/(backend)/controllers/eventController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req, { params }) => {
  const event = await getEventById(params.id);

  if (!event) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ data: event });
});

// --- PUT: ADMIN ONLY ---
export const PUT = adminRoute(async (req, { params }) => {
  const data = await req.json();
  const updatedEvent = await updateEvent(params.id, data);

  if (!updatedEvent) {
    return NextResponse.json({ message: "Event not found or invalid ID" }, { status: 404 });
  }

  return NextResponse.json({ 
    message: "Event updated successfully", 
    data: updatedEvent 
  });
});

// --- DELETE: ADMIN ONLY ---
export const DELETE = adminRoute(async (req, { params }) => {
  const result = await deleteEvent(params.id);

  if (!result) {
    return NextResponse.json({ message: "Event not found or invalid ID" }, { status: 404 });
  }

  return NextResponse.json({ 
    message: "Event deleted successfully", 
    data: result 
  });
});