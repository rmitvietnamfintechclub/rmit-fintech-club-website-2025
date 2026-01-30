import { NextResponse } from "next/server";
import {
  getLargeScaledOngoingProjects,
  getDepartmentProjects,
  getCompletedProjectsByYear,
  getAllProjects,
  createProject
} from "@/app/(backend)/controllers/projectController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";

// --- GET: PUBLIC (Dispatcher Logic) ---
export const GET = publicRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const department = searchParams.get("department");
  const year = searchParams.get("year");

  // Case 1: Completed by Year
  if (status === "Completed" && year) {
    const result = await getCompletedProjectsByYear(year);
    return NextResponse.json(result);
  }

  // Case 2: Large Scaled & Ongoing
  if (type === "large-scaled" && status === "Ongoing") {
    const result = await getLargeScaledOngoingProjects();
    return NextResponse.json(result);
  }

  // Case 3: Department & Ongoing
  if (type === "department" && status === "Ongoing" && department) {
    const result = await getDepartmentProjects(department);
    return NextResponse.json(result);
  }
  
  // Default: Get All
  const result = await getAllProjects();
  return NextResponse.json(result);
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