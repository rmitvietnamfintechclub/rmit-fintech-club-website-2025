import type { NextRequest } from "next/server";
import {
  deleteReel,
  updateReel,
  getReelById,
} from "@/app/(backend)/controllers/reelController";

/**
 * Handles GET requests for a single reel by its ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getReelById(params.id);
}

/**
 * Handles PUT requests to update a reel by its ID.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  return updateReel(params.id, data);
}

/**
 * Handles DELETE requests to remove a reel by its ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteReel(params.id);
}