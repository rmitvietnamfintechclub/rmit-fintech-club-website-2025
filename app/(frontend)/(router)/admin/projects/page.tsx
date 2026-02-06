"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Plus,
  Briefcase,
  Home,
  ChevronRight as BreadcrumbArrow,
  Layers,
  Building2,
  CheckCircle2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

import { Project } from "./types";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectModal } from "./components/ProjectModal";
import { ProjectCardSkeleton } from "./components/ProjectCardSkeleton";
import { ConfirmationModal } from "../ebmb/components/ConfirmationModal";
import { deleteFileFromS3 } from "@/app/(backend)/libs/upload-client";

// Helper để class active tab
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // State filter năm
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 1. FETCH YEARS FUNCTION (Tách ra để tái sử dụng) ---
  const fetchYears = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/projects/years");
      setAvailableYears(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch years", error);
    }
  }, []);

  // Gọi fetchYears khi mount
  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  // --- 2. FETCH PROJECTS ---
  const fetchProjects = async () => {
    setIsLoading(true);
    setProjects([]);
    try {
      const params: any = { limit: 100 };

      if (activeTab === 0) {
        params.type = "large-scaled";
        params.status = "ongoing";
      } else if (activeTab === 1) {
        params.type = "department";
        params.status = "ongoing";
      } else if (activeTab === 2) {
        params.status = "completed";
        if (selectedYear) {
          params.year = selectedYear;
        }
      }

      const res = await axios.get("/api/v1/projects", { params });
      const data = res.data.data || {};

      if (activeTab === 1 && data.departmentData) {
        setProjects(data.departmentData.projects || []);
      } else {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 2) setSelectedYear("");
    fetchProjects();
  }, [activeTab, selectedYear]);

  // --- 3. HANDLERS (Update fetchYears here) ---
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        await axios.put(`/api/v1/projects/${editingProject._id}`, data);
        toast.success("Project updated");
      } else {
        await axios.post("/api/v1/projects", data);
        toast.success("Project created");
      }
      setIsModalOpen(false);

      // 🔥 REFRESH DATA & YEARS
      fetchProjects();
      fetchYears(); // Cập nhật lại list năm (phòng trường hợp thêm mới project completed có năm mới)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error saving project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const project = projects.find((p) => p._id === deleteId);
    setIsDeleting(true);
    try {
      await axios.delete(`/api/v1/projects/${deleteId}`);
      if (project?.image_url)
        await deleteFileFromS3(project.image_url).catch(console.error);

      toast.success("Deleted successfully");
      setDeleteId(null);

      fetchProjects();
      fetchYears();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const projectToDelete = projects.find((p) => p._id === deleteId);

  const deleteConfirmationContent = projectToDelete ? (
    <div className="space-y-4 text-left">
      <p className="text-gray-600 text-sm text-center">
        Are you sure you want to delete project <br />{" "}
        <span className="font-bold text-gray-900">{projectToDelete.title}</span>
        ? <br /> This action cannot be undone.
      </p>
    </div>
  ) : null;

  // --- RENDER SECTIONS ---
  const renderDepartmentSection = () => {
    const depts = ["Technology", "Business", "Marketing", "Human Resources"];
    return (
      <div className="space-y-10">
        {depts.map((deptName) => {
          const deptProjects = projects.filter(
            (p) => p.department === deptName,
          );
          if (deptProjects.length === 0) return null;

          return (
            <div
              key={deptName}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Building2 className="text-ft-primary-blue" size={24} />
                {deptName}
                <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-2">
                  {deptProjects.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deptProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={(p) => {
                      setEditingProject(p);
                      setIsModalOpen(true);
                    }}
                    onDelete={() => setDeleteId(project._id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {projects.length === 0 && !isLoading && <EmptyState />}
      </div>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
      <Briefcase className="text-gray-400 mb-4" size={48} />
      <h3 className="text-lg font-bold text-gray-900">No Projects Found</h3>
      <p className="text-gray-500 text-sm">No projects in this category yet.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-ft-background p-6 md:p-10">
      <Toaster position="top-center" />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link
          href="/admin"
          className="flex items-center gap-1 hover:text-ft-primary-blue"
        >
          <Home size={16} /> Dashboard
        </Link>
        <BreadcrumbArrow size={16} />
        <span className="font-semibold text-gray-800">Projects</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-ft-primary-blue flex items-center gap-2">
            Projects
          </h1>
          <p className="text-gray-500 mt-1">Manage our club activities.</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="bg-ft-primary-blue text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow-lg flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* TABS & FILTERS CONTAINER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        {/* Tabs Group */}
        <div className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm border border-gray-100">
          {[
            { name: "Large Scaled", icon: Layers },
            { name: "Departments", icon: Building2 },
            { name: "Completed", icon: CheckCircle2 },
          ].map((tab, idx) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(idx)}
              className={classNames(
                "flex items-center gap-2 rounded-lg py-2.5 px-4 text-sm font-bold leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all",
                activeTab === idx
                  ? "bg-ft-primary-blue text-white shadow"
                  : "text-gray-500 hover:bg-gray-100 hover:text-ft-primary-blue",
              )}
            >
              <tab.icon
                size={16}
                className={activeTab === idx ? "text-ft-primary-yellow" : ""}
              />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Year Filter (Chỉ hiện khi ở tab Completed) */}
        {activeTab === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full sm:w-auto">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-ft-primary-blue focus:border-ft-primary-blue block w-full sm:w-48 p-2.5 shadow-sm font-semibold cursor-pointer outline-none transition-all hover:border-ft-primary-blue"
            >
              <option value="">All Years</option>
              {availableYears.length > 0 ? (
                availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No year available
                </option>
              )}
            </select>
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {activeTab === 1 ? (
            // Render Grouped by Department
            renderDepartmentSection()
          ) : // Render Grid Normally (Large Scaled or Completed)
          projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={(p) => {
                    setEditingProject(p);
                    setIsModalOpen(true);
                  }}
                  onDelete={() => setDeleteId(project._id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingProject}
        isLoading={isSubmitting}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description={deleteConfirmationContent}
        isLoading={isDeleting}
      />
    </div>
  );
}
