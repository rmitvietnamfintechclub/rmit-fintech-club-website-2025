import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/app/(backend)/libs/mongodb";
import { getProjectDetails, updateProject, deleteProject } from "@/app/(backend)/controllers/projectController";
import { requireAdmin } from "@/app/(backend)/middleware/middleware";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectMongoDB();
  try {
    const project = await getProjectDetails(params.id);
    return NextResponse.json({ data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Project not found";
    return NextResponse.json({ message }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();
    const data = await req.json();
    const project = await updateProject(params.id, data);
    return NextResponse.json({ message: "Project updated successfully", data: project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error updating project";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();
    const result = await deleteProject(params.id);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error deleting project";
    return NextResponse.json({ message }, { status: 500 });
  }
}