"use client";

import * as React from "react";
import axios from "axios";
import type { DeptProjectsMap, ApiResponse, Project } from "../components/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api/v1";

export function useDepartmentData(departments: readonly string[]) {
  const [departmentProjects, setDepartmentProjects] = React.useState<DeptProjectsMap>({});
  const [departmentDescriptions, setDepartmentDescriptions] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const projectResults: DeptProjectsMap = {};
        const descriptionResults: Record<string, string> = {};

        await Promise.all(
          departments.map(async (dept) => {
            const res = await axios.get<ApiResponse>(`${API_BASE}/projects`, {
              params: { type: "department", status: "Ongoing", department: dept },
              signal: controller.signal,
            });

            const projectList = res.data?.data?.projects ?? [];
            projectResults[dept] = projectList.map((p): Project => ({
              id: p.slug,
              title: p.title,
              imageUrl: p.image_url,
              slug: p.slug,
              description: p.description,
            }));

            descriptionResults[dept] = res.data?.data?.department_description ?? "";
          })
        );

        setDepartmentProjects(projectResults);
        setDepartmentDescriptions(descriptionResults);
      } catch (e: any) {
        console.error("Error fetching department projects:", e);
        if (axios.isCancel(e)) return;
        
        // Simplified error handling
        const message = e.response?.status === 404
          ? "Department projects API not found."
          : e.code === "ERR_NETWORK"
          ? "Network error. Please check your connection."
          : "Failed to fetch department projects.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [departments]);

  return { departmentProjects, departmentDescriptions, loading, error };
}