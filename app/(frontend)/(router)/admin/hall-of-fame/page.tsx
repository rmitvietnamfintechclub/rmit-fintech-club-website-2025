"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plus, Trophy, Calendar } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { HallOfFameSkeleton } from "./components/HallOfFameSkeleton";

import { Honoree, HOF_CATEGORIES, parseSemester } from "./types";
import { HallOfFameCard } from "./components/HallOfFameCard";
import { HallOfFameModal } from "./components/HallOfFameModal";
import { ConfirmationModal } from "../ebmb/components/ConfirmationModal";
import { deleteFileFromS3 } from "@/app/(backend)/libs/upload-client";

export default function HallOfFamePage() {
  const [honorees, setHonorees] = useState<Honoree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterTerm, setFilterTerm] = useState<string>("A");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHonoree, setEditingHonoree] = useState<Honoree | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await axios.get("/api/v1/hall-of-fame/years");
        const years = res.data;
        if (years && years.length > 0) {
          setAvailableYears(years);
          setFilterYear(years[0]);
        } else {
          const now = new Date().getFullYear();
          setAvailableYears([now]);
          setFilterYear(now);
        }
      } catch (error) {
        console.error("Failed to fetch years", error);
        const now = new Date().getFullYear();
        setAvailableYears([now]);
        setFilterYear(now);
      }
    };
    fetchYears();
  }, []);

  const fetchHonorees = async () => {
    if (!filterYear) return;
    setIsLoading(true);
    try {
      const params = {
        year: filterYear,
        semester: `${filterYear}${filterTerm}`,
      };
      const res = await axios.get("/api/v1/hall-of-fame", { params });
      setHonorees(res.data.honorees || []);
    } catch (error) {
      setHonorees([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHonorees();
  }, [filterYear, filterTerm]);

  const groupedHonorees = useMemo(() => {
    const grouped: Record<string, Honoree[]> = {};
    HOF_CATEGORIES.forEach((cat) => {
      grouped[cat] = [];
    });
    honorees.forEach((h) => {
      if (grouped[h.category]) grouped[h.category].push(h);
      else {
        if (!grouped["Others"]) grouped["Others"] = [];
        grouped["Others"].push(h);
      }
    });
    return grouped;
  }, [honorees]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingHonoree) {
        await axios.put(`/api/v1/hall-of-fame/${editingHonoree._id}`, data);
        toast.success("Updated successfully");
      } else {
        await axios.post("/api/v1/hall-of-fame", data);
        toast.success("Created successfully");

        const { year, term } = parseSemester(data.semester);

        if (!availableYears.includes(year)) {
          setAvailableYears((prev) => [...prev, year].sort((a, b) => b - a));
        }

        if (filterYear !== year || filterTerm !== term) {
          setFilterYear(year);
          setFilterTerm(term);
        } else {
          fetchHonorees();
        }
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const item = honorees.find((h) => h._id === deleteId);
    setIsDeleting(true);
    try {
      await axios.delete(`/api/v1/hall-of-fame/${deleteId}`);
      if (item?.photo_url) await deleteFileFromS3(item.photo_url);
      toast.success("Deleted successfully");
      setDeleteId(null);
      fetchHonorees();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const honoreeToDelete = honorees.find((h) => h._id === deleteId);

  const deleteModalContent = honoreeToDelete ? (
    <div className="space-y-3 mt-2 text-sm text-gray-600">
      <p>
        Are you sure you want to delete this honoree? This action cannot be
        undone.
      </p>

      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-bold text-gray-900 text-base">
            {honoreeToDelete.name}
          </span>
          <span className="text-[10px] uppercase tracking-wider bg-ft-primary-yellow/20 text-ft-primary-yellow px-2 py-0.5 rounded-full font-bold border border-ft-primary-yellow/20">
            {honoreeToDelete.category}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Calendar size={12} />
          <span>
            Semester:{" "}
            <span className="font-medium text-gray-700">
              {honoreeToDelete.semester}
            </span>
          </span>
        </div>
        <p className="italic text-gray-500 text-xs text-left line-clamp-2">
          "{honoreeToDelete.achievement}"
        </p>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-ft-background p-6 md:p-10">
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 animate-in fade-in slide-in-from-left-2 duration-500">
        <Link
          href="/admin"
          className="flex items-center gap-1 hover:text-ft-primary-blue transition-colors hover:underline"
        >
          <Home size={16} />
          <span>Dashboard</span>
        </Link>

        <ChevronRight size={16} className="text-gray-400" />

        <span className="font-semibold text-gray-800 cursor-default">
          Hall of Fame
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-ft-primary-blue tracking-tight flex items-center gap-2">
            Hall of Fame
          </h1>
          <p className="text-gray-500 mt-1">
            Honoring our most outstanding members.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingHonoree(null);
            setIsModalOpen(true);
          }}
          // Nút Add dùng ft-primary-yellow để nổi bật trên nền trắng/xám
          className="bg-ft-primary-blue text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 transition shadow-lg shadow-yellow-500/20 flex items-center gap-2"
        >
          <Plus size={20} /> Add Honoree
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm mb-10 flex flex-col sm:flex-row gap-2 items-center w-fit mx-auto sm:mx-0 animate-in fade-in zoom-in duration-300">
        {/* Year Selector */}
        <div className="relative group">
          {/* Icon Calendar bên trái */}
          <Calendar
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-ft-primary-yellow transition-colors pointer-events-none"
            size={18}
          />

          <select
            value={filterYear || ""}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            disabled={availableYears.length === 0}
            className="pl-10 pr-10 py-2.5 bg-ft-background border-0 rounded-xl font-bold text-ft-primary-blue hover:bg-gray-100 cursor-pointer outline-none focus:ring-2 focus:ring-ft-primary-yellow/50 transition-all appearance-none min-w-[120px] disabled:opacity-50"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 group-hover:text-ft-primary-yellow transition-colors"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

        <div className="flex bg-ft-background p-1 rounded-xl">
          {["A", "B", "C"].map((term) => (
            <button
              key={term}
              onClick={() => setFilterTerm(term)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                filterTerm === term
                  ? "bg-ft-primary-yellow shadow-md"
                  : "text-gray-500 hover:text-ft-primary-blue hover:bg-gray-200/50"
              }`}
            >
              Semester {term}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Render 4 cái skeleton nhìn cho xịn */}
          {[1, 2, 3, 4].map((i) => (
            <HallOfFameSkeleton key={i} />
          ))}
        </div>
      ) : honorees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-ft-primary-yellow/50 transition-colors duration-300">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Trophy className="text-gray-400" size={40} />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Honorees Yet
          </h3>

          <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
            There are no records for{" "}
            <span className="font-semibold text-gray-700">
              Semester {filterYear}
              {filterTerm}
            </span>
            .
            <br /> Start building the Hall of Fame by adding the first member.
          </p>

          <button
            onClick={() => {
              setEditingHonoree(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-ft-primary-blue text-white rounded-xl font-bold shadow-md hover:bg-ft-primary-blue-100 hover:scale-105 transition-all duration-200"
          >
            <Plus size={18} />
            <span>
              Add Honoree
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-14 pb-20">
          {HOF_CATEGORIES.map((category) => {
            const items = groupedHonorees[category];
            if (!items || items.length === 0) return null;

            return (
              <div
                key={category}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-2">
                  <div className="h-8 w-1.5 bg-ft-primary-yellow rounded-full"></div>
                  <h2 className="text-2xl font-bold text-ft-primary-blue">
                    {category}
                  </h2>
                  <span className="text-xs font-bold bg-ft-primary-blue-300/30 text-ft-primary-blue px-2.5 py-1 rounded-full">
                    {items.length}
                  </span>
                </div>

                {/* Grid Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((honoree) => (
                    <HallOfFameCard
                      key={honoree._id}
                      honoree={honoree}
                      onEdit={(h) => {
                        setEditingHonoree(h);
                        setIsModalOpen(true);
                      }}
                      onDelete={() => setDeleteId(honoree._id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <HallOfFameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingHonoree}
        isLoading={isSubmitting}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Honoree"
        description={deleteModalContent}
        isLoading={isDeleting}
      />
    </div>
  );
}
