import { NextResponse } from "next/server";
import { 
    updateProject, 
    deleteProject 
} from "@/app/(backend)/controllers/projectController";
import { publicRoute, adminRoute } from "@/app/(backend)/libs/api-handler";


// --- PUT: ADMIN ONLY ---
export const PUT = adminRoute(async (req, { params }) => {
  const data = await req.json();
  const project = await updateProject(params.id, data);

  if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Project updated successfully", data: project });
});

// --- DELETE: ADMIN ONLY ---
export const DELETE = adminRoute(async (req, { params }) => {
  const result = await deleteProject(params.id);

  if (!result) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Project deleted successfully", deletedProject: result });
});