export interface Project {
  _id: string;
  title: string;
  description: string;
  type: "large-scaled" | "department";
  status: "ongoing" | "completed";
  labels: string[];
  image_url: string;
  department?: "Business" | "Technology" | "Marketing" | "Human Resources";
  year?: number;
  exploreLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}