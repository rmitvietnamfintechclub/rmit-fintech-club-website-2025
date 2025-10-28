"use client";

import * as React from "react";
import DepartmentAccordion from "./components/DepartmentAccordion";
import DeptSection from "./components/DeptContentSection";
import { useDepartmentData } from "./hooks/useDepartmentData";
import { CircularProgress } from "@mui/material";
import type { DeptItemBase } from "./components/types";

const DEPT_TABS = [
 {
   value: "technology",
   label: "TECHNOLOGY",
   color: "bg-[#DBB968]",
   apiDept: "Technology",
 },
 {
   value: "business",
   label: "BUSINESS",
   color: "bg-[#2C305F]",
   apiDept: "Business",
 },
 {
   value: "marketing",
   label: "MARKETING",
   color: "bg-[#DBB968]",
   apiDept: "Marketing",
 },
 {
   value: "human-resources",
   label: "HUMAN RESOURCES",
   color: "bg-[#2C305F]",
   apiDept: "Human Resources",
 },
] as const;

const departmentApiNames = Array.from(new Set(DEPT_TABS.map((d) => d.apiDept)));

export default function DeptProjectsPage() {
  const { departmentProjects, departmentDescriptions, loading, error } =
    useDepartmentData(departmentApiNames);

  if (loading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-64">
        <CircularProgress sx={{ color: "#DCB968" }} />
        <p className="mt-4 text-lg text-[#5E5E92]">
          Loading Department Projects
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-[87vw] h-48 mx-auto my-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
        <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
          <p className="text-5xl font-bold mb-4">⚠️</p>
          <p className="text-[#2C305F] text-xl">{error}</p>
        </div>
      </div>
    );
  }

  const items = DEPT_TABS.map(({ value, label, color, apiDept }) => ({
    value,
    label,
    color,
    renderContent: (_: DeptItemBase) => (
      <DeptSection
        label={label}
        description={departmentDescriptions[apiDept] || ""}
        items={departmentProjects[apiDept] || []}
      />
    ),
  }));

  return <DepartmentAccordion items={items} defaultOpen="technology" />;
}