import { NextResponse } from "next/server";
import {
  getLargeScaledOngoingProjects,
  getDepartmentProjects,
  getAllOngoingDepartmentProjects,
  getCompletedProjects,
  getAllProjects,
  createProject
} from "@/app/(backend)/controllers/projectController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC ---
export const GET = publicRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const department = searchParams.get("department");
  const year = searchParams.get("year");

  // Case 1: Large Scaled & Completed
  if (type === "large-scaled" && status === "completed") {
    const result = await getCompletedProjects(year || undefined, "large-scaled");
    return NextResponse.json({ data: result });
  }

  // Case 2: Completed nói chung
  if (status === "completed") {
    const result = await getCompletedProjects(year || undefined, type || undefined);
    return NextResponse.json({ data: result });
  }

  // Case 3: Large Scaled & Ongoing
  if (type === "large-scaled" && status === "ongoing") {
    const result = await getLargeScaledOngoingProjects();
    return NextResponse.json({ data: result });
  }

  // Case 4: Department & Ongoing
  if (type === "department" && status === "ongoing" && department) {
    const result = await getDepartmentProjects(department);
    return NextResponse.json({ data: result });
  }

  // Case 5: Tất cả Department & Ongoing (Admin Page)
  if (type === "department" && status === "ongoing" && !department) {
    const result = await getAllOngoingDepartmentProjects();
    return NextResponse.json({ data: result });
  }
  
  // Default: Get All
  const result = await getAllProjects();
  return NextResponse.json({ data: result });
});

// --- POST: ADMIN ONLY ---
export const POST = adminRoute(async (req) => {
  const data = await req.json();
  const project = await createProject(data);
  
  return NextResponse.json(
    { message: "Project created successfully", data: project }, 
    { status: 201 }
  );
});