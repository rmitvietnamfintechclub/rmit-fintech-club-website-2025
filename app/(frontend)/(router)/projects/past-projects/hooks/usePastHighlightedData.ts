"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Project } from "../../types";

export function usePastHighlightedData() {
  const [groupedProjects, setGroupedGroupedProjects] = useState<Record<number, Project[]>>({});
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPastProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/v1/projects", {
          params: {
            type: "large-scaled",
            status: "completed",
          },
          signal: controller.signal,
        });

        const rawProjects = res.data?.data?.projects || res.data?.projects || [];

        const grouped = rawProjects.reduce((acc: Record<number, Project[]>, p: any) => {
          const projectYear = p.year || 2025;
          if (!acc[projectYear]) acc[projectYear] = [];
          
          acc[projectYear].push({
            id: p._id,
            title: p.title,
            description: p.description,
            imageUrl: p.image_url,
            link: p.exploreLink || "#",
            labels: p.labels || [],
          });
          return acc;
        }, {} as Record<number, Project[]>);

        // Sắp xếp danh sách năm từ mới nhất đến cũ nhất
        const sortedYears = Object.keys(grouped)
          .map(Number)
          .sort((a, b) => b - a);

        setGroupedGroupedProjects(grouped);
        setYears(sortedYears);
      } catch (e: any) {
        if (axios.isCancel(e)) return;
        console.error("Error fetching past highlighted projects:", e);
        setError("Could not load past highlighted projects.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchPastProjects();
    return () => controller.abort();
  }, []);

  return { groupedProjects, years, loading, error };
}