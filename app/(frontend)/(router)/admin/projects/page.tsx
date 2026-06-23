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
  Award,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

import { Project } from "./types";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectModal } from "./components/ProjectModal";
import { ProjectCardSkeleton } from "./components/ProjectCardSkeleton";
import { ConfirmationModal } from "../ebmb/components/ConfirmationModal";
import { deleteFileFromS3 } from "@/app/(backend)/libs/upload-client";
import { Pagination } from "./components/Pagination";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ITEMS_PER_PAGE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  // Filter State
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchYears = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/projects/years");
      const yearsData = res.data.data || [];
      setAvailableYears(yearsData);

      if (activeTab === 2 && !selectedYear && yearsData.length > 0) {
        setSelectedYear(yearsData[0].toString());
      }
    } catch (error) {
      console.error("Failed to fetch years", error);
    }
  }, [activeTab, selectedYear]);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  useEffect(() => {
    if (activeTab === 2 && availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0].toString());
    }
  }, [activeTab, availableYears, selectedYear]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setProjects([]);
    try {
      const params: any = {};

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
        } else {
          setIsLoading(false);
          return;
        }
      }

      const res = await axios.get("/api/v1/projects", { params });
      const data = res.data.data || {};

      let fetchedProjects: Project[] = [];
      if (activeTab === 1 && data.departmentData) {
        fetchedProjects = data.departmentData.projects || [];
      } else {
        fetchedProjects = data.projects || [];
      }

      // Sắp xếp mới nhất lên đầu
      const sortedProjects = fetchedProjects.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setProjects(sortedProjects);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedYear]);

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

      fetchProjects();
      fetchYears();
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
        Are you sure you want to delete project{" "}
        <span className="font-bold text-gray-900">{projectToDelete.title}</span>
        ? This action cannot be undone.
      </p>
    </div>
  ) : null;

  const EmptyState = ({ message = "No projects found" }) => (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300 w-full">
      <Briefcase className="text-gray-300 mb-4" size={48} />
      <h3 className="text-lg font-bold text-gray-800">{message}</h3>
    </div>
  );

  // --- 1. RENDER: ONGOING DEPARTMENTS ---
  const renderOngoingDepartments = () => {
    const depts = ["Technology", "Business", "Marketing", "Human Resources"];
    if (projects.length === 0) {
      return <EmptyState message="No ongoing department projects" />;
    }
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
      </div>
    );
  };

  // --- 2. RENDER: COMPLETED PROJECTS (GROUPED VIEW) ---
  const renderCompletedProjects = () => {
    const largeScaled = projects.filter((p) => p.type === "large-scaled");
    const depts = ["Technology", "Business", "Marketing", "Human Resources"];
    const departmentProjects = projects.filter((p) => p.type === "department");

    if (projects.length === 0) {
      return (
        <EmptyState message={`No completed projects in ${selectedYear}`} />
      );
    }

    return (
      <div className="space-y-12 w-full">
        {/* Nhóm 1: Large Scaled */}
        {largeScaled.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-2xl font-black text-[#2C305F] mb-6 flex items-center gap-2">
              <Award className="text-[#DBB968]" size={28} />
              Club-wide Project Highlights
              <span className="text-sm font-bold text-white bg-[#DBB968] px-2.5 py-0.5 rounded-full ml-2 shadow-sm">
                {largeScaled.length}
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {largeScaled.map((project) => (
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
        )}

        {/* Nhóm 2: Departments */}
        {departmentProjects.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
            <h3 className="text-2xl font-black text-[#2C305F] mb-6 flex items-center gap-2 border-t border-gray-200 pt-8">
              <Layers className="text-[#2C305F]" size={28} />
              Department Project Archives
            </h3>

            <div className="space-y-10 pl-0 md:pl-4 border-l-0 md:border-l-[3px] border-gray-100">
              {depts.map((deptName) => {
                const deptItems = departmentProjects.filter(
                  (p) => p.department === deptName,
                );
                if (deptItems.length === 0) return null;

                return (
                  <div key={deptName} className="relative">
                    <div className="hidden md:block absolute -left-[23px] top-2 w-3 h-3 bg-gray-200 rounded-full ring-4 ring-ft-background" />

                    <h4 className="text-lg font-bold text-gray-600 mb-4 flex items-center gap-2">
                      <Building2 size={20} />
                      {deptName}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {deptItems.map((project) => (
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
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- LOGIC PHÂN TRANG (Chỉ áp dụng cho Large Scaled Ongoing) ---
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const currentDisplayedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-ft-background p-6 md:p-10">
      <Toaster position="top-center" />

      {/* Breadcrumbs & Header (Giữ nguyên) */}
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
        <div className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm border border-gray-100">
          {[
            { name: "Clubwide", icon: Layers },
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

        {activeTab === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full sm:w-auto flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500 hidden sm:block">
              Filter by year:
            </span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-gray-200 text-[#2C305F] text-sm rounded-xl focus:ring-[#DBB968] focus:border-[#DBB968] block w-full sm:w-24 p-2.5 shadow-sm font-extrabold cursor-pointer outline-none transition-all"
            >
              {availableYears.length > 0 ? (
                availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No data
                </option>
              )}
            </select>
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* TAB 1: ONGOING DEPARTMENT PROJECTS */}
          {activeTab === 1 && renderOngoingDepartments()}

          {/* TAB 2: COMPLETED PROJECTS */}
          {activeTab === 2 && renderCompletedProjects()}

          {/* TAB 0: ONGOING CLUBWIDE PROJECTS */}
          {activeTab === 0 && (
            projects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {currentDisplayedProjects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onEdit={(p) => { setEditingProject(p); setIsModalOpen(true); }}
                      onDelete={() => setDeleteId(project._id)}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <EmptyState message="No ongoing club-wide projects" />
            )
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
