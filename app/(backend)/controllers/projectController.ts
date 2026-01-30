import Project from "@/app/(backend)/models/project";
import Article from "@/app/(backend)/models/article";
import Podcast from "@/app/(backend)/models/podcast";
import { Types } from "mongoose";

// --- Helper: Tìm Project theo ID hoặc Slug (Kèm logic Media auto-update) ---
export const getProjectByIdOrSlug = async (idOrSlug: string) => {
  const query = Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const project = (await Project.findOne(query).lean()) as any;

  if (!project) return null;

  // Logic đặc biệt: Tự động lấy Article/Podcast mới nhất nếu là Media Project
  if (project.category === "media" && project.auto_update_type) {
    let Model: any;
    let fieldsToSelect: string;

    switch (project.auto_update_type) {
      case "FinTechTainment":
        Model = Podcast;
        fieldsToSelect = "_id title thumbnail_url publicationDate";
        break;
      case "Article":
        Model = Article;
        fieldsToSelect = "_id title illustration_url publicationDate";
        break;
      default:
        // Nếu không khớp type nào thì trả về project gốc
        return project;
    }

    if (Model) {
      const latestProducts = await Model.find({})
        .sort({ publicationDate: -1 })
        .limit(project.auto_update_limit || 6)
        .select(fieldsToSelect)
        .lean();

      project.products = latestProducts.map((doc: any) => ({
        onModel: project.auto_update_type,
        product: doc,
      }));
    }
  }

  return project;
};

// --- Service: Lấy tất cả Project ---
export async function getAllProjects() {
  const projects = await Project.find({})
    .select("title type status category image_url year slug")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return { projects, count: projects.length };
}

// --- Service: Lấy Project Large-Scaled & Ongoing ---
export async function getLargeScaledOngoingProjects() {
  const projects = await Project.find({
    type: "large-scaled",
    status: "Ongoing",
  })
    .select("title description labels image_url slug")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
    
  return { projects, count: projects.length };
}

// --- Service: Lấy Project theo Department ---
export async function getDepartmentProjects(department: string) {
  const result = await Project.aggregate([
    { $match: { type: "department", status: "Ongoing", department } },
    { $sort: { createdAt: -1 } },
    { $limit: 50 },
    {
      $group: {
        _id: "$department",
        department: { $first: "$department" },
        department_description: { $first: "$department_description" },
        projects: {
          $push: {
            title: "$title",
            description: "$description",
            image_url: "$image_url",
            slug: "$slug",
          },
        },
      },
    },
    { $project: { _id: 0 } },
  ]).exec();

  const departmentData = result[0] || {
    department,
    department_description: "",
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

  const projects = await Project.find({ status: "Completed", year: yearNum })
    .select("title description image_url year slug")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return { projects, count: projects.length, year: yearNum };
}

// --- Service: Tạo Project ---
export async function createProject(data: any) {
  const project = new Project(data);
  await project.save();
  return project;
}

// --- Service: Update Project ---
export async function updateProject(idOrSlug: string, updateData: any) {
  const query = Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const project = await Project.findOne(query);

  if (!project) return null;

  // Cập nhật từng field (trừ _id và slug nếu không muốn đổi)
  for (const key in updateData) {
    if (key !== "_id" && key !== "slug") {
      project.set(key, updateData[key]);
    }
  }

  const updatedProject = await project.save();
  return updatedProject;
}

// --- Service: Xóa Project ---
export async function deleteProject(idOrSlug: string) {
  const query = Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };
    
  const project = await Project.findOneAndDelete(query).lean();
  return project;
}