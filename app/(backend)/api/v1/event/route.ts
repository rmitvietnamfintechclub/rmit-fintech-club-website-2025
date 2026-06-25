import { NextResponse } from "next/server";
import { 
  getAllEvents, 
  getUpcomingEvents, 
  getPastEvents,
  createEvent 
} from "@/app/(backend)/controllers/eventController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  
  const type = searchParams.get("type");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  
  const status = searchParams.get("status") || undefined;
  const mode = searchParams.get("mode") || undefined;

  // Case 1: Public Homepage
  if (type === "upcoming") {
    const result = await getUpcomingEvents(limit || 6); 
    return NextResponse.json({ data: result });
  }

  // Case 2: Lấy sự kiện đã qua (Past Archive)
  if (type === "past") {
    const result = await getPastEvents(page, limit); 
    return NextResponse.json({ data: result });
  }

  /// Case 3: Admin Dashboard / List Get All (Có lọc Status và Mode)
  const result = await getAllEvents(page, limit, status, mode);
  
  return NextResponse.json({ data: result });
});

// --- POST: ADMIN ONLY ---
export const POST = adminRoute(async (req) => {
  const data = await req.json();
  const event = await createEvent(data);
  
  return NextResponse.json(
    { message: "Event created successfully", data: event }, 
    { status: 201 }
  );
});