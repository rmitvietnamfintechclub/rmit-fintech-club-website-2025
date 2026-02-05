"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Film,
  Filter,
  Home,
  ChevronRight as BreadcrumbArrow,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

import { Reel } from "./types";
import { ReelCard } from "./components/ReelCard";
import { ReelModal } from "./components/ReelModal";
import { Pagination } from "./components/Pagination";
import { ConfirmationModal } from "../ebmb/components/ConfirmationModal";
import { deleteFileFromS3 } from "@/app/(backend)/libs/upload-client";
import { ReelCardSkeleton } from "./components/ReelCardSkeleton";

export default function ReelPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);

  // Pagination & Filter
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterLabel, setFilterLabel] = useState("");
  const limit = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Reel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FETCH DATA ---
  const fetchLabels = async () => {
    try {
      const res = await axios.get("/api/v1/reel/labels");
      setAvailableLabels(res.data || []);
    } catch (error) {
      console.error("Failed to fetch labels", error);
    }
  };

  const fetchReels = async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit };
      if (filterLabel) params.labels = filterLabel;

      const res = await axios.get("/api/v1/reel", { params });
      setReels(res.data.reels || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setReels([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);
  useEffect(() => {
    fetchReels();
  }, [page, filterLabel]);

  // --- HANDLERS ---
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingReel) {
        await axios.put(`/api/v1/reel/${editingReel._id}`, data);
        toast.success("Reel updated successfully");
      } else {
        await axios.post("/api/v1/reel", data);
        toast.success("Reel created successfully");
      }
      setIsModalOpen(false);
      fetchReels();
      fetchLabels();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save reel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const reel = reels.find((r) => r._id === deleteId);

    setIsDeleting(true);

    try {
      await axios.delete(`/api/v1/reel/${deleteId}`);
      if (reel?.thumbnailUrl)
        await deleteFileFromS3(reel.thumbnailUrl).catch(console.error);

      toast.success("Deleted successfully");
      setDeleteId(null);
      fetchReels();
      fetchLabels();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const reelToDelete = reels.find((r) => r._id === deleteId);

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
        <span className="font-semibold text-gray-800">FinTech 101</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-ft-primary-blue flex items-center gap-2">
            FinTech 101
          </h1>
          <p className="text-gray-500 mt-1">Manage FinTech 101 videos.</p>
        </div>
        <button
          onClick={() => {
            setEditingReel(null);
            setIsModalOpen(true);
          }}
          className="bg-ft-primary-blue text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow-lg flex items-center gap-2"
        >
          <Plus size={20} /> Create Reel
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm mb-8 w-fit flex items-center border border-gray-100">
        <div className="pl-3 pr-2 text-gray-400">
          <Filter size={18} />
        </div>
        <div className="relative group">
          <select
            value={filterLabel}
            onChange={(e) => {
              setFilterLabel(e.target.value);
              setPage(1);
            }}
            className="appearance-none bg-transparent py-2 pl-2 pr-8 text-sm font-semibold text-gray-700 outline-none cursor-pointer hover:text-ft-primary-blue transition-colors min-w-[300px]"
          >
            <option value="">All Labels</option>
            {availableLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-ft-primary-blue transition-colors">
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
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <ReelCardSkeleton key={i} />
          ))}
        </div>
      ) : reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <Film className="text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No Reels Found</h3>
          <button
            onClick={() => {
              setEditingReel(null);
              setIsModalOpen(true);
            }}
            className="text-ft-primary-blue font-bold hover:underline mt-2"
          >
            Create first reel
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {reels.map((reel) => (
              <ReelCard
                key={reel._id}
                reel={reel}
                onEdit={(r) => {
                  setEditingReel(r);
                  setIsModalOpen(true);
                }}
                onDelete={() => setDeleteId(reel._id)}
              />
            ))}
          </div>
          <div className="pb-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      {/* Modals */}
      <ReelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingReel}
        isLoading={isSubmitting}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Reel"
        description={
          reelToDelete ? (
            <div className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <strong className="text-black">{reelToDelete.title}</strong>? This
              action cannot be undone.
            </div>
          ) : null
        }
        isLoading={isDeleting}
      />
    </div>
  );
}
