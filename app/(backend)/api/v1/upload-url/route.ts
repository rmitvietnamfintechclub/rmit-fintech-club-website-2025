import { NextRequest, NextResponse } from "next/server";
import { uploadToS3, deleteFromS3 } from "@/app/(backend)/libs/s3";

export async function POST(req: NextRequest ) {
  const { fileName, fileType, folderName } = await req.json();

  try {
    const { uploadUrl, key} = await uploadToS3(fileName, fileType, folderName);
    return NextResponse.json({uploadUrl, key});

  }catch (error) {
    return NextResponse.json({ 
      error: "Failed to create signed URL" },
    { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
    const {key} = await req.json();
    try {
        await deleteFromS3(key);
        return NextResponse.json({ message: "File deleted successfully from S3" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}
