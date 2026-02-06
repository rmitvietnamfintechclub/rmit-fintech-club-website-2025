"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Project, DepartmentApiResponse } from "../../types"; 

export function useDepartmentData(departments: readonly string[]) {
  const [departmentProjects, setDepartmentProjects] = useState<Record<string, Project[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const projectResults: Record<string, Project[]> = {};

        await Promise.all(
          departments.map(async (dept) => {
            const res = await axios.get<DepartmentApiResponse>("/api/v1/projects", {
              params: {
                type: "department",
                status: "ongoing",
                department: dept,
              },
              signal: controller.signal,
            });

            const responseData = res.data?.data;
            const rawProjects = responseData?.departmentData?.projects || [];

            projectResults[dept] = rawProjects.map((p) => ({
              id: p._id,
              title: p.title,
              description: p.description,
              imageUrl: p.image_url,
              link: p.exploreLink || "#",
              labels: p.labels || [],
            }));
          })
        );

        setDepartmentProjects(projectResults);
      } catch (e: any) {
        if (axios.isCancel(e)) return;

        console.error("Error fetching projects:", e);
        const msg = e.response?.status === 404 
          ? "Data source not found." 
          : "Could not load department projects.";
        setError(msg);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [departments]);

  return { departmentProjects, loading, error };
}