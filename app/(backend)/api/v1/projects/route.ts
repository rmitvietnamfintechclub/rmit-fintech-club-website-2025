import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/app/(backend)/libs/mongodb";
import {
  getLargeScaledOngoingProjects,
  getDepartmentProjects,
  createProject,
  getCompletedProjectsByYear,
  getAllProjects
} from "@/app/(backend)/controllers/projectController";
import { requireAdmin } from "@/app/(backend)/middleware/middleware";

export async function GET(req: NextRequest) {
  await connectMongoDB();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const department = searchParams.get("department");
  const year = searchParams.get("year");

  try {
    if (status === "Completed" && year) {
      const result = await getCompletedProjectsByYear(year);
      return NextResponse.json(result);
    }
    if (type === "large-scaled" && status === "Ongoing") {
      const result = await getLargeScaledOngoingProjects();
      return NextResponse.json(result);
    }
    if (type === "department" && status === "Ongoing" && department) {
      const result = await getDepartmentProjects(department);
      return NextResponse.json(result);
    }
    
    // Default to getting all projects
    const allProjects = await getAllProjects();
    return NextResponse.json(allProjects);

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();
    const data = await req.json();
    const project = await createProject(data);
    return NextResponse.json({ message: "Project created successfully", data: project }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error creating project";
    return NextResponse.json({ message }, { status: 400 });
  }
}