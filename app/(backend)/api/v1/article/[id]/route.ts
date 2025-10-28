import type { NextRequest } from "next/server";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/app/(backend)/controllers/articleController";

type RouteParams = {
  params: { id: string };
};

/**
 * GET /api/v1/article/{id}
 * Fetches a single article by its ID.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  return getArticleById(params.id);
}

/**
 * PUT /api/v1/article/{id}
 * Updates an existing article.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const articleData = await request.json();
  return updateArticle(params.id, articleData);
}

/**
 * DELETE /api/v1/article/{id}
 * Deletes an article.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  return deleteArticle(params.id);
}
