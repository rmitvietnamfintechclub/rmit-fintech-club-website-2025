"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { MemberCard } from "./components/MemberCard";
import { MemberModal } from "./components/MemberModal";
import { FilterBar } from "./components/FilterBar";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { MemberSkeleton } from "./components/MemberSkeleton";
import { Member, BoardType } from "./types";
import { deleteFileFromS3 } from "@/app/(backend)/libs/upload-client";
import { PublishModal } from "./components/PublishModal";
import Link from "next/link";
import { Plus, Settings, Home, ChevronRight } from "lucide-react";

export default function EBMBPage() {
  const [activeTab, setActiveTab] = useState<BoardType>("EB");
  const [availableGens, setAvailableGens] = useState<number[]>([6]);
  const [selectedGen, setSelectedGen] = useState<number>(6);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publicGen, setPublicGen] = useState<number>(6);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Delete Modal State ---
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const initData = async () => {
      // Fetch Gens
      try {
        const resGens = await axios.get("/api/v1/generations");
        setAvailableGens(resGens.data || []);
      } catch (e) {
        console.error(e);
      }

      // Fetch Public Setting
      try {
        const resSettings = await axios.get("/api/v1/settings");
        setPublicGen(resSettings.data.value);
      } catch (e) {
        console.error(e);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    const fetchGens = async () => {
      try {
        const res = await axios.get("/api/v1/generations");
        const gens = res.data;
        if (gens && gens.length > 0) {
          setAvailableGens(gens);
          if (!gens.includes(selectedGen)) setSelectedGen(gens[0]);
        }
      } catch (error) {
        console.error("Failed to fetch generations", error);
      }
    };
    fetchGens();
  }, []);

  const fetchMembers = async (genOverride?: number) => {
    const genToFetch = genOverride || selectedGen;
    setIsLoading(true);
    try {
      const endpoint =
        activeTab === "EB"
          ? "/api/v1/executivemembers"
          : "/api/v1/managementBoard";

      const res = await axios.get(endpoint, {
        params: { generation: genToFetch },
      });

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data.members) {
        data = res.data.members;
      }

      setMembers(data.map((m: any) => ({ ...m, type: activeTab })));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [activeTab, selectedGen]);

  const fetchGens = async () => {
    try {
      const res = await axios.get("/api/v1/generations");
      const gens = res.data;
      if (gens && gens.length > 0) {
        setAvailableGens(gens);
      }
    } catch (error) {
      console.error("Failed to fetch generations", error);
    }
  };

  useEffect(() => {
    fetchGens();
  }, []);

  // --- Handlers ---

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    const memberToDelete = members.find((m) => m._id === deleteId);

    setIsDeleting(true);
    try {
      const endpoint =
        activeTab === "EB"
          ? `/api/v1/executivemembers/${deleteId}`
          : `/api/v1/managementBoard/${deleteId}`;

      await axios.delete(endpoint);

      if (memberToDelete?.photo_url) {
        try {
          await deleteFileFromS3(memberToDelete.photo_url);
        } catch (e) {
          console.error("Cleanup image failed", e);
        }
      }

      toast.success("Deleted successfully");
      setDeleteId(null);
      fetchMembers();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const endpointBase =
        activeTab === "EB"
          ? "/api/v1/executivemembers"
          : "/api/v1/managementBoard";

      const payload = { ...data, generation: Number(data.generation) };
      const newGen = Number(payload.generation);

      if (editingMember) {
        await axios.patch(`${endpointBase}/${editingMember._id}`, data);
        toast.success("Updated successfully");

        setIsModalOpen(false);

        fetchMembers();
      } else {
        // --- CREATE CASE ---
        await axios.post(endpointBase, data);
        toast.success("Created successfully");

        setIsModalOpen(false);

        if (newGen !== selectedGen) {
          setSelectedGen(newGen);

          await fetchGens();

          await fetchMembers(newGen);
        } else {
          fetchMembers();
        }
      }
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.error || "Operation failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const memberToDelete = members.find((m) => m._id === deleteId);

  const handleSavePublicGen = async (gen: number) => {
    setIsSavingConfig(true);
    try {
      await axios.post("/api/v1/settings", { generation: gen });
      setPublicGen(gen);
      toast.success(`Website is now showing Generation ${gen}`);
      setIsPublishModalOpen(false);
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSavingConfig(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
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
          EBMB Management
        </span>
      </nav>
      {/* --- Header & Controls --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            EBMB Management
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-500">Manage our club's leadership.</p>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold border border-green-200">
              Live: Gen {publicGen}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition"
          >
            <Settings size={20} />
            <span className="hidden sm:inline">Display Settings</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-ft-primary-blue text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 transition shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>
      </div>

      {/* --- Filter Bar --- */}
      <FilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGen={selectedGen}
        setSelectedGen={setSelectedGen}
        availableGens={availableGens}
      />

      {/* --- Content Grid --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <MemberSkeleton key={index} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-400 font-medium">
            No members found for Gen {selectedGen}.
          </p>
          <button
            onClick={openAddModal}
            className="text-ft-primary-blue font-bold mt-2 hover:underline"
          >
            Create first member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              onEdit={openEditModal}
              onDelete={() => openDeleteModal(member._id)}
            />
          ))}
        </div>
      )}

      {/* --- Create/Edit Modal --- */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingMember}
        defaultGen={selectedGen}
        boardType={activeTab}
        isLoading={isSubmitting}
      />

      {/* --- Delete Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Member"
        description={
          <span>
            Are you sure you want to delete member <br />{" "}
            <span className="font-bold text-gray-900">
              {memberToDelete?.name} ({memberToDelete?.position} Gen{" "}
              {memberToDelete?.generation})
            </span>
            ? <br /> This action cannot be undone.
          </span>
        }
      />

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSave={handleSavePublicGen}
        availableGens={availableGens}
        currentPublicGen={publicGen}
        isLoading={isSavingConfig}
      />
    </div>
  );
}
