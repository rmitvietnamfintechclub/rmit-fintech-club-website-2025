import connectMongoDb from "@/app/(backend)/libs/mongodb";
import HallOfFame from "@/app/(backend)/models/hallOfFame";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectMongoDb();

  const { searchParams } = new URL(req.url);
  const semester = searchParams.get("semester");
  const category = searchParams.get("category");
  const year = searchParams.get("year")

  const filter: Record<string, any> = {};
  if (semester) filter.semester = semester;
  if (category) filter.category = category;
  if (year) filter.semester = { $regex: `^${year}` };
  
  try {
    const honorees = await HallOfFame.find(filter).sort({ name: 1 });
    if (honorees.length === 0) {
      return NextResponse.json({ message: "No honorees found" }, { status: 404 });
    }
    return NextResponse.json({ honorees }, { status: 200 });
  } catch (err) {
    console.error("Error fetching honorees:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectMongoDb();

  const body = await req.json();

  const { name, achievement, category, photo_url, semester } = body;

  if (!name || !achievement || !category || !photo_url || !semester) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const honoree = await HallOfFame.create({ name, achievement, category, photo_url, semester });
    return NextResponse.json(honoree, { status: 201 });
  } catch (err) {
    console.error("Error creating honoree:", err);
    return NextResponse.json({ error: "Failed to create honoree" }, { status: 500 });
  }
}