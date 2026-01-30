import { NextResponse } from "next/server";
import { getHonorees, createHonoree } from "@/app/(backend)/controllers/hallOfFameController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler"; // Import wrapper đã tạo từ bài trước

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  const semester = searchParams.get("semester");
  const category = searchParams.get("category");
  const year = searchParams.get("year");

  const honorees = await getHonorees(semester, category, year);

  if (!honorees || honorees.length === 0) {
    return NextResponse.json({ message: "No honorees found" }, { status: 404 });
  }

  return NextResponse.json({ honorees }, { status: 200 });
});

// --- POST: ADMIN ONLY ---
export const POST = adminRoute(async (req) => {
  const body = await req.json();

  try {
    const honoree = await createHonoree(body);
    return NextResponse.json(honoree, { status: 201 });
  } catch (error: any) {
    // Catch lỗi validation từ controller
    if (error.message === "Missing required fields") {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error; // Ném tiếp để wrapper xử lý lỗi 500
  }
});