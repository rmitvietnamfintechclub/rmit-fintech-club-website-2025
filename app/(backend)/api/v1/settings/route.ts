import { NextResponse } from "next/server";
import ClubSettings from "@/app/(backend)/models/ClubSettings";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET ---
export const GET = publicRoute(async (req) => {
  try {
    const setting = await ClubSettings.findOne({ key: "public_generation" });
    
    const publicGen = setting ? Number(setting.value) : 6; 

    return NextResponse.json({ status: 200, value: publicGen });
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Error fetching settings" });
  }
});

// --- POST ---
export const POST = adminRoute(async (req) => {
  try {
    const { generation } = await req.json();

    if (!generation || isNaN(generation)) {
      return NextResponse.json({ status: 400, message: "Invalid generation" });
    }

    const updated = await ClubSettings.findOneAndUpdate(
      { key: "public_generation" },
      { value: Number(generation) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ status: 200, message: "Settings updated", data: updated });
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Error updating settings" });
  }
});