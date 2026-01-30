import { NextResponse } from "next/server";
import { getArticleById, updateArticle, deleteArticle } from "@/app/(backend)/controllers/articleController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req, { params }) => {
  const result = await getArticleById(params.id);

  if (!result) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
});

// --- PUT: ADMIN ONLY ---
export const PUT = adminRoute(async (req, { params }) => {
  const data = await req.json();
  const article = await updateArticle(params.id, data);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Article updated successfully", article },
    { status: 200 }
  );
});

// --- DELETE: ADMIN ONLY ---
export const DELETE = adminRoute(async (req, { params }) => {
  const article = await deleteArticle(params.id);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Article deleted successfully" },
    { status: 200 }
  );
});