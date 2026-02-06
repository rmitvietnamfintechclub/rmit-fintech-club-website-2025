export type ProjectType = "large-scaled" | "department";
export type ProjectStatus = "ongoing" | "completed";
export type DepartmentType = "Business" | "Technology" | "Marketing" | "Human Resources";

export interface Project {
  _id: string;
  title: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  labels: string[];
  image_url: string;
  department?: DepartmentType; 
  year?: number; 
  exploreLink?: string;
  createdAt?: string;
}