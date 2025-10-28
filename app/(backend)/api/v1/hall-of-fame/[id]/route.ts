import connectMongoDb from "@/app/(backend)/libs/mongodb";
import HallOfFame from "@/app/(backend)/models/hallOfFame";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectMongoDb();

  console.log("ID:", params.id)
  const body = await req.json();

  try {
    const honoree = await HallOfFame.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!honoree) {
      return NextResponse.json({ error: "Honoree not found" }, { status: 404 });
    }

    return NextResponse.json({ status: 200, honoree });
  } catch (err) {
    console.error("Error updating honoree:", err);
    return NextResponse.json({ error: "Failed to update honoree" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectMongoDb();

  try {
    const result = await HallOfFame.findByIdAndDelete(params.id);
    if (!result) {
      return NextResponse.json({ error: "Honoree not found" }, { status: 404 });
    }

    return NextResponse.json({ status: 200, message: "Honoree deleted" });
  } catch (err) {
    console.error("Error deleting honoree:", err);
    return NextResponse.json({ error: "Failed to delete honoree" }, { status: 500 });
  }
}