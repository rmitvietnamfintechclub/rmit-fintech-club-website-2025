import { NextResponse } from "next/server";
import { getArticles, createArticle } from "@/app/(backend)/controllers/articleController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";
// --- GET: PUBLIC ---
export const GET = publicRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  
  // 1. Parse params từ Request
  const labels = searchParams.getAll("labels");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  // 2. Validate params (Optional)
  if (page < 1 || limit < 1) {
    return NextResponse.json({ message: "Invalid pagination" }, { status: 400 });
  }

  // 3. Gọi Service (DB đã được wrapper connect rồi)
  const result = await getArticles(labels, page, limit);

  // 4. Trả về Response
  return NextResponse.json(result, { status: 200 });
});

// --- POST: ADMIN ONLY ---
export const POST = adminRoute(async (req) => {
  const data = await req.json();
  const article = await createArticle(data);
  
  return NextResponse.json(
    { message: "Article created successfully", article },
    { status: 201 }
  );
});