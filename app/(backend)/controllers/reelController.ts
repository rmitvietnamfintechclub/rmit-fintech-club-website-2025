import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Reel from "../models/reel";
import connectMongoDB from "../libs/mongodb";
import type { Reel as ReelType } from "../types/reel";

/**
 * Get all reels with filtering by labels and pagination.
 */
export async function getReels(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const labels = searchParams.getAll("labels");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const skip = (page - 1) * limit;

  if (page < 1 || limit < 1) {
    return NextResponse.json(
      { message: "Invalid pagination parameters" },
      { status: 400 }
    );
  }

  try {
    await connectMongoDB();

    const query: any = {};
    if (labels.length > 0 && !labels.includes("All")) {
      query.labels = {
        $in: labels.map((label) => new RegExp(`^${label}$`, "i")),
      };
    }

    const totalReels = await Reel.countDocuments(query);
    const totalPages = Math.ceil(totalReels / limit);
    
    const reels = await Reel.find(query)
      .select("_id title description videoId thumbnailUrl publicationDate labels")
      .sort({ publicationDate: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ reels, totalPages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reels:", error);
    return NextResponse.json({ error: "Cannot fetch reels" }, { status: 500 });
  }
}

/**
 * Get a single reel by its ID.
 */
export async function getReelById(id: string) {
  try {
    await connectMongoDB();
    const reel = await Reel.findById(id);
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }
    return NextResponse.json({ reel }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching reel by ID: ${id}`, error);
    return NextResponse.json({ error: "Cannot fetch reel" }, { status: 500 });
  }
}

/**
 * Create a new reel.
 */
export async function createReel(data: Omit<ReelType, "_id" | "createdAt" | "updatedAt">) {
  try {
    await connectMongoDB();
    const reel = await Reel.create(data);
    return NextResponse.json(
      { message: "Reel created successfully", reel },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create reel error:", error);
    return NextResponse.json({ error: "Cannot create reel" }, { status: 500 });
  }
}

/**
 * Update an existing reel.
 */
export async function updateReel(id: string, data: Partial<ReelType>) {
  try {
    await connectMongoDB();
    const reel = await Reel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Reel updated successfully", reel },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating reel: ${id}`, error);
    return NextResponse.json({ error: "Cannot update reel" }, { status: 500 });
  }
}

/**
 * Delete a reel.
 */
export async function deleteReel(id: string) {
  try {
    await connectMongoDB();
    const reel = await Reel.findByIdAndDelete(id);
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Reel deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting reel: ${id}`, error);
    return NextResponse.json({ error: "Cannot delete reel" }, { status: 500 });
  }
}