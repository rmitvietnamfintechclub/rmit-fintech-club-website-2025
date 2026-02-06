import ProjectModel from "@/app/(backend)/models/project";
import type { Project } from "@/app/(backend)/types/project";

// --- Service: Lấy tất cả Project ---
export async function getAllProjects() {
  const projects = await ProjectModel.find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return { 
    projects: projects as unknown as Project[], 
    count: projects.length 
  };
}

// --- Service: Lấy Project Large-Scaled & Ongoing ---
export async function getLargeScaledOngoingProjects() {
  const projects = await ProjectModel.find({
    type: "large-scaled",
    status: "ongoing",
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return { 
    projects: projects as unknown as Project[], 
    count: projects.length 
  };
}

// --- Service: Lấy Project theo Department ---
export async function getDepartmentProjects(department: string) {
  const result = await ProjectModel.aggregate([
    { 
      $match: { 
        type: "department", 
        status: "ongoing",
        department: department 
      } 
    },
    { $sort: { createdAt: -1 } },
    { $limit: 50 },
    {
      $group: {
        _id: "$department",
        department: { $first: "$department" },
        projects: {
          $push: "$$ROOT", 
        },
      },
    },
    { $project: { _id: 0 } },
  ]).exec();

  const departmentData = result[0] || {
    department,
    projects: [],
  };

  return {
    departmentData,
    count: departmentData.projects.length,
  };
}

// --- Service: Lấy Completed Project theo năm ---
export async function getCompletedProjectsByYear(year: string) {
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) throw new Error("Invalid year parameter");

  const projects = await ProjectModel.find({ 
    status: "completed",
    year: yearNum 
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return { 
    projects: projects as unknown as Project[], 
    count: projects.length, 
    year: yearNum 
  };
}

// --- Service: Tạo Project ---
export async function createProject(data: Omit<Project, "_id" | "createdAt" | "updatedAt" | "slug">) {
  const project = new ProjectModel(data);
  await project.save();
  return project;
}

export async function updateProject(id: string, updateData: Partial<Project>) {
  const project = await ProjectModel.findById(id);

  if (!project) return null;

  for (const key in updateData) {
    if (key !== "_id") {
      project.set(key, updateData[key as keyof Project]);
    }
  }

  const updatedProject = await project.save();
  return updatedProject;
}

// --- Service: Xóa Project ---
export async function deleteProject(id: string) {
  const project = await ProjectModel.findByIdAndDelete(id).lean();
  return project;
}