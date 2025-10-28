import Project from "../models/project";
import Article from "../models/article";
import Podcast from "../models/podcast";
import { Types } from "mongoose";

// Helper to find a project and flatten its structure for the client
const getProjectByIdOrSlug = async (idOrSlug: string) => {
  const query = Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const project = (await Project.findOne(query).lean()) as any;

  if (!project) {
    throw new Error("Project not found");
  }

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
        console.warn(`Unknown auto_update_type: ${project.auto_update_type}`);
        return project;
    }

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

  return project;
};

// GET all projects
export async function getAllProjects() {
  const projects = await Project.find({})
    .select("title type status category image_url year slug")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return { status: 200, data: projects, count: projects.length };
}

// GET large-scaled, ongoing projects
export async function getLargeScaledOngoingProjects() {
  const projects = await Project.find({
    type: "large-scaled",
    status: "Ongoing",
  })
    .select("title description labels image_url slug")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return { status: 200, data: projects, count: projects.length };
}

// GET department projects
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
    status: 200,
    data: departmentData,
    count: departmentData.projects.length,
  };
}

// GET completed projects by year
export async function getCompletedProjectsByYear(year: string) {
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) throw new Error("Invalid year parameter");

  const projects = await Project.find({ status: "Completed", year: yearNum })
    .select("title description image_url year slug")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return { status: 200, data: projects, count: projects.length, year: yearNum };
}

// GET a single project's details
export async function getProjectDetails(idOrSlug: string) {
  return await getProjectByIdOrSlug(idOrSlug);
}

// POST a new project
export async function createProject(data: any) {
  const project = new Project(data);
  await project.save();
  return project;
}

// PUT (update) an existing project
export async function updateProject(idOrSlug: string, updateData: any) {
  const query = Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const project = await Project.findOne(query);

  if (!project) {
    throw new Error("Project not found");
  }

  for (const key in updateData) {
    if (key !== "_id" && key !== "slug") {
      project.set(key, updateData[key]);
    }
  }

  const updatedProject = await project.save();

  return updatedProject;
}

// DELETE a project
export async function deleteProject(idOrSlug: string) {
  const query = Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };
  const project = await Project.findOneAndDelete(query);

  if (!project) throw new Error("Project not found");

  return { message: "Project deleted successfully", deletedProject: project };
}
