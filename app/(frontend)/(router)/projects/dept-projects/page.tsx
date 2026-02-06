// src/app/.../DeptProjectsPage.tsx
"use client";

import React from "react";
import { Spinner } from "@heroui/react"; // Hoặc spinner của bạn
import DepartmentAccordion from "./components/DepartmentAccordion";
import DeptSection from "./components/DeptContentSection";
import { useDepartmentData } from "./hooks/useDepartmentData";
import { DeptTabConfig } from "../types";

const DEPT_TABS: DeptTabConfig[] = [
  { value: "technology", label: "TECHNOLOGY", color: "bg-[#DBB968]", apiDept: "Technology" },
  { value: "business", label: "BUSINESS", color: "bg-[#2C305F]", apiDept: "Business" },
  { value: "marketing", label: "MARKETING", color: "bg-[#DBB968]", apiDept: "Marketing" },
  { value: "human-resources", label: "HUMAN RESOURCES", color: "bg-[#2C305F]", apiDept: "Human Resources" },
];

const apiDepts = Array.from(new Set(DEPT_TABS.map((d) => d.apiDept)));

export default function DeptProjectsPage() {
  const { departmentProjects, loading, error } = useDepartmentData(apiDepts);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen p-8">
        <Spinner
          size="lg"
          classNames={{
            wrapper: "w-16 h-16",
            circle1: "border-b-ft-primary-yellow border-[4px]",
            circle2: "border-b-ft-primary-yellow border-[4px]",
          }}
        />
        <p className="mt-5 text-lg font-semibold text-[#5E5E92] animate-pulse tracking-wide">
          Loading Department Projects...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[95vh] w-full px-4">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 shadow-sm text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const items = DEPT_TABS.map(({ value, label, color, apiDept }) => ({
    value,
    label,
    color,
    renderContent: () => (
      <DeptSection
        label={label}
        items={departmentProjects[apiDept] || []}
      />
    ),
  }));

  return <DepartmentAccordion items={items} defaultOpen="technology" />;
}