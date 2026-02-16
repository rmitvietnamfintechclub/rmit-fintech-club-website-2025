"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Filter,
  Home,
  ChevronRight as BreadcrumbArrow,
  Calendar,
  Clock,
  Archive,
  Ban,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import clsx from "clsx";

import { Event } from "./types";
import { EventCard } from "./components/EventCard";
import { EventModal } from "./components/EventModal";
import { EventCardSkeleton } from "./components/EventCardSkeleton";
import { Pagination } from "./components/Pagination";
import { ConfirmationModal } from "../ebmb/components/ConfirmationModal";
import { deleteFileFromS3 } from "@/app/(backend)/libs/upload-client";

// Định nghĩa các Tabs
const TABS = [
  { id: "all", label: "All Events", icon: Calendar },
  { id: "open", label: "Registration Open", icon: Clock },
  { id: "closed", label: "Registration Closed", icon: Archive },
  { id: "no_reg", label: "No Registration", icon: Ban },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý Tab (Status)
  const [activeTab, setActiveTab] = useState("all");

  // Pagination & Filter
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterMode, setFilterMode] = useState("");
  const limit = 6;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FETCH DATA ---
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit };

      if (filterMode) params.mode = filterMode;

      if (activeTab !== "all") params.status = activeTab;

      const res = await axios.get("/api/v1/event", { params });
      setEvents(res.data.data.events || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, filterMode, activeTab]);

  // --- HANDLERS ---
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage(1);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await axios.put(`/api/v1/event/${editingEvent._id}`, data);
        toast.success("Event updated successfully");
      } else {
        await axios.post("/api/v1/event", data);
        toast.success("Event created successfully");
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const event = events.find((e) => e._id === deleteId);
    setIsDeleting(true);

    try {
      await axios.delete(`/api/v1/event/${deleteId}`);
      // Cleanup S3 image
      if (event?.posterUrl) {
        await deleteFileFromS3(event.posterUrl).catch(console.error);
      }
      toast.success("Deleted successfully");
      setDeleteId(null);
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const eventToDelete = events.find((e) => e._id === deleteId);

  // Render Empty State dựa trên Tab đang chọn
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        {activeTab === "open" ? (
          <Clock size={40} className="text-gray-400" />
        ) : activeTab === "closed" ? (
          <Archive size={40} className="text-gray-400" />
        ) : activeTab === "no_reg" ? (
          <Ban size={40} className="text-gray-400" />
        ) : (
          <Calendar size={40} className="text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900">No Events Found</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs text-center">
        {activeTab === "open"
          ? "There are no events with open registration currently."
          : activeTab === "closed"
            ? "No past registration events found."
            : activeTab === "no_reg"
              ? "All events have registration links configured."
              : "Create your first event to get started."}
      </p>
      {activeTab === "all" && (
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="text-ft-primary-blue font-bold hover:underline text-sm"
        >
          + Create new event
        </button>
      )}
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
        <span className="font-semibold text-gray-800">Events</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-ft-primary-blue flex items-center gap-2">
            Events
          </h1>
          <p className="text-gray-500 mt-1">
            Manage our club events.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="bg-ft-primary-blue text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow-lg flex items-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} /> Create Event
        </button>
      </div>

      {/* --- CONTROLS AREA (TABS + FILTER) --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        {/* 1. Status Tabs (Segmented Control) */}
        <div className="bg-gray-200/60 rounded-xl shadow-sm border border-gray-100 p-1.5 flex items-center overflow-x-auto max-w-full no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-white text-ft-primary-blue shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50",
                )}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-ft-primary-yellow" : ""}
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 2. Filter Bar */}
        <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterMode}
            onChange={(e) => {
              setFilterMode(e.target.value);
              setPage(1);
            }}
            className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer hover:text-ft-primary-blue transition-colors pr-2"
          >
            <option value="">All Modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-500">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={(e) => {
                  setEditingEvent(e);
                  setIsModalOpen(true);
                }}
                onDelete={() => setDeleteId(event._id)}
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
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingEvent}
        isLoading={isSubmitting}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        description={
          eventToDelete ? (
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{eventToDelete.name}</strong>? This action cannot be
              undone.
            </p>
          ) : undefined
        }
        isLoading={isDeleting}
      />
    </div>
  );
}
