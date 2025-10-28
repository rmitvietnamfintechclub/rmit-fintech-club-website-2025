import type { NextRequest } from "next/server";
import {
  getArticles,
  createArticle,
} from "@/app/(backend)/controllers/articleController";

/**
 * GET /api/v1/article
 * Fetches all articles with optional filtering and pagination.
 * Query Params: ?labels=Label1&labels=Label2&page=1&limit=10
 */
export async function GET(request: NextRequest) {
  return getArticles(request);
}

/**
 * POST /api/v1/article
 * Creates a new article.
 */
export async function POST(request: NextRequest) {
  const articleData = await request.json();
  return createArticle(articleData);
}
