import { NextResponse } from "next/server";
import { generateUploadUrl, deleteFromS3 } from "@/app/(backend)/libs/s3";
import { adminRoute } from "@/app/(backend)/libs/api-handler";

export const POST = adminRoute(async (req) => {
  const { fileName, fileType, folder, customName } = await req.json();

  if (!fileName || !fileType) {
    return NextResponse.json({ error: "Missing file info" }, { status: 400 });
  }

  const data = await generateUploadUrl(fileName, fileType, folder, customName);

  return NextResponse.json(data);
});

export const DELETE = adminRoute(async (req) => {
  const { key } = await req.json();

  if (!key) {
    return NextResponse.json({ error: "Missing file key" }, { status: 400 });
  }

  await deleteFromS3(key);

  return NextResponse.json({ message: "Deleted successfully" });
});