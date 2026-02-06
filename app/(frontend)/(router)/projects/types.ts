export type ProjectType = "large-scaled" | "department";
export type ProjectStatus = "ongoing" | "completed";
export type DepartmentType = "Business" | "Technology" | "Marketing" | "Human Resources";

export interface ApiProject {
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
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  labels: string[];
}

export interface DepartmentApiResponse {
  data: {
    departmentData: {  
      department: string;
      projects: ApiProject[];
    };
    count?: number; 
  };
}

export interface DeptTabConfig {
  value: string;
  label: string;
  color: string;
  apiDept: string;
}