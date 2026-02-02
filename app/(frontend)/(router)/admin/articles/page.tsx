"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  FileText,
  Filter,
  Calendar,
  Users,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Home, ChevronRight as BreadcrumbArrow } from "lucide-react";

import { Article } from "./types";
import { ArticleCard } from "./components/ArticleCard";
import { ArticleModal } from "./components/ArticleModal";
import { ArticleCardSkeleton } from "./components/ArticleCardSkeleton";
import { Pagination } from "./components/Pagination";
import { ConfirmationModal } from "../ebmb/components/ConfirmationModal";
import { deleteFileFromS3 } from "@/app/(backend)/libs/upload-client";

export default function ArticlePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);

  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterLabel, setFilterLabel] = useState("");
  const limit = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const res = await axios.get("/api/v1/article/labels");
        setAvailableLabels(res.data || []);
      } catch (error) {
        console.error("Failed to fetch labels", error);
      }
    };
    fetchLabels();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit };
      if (filterLabel) {
        params.labels = filterLabel;
      }

      const res = await axios.get("/api/v1/article", { params });
      setArticles(res.data.articles || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, filterLabel]);

  // --- HANDLERS ---
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingArticle) {
        await axios.put(`/api/v1/article/${editingArticle._id}`, data);
        toast.success("Article updated successfully");
      } else {
        await axios.post("/api/v1/article", data);
        toast.success("Article created successfully");
      }
      setIsModalOpen(false);
      fetchArticles();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const article = articles.find((a) => a._id === deleteId);
    try {
      await axios.delete(`/api/v1/article/${deleteId}`);

      if (article?.illustration_url)
        await deleteFileFromS3(article.illustration_url);
      if (article?.content_url) await deleteFileFromS3(article.content_url);

      toast.success("Deleted successfully");
      setDeleteId(null);
      fetchArticles();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const articleToDelete = articles.find((a) => a._id === deleteId);

  const deleteModalContent = articleToDelete ? (
    <div className="space-y-3 mt-2 text-sm text-gray-600">
      <p>
        Are you sure you want to delete this article? This action cannot be
        undone.
      </p>

      {/* Context Box */}
      <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex gap-3 items-start">
        {/* Thông tin bài viết */}
        <div className="space-y-1">
          <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight text-left">
            {articleToDelete.title}
          </h4>

          <div className="flex justify-between gap-3 text-xs text-gray-500 pt-1">
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span className="truncate max-w-[250px]">
                {articleToDelete.authors?.join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>
                {articleToDelete.publicationDate
                  ? new Date(
                      articleToDelete.publicationDate,
                    ).toLocaleDateString("en-GB")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  // --- RENDER ---
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
        <span className="font-semibold text-gray-800">Articles</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-ft-primary-blue flex items-center gap-2">
            Articles
          </h1>
          <p className="text-gray-500 mt-1">Manage news and publications.</p>
        </div>
        <button
          onClick={() => {
            setEditingArticle(null);
            setIsModalOpen(true);
          }}
          className="bg-ft-primary-blue text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow-lg flex items-center gap-2"
        >
          <Plus size={20} /> Create Article
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
            className="appearance-none bg-transparent py-2 pl-2 pr-8 text-sm font-semibold text-gray-700 outline-none cursor-pointer hover:text-ft-primary-blue transition-colors min-w-[200px]"
          >
            <option value="">All Labels</option>
            {availableLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>

          {/* Custom Chevron Icon */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <FileText className="text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No Articles Found</h3>
          <p className="text-gray-500 text-sm mb-6">
            There are no articles matching your filter.
          </p>
          <button
            onClick={() => {
              setEditingArticle(null);
              setIsModalOpen(true);
            }}
            className="text-ft-primary-blue font-bold hover:underline"
          >
            Create first article
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {articles.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                onEdit={(a) => {
                  setEditingArticle(a);
                  setIsModalOpen(true);
                }}
                onDelete={() => setDeleteId(article._id)}
              />
            ))}
          </div>

          {/* Pagination */}
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
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingArticle}
        isLoading={isSubmitting}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Article"
        description={deleteModalContent}
        isLoading={false}
      />
    </div>
  );
}
