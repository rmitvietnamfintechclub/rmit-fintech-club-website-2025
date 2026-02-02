import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, UploadCloud, FileText } from "lucide-react";
import { Spinner, Progress } from "@heroui/react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

import { TagInput } from "./TagInput";
import { ImageUpload } from "../../ebmb/components/ImageUpload";
import { Article } from "../types";
import {
  uploadFileToS3,
  deleteFileFromS3,
} from "@/app/(backend)/libs/upload-client";
import { STORAGE_PATHS } from "@/config/storage-paths";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Article | null;
  isLoading: boolean;
}

export const ArticleModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading: isSaving,
}: ArticleModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [contentFile, setContentFile] = useState<File | null>(null);

  // --- 1. INITIALIZE FORM ---
  useEffect(() => {
    if (isOpen) {
      setUploadProgress(0);
      setIsUploading(false);
      setContentFile(null);

      if (initialData) {
        reset({
          ...initialData,
          authors: initialData.authors || [],
          labels: initialData.labels || [],
          publicationDate: initialData.publicationDate
            ? new Date(initialData.publicationDate).toISOString().split("T")[0]
            : "",
          // If editing an article with a PDF, mark validation as valid
          pdf_validation: initialData.content_url ? "valid" : "",
        });
      } else {
        reset({
          title: "",
          summary: "",
          content_url: "",
          illustration_url: null,
          authors: [],
          labels: [],
          publicationDate: new Date().toISOString().split("T")[0],
          pdf_validation: "", // Default empty to trigger required error
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // --- 2. SUBMIT HANDLER ---
  const onFormSubmit = async (data: any) => {
    try {
      let finalIllustrationUrl = data.illustration_url;
      let finalContentUrl = initialData?.content_url || "";

      // Check if we need to upload anything (Image or PDF)
      if (data.illustration_url instanceof File || contentFile) {
        setIsUploading(true);
        setUploadProgress(0);

        try {
          // A. Upload Illustration (Cover Image)
          if (data.illustration_url instanceof File) {
            const uniqueName = `cover-${Date.now()}-${data.title.replace(/\s+/g, "-").slice(0, 20)}`;
            finalIllustrationUrl = await uploadFileToS3(
              data.illustration_url,
              STORAGE_PATHS.ARTICLES_ILLUSTRATION,
              uniqueName,
              (p) => setUploadProgress(p / 2), // First 50%
            );

            // Cleanup old image
            if (initialData?.illustration_url) {
              await deleteFileFromS3(initialData.illustration_url).catch(
                console.error,
              );
            }
          }

          // B. Upload Content File (PDF)
          if (contentFile) {
            const uniqueContentName = `content-${Date.now()}-${data.title.replace(/\s+/g, "-").slice(0, 20)}.pdf`;
            finalContentUrl = await uploadFileToS3(
              contentFile,
              STORAGE_PATHS.ARTICLES_CONTENT,
              uniqueContentName,
              (p) => setUploadProgress(50 + p / 2), // Last 50%
            );

            // Cleanup old PDF
            if (initialData?.content_url) {
              await deleteFileFromS3(initialData.content_url).catch(
                console.error,
              );
            }
          }
          setUploadProgress(100);
        } catch (error) {
          toast.error("Upload failed");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // --- CREATE PAYLOAD ---
      const payload = {
        ...data,
        illustration_url: finalIllustrationUrl,
        content_url: finalContentUrl,
        // TagInput already provides arrays, so we pass them directly
        authors: data.authors,
        labels: data.labels,
        publicationDate: new Date(data.publicationDate),
      };

      // Remove the dummy validation field before sending to API
      delete payload.pdf_validation;

      await onSubmit(payload);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  const isBusy = isUploading || isSaving;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-ft-background border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-ft-primary-blue">
            {initialData ? "Edit Article" : "Create New Article"}
          </h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1 hover:bg-gray-200 rounded-full transition disabled:opacity-50 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                Title <span className="text-ft-danger">*</span>
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none transition"
                placeholder="Enter article title"
              />
              {errors.title && (
                <span className="text-ft-danger text-xs mt-1 block">
                  {errors.title.message as string}
                </span>
              )}
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                Summary <span className="text-ft-danger">*</span>
              </label>
              <textarea
                {...register("summary", { required: "Summary is required" })}
                rows={10}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none resize-none transition"
                placeholder="Enter a brief summary"
              />
              {errors.summary && (
                <span className="text-ft-danger text-xs mt-1 block">
                  {errors.summary.message as string}
                </span>
              )}
            </div>

            {/* --- MEDIA SECTION (Equal Height Grid) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT: Cover Image */}
              <div className="flex flex-col h-full">
                <label className="block text-sm font-semibold text-ft-text-dark mb-2">
                  Cover Image <span className="text-ft-danger">*</span>
                </label>
                <div className="flex-1 h-64">
                  <Controller
                    control={control}
                    name="illustration_url"
                    rules={{ required: "Cover image is required" }}
                    render={({ field: { onChange, value } }) => (
                      <ImageUpload
                        value={value}
                        onChange={onChange}
                        className="h-full w-full"
                      />
                    )}
                  />
                </div>
                {errors.illustration_url && (
                  <span className="text-ft-danger text-xs mt-1 block">
                    Cover image is required
                  </span>
                )}
              </div>

              {/* RIGHT: PDF Content */}
              <div className="flex flex-col h-full">
                <label className="block text-sm font-semibold text-ft-text-dark mb-2">
                  Content File (PDF) <span className="text-ft-danger">*</span>
                </label>

                <div className="flex-1 h-64 relative group cursor-pointer">
                  <input
                    type="hidden"
                    {...register("pdf_validation", {
                      required: "Content file is required",
                    })}
                  />

                  <div
                    className={`
                      w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 overflow-hidden relative
                      ${
                        contentFile || initialData?.content_url
                          ? "border-ft-primary-blue bg-blue-50/30 py-2"
                          : "border-gray-300 bg-gray-50 hover:bg-white hover:border-ft-primary-blue"
                      }
                    `}
                  >
                    {/* Visual Logic: Show File Info or Upload Prompt */}
                    {contentFile || initialData?.content_url ? (
                      <div className="text-center w-full px-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        {/* PDF Icon Badge */}
                        <div className="w-16 h-16 bg-white shadow-sm border border-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-3">
                          <FileText size={32} strokeWidth={1.5} />
                        </div>

                        {/* File Name / Status */}
                        <div className="max-w-full flex flex-col items-center">
                          <p className="text-sm font-bold text-gray-800 truncate mb-1 max-w-[200px]">
                            {contentFile
                              ? contentFile.name
                              : "Current Article.pdf"}
                          </p>

                          {contentFile ? (
                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                              New File Selected
                            </span>
                          ) : (
                            /* Z-Index 20 allows clicking link over the hidden input */
                            <a
                              href={initialData?.content_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="relative z-20 text-xs text-ft-primary-blue hover:text-ft-primary-yellow hover:underline font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              View current file
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </a>
                          )}
                        </div>

                        {/* Replace Button */}
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-full text-xs font-bold text-gray-600 group-hover:text-ft-primary-blue group-hover:border-ft-primary-blue/30 transition-colors pointer-events-none">
                          <UploadCloud size={14} />
                          <span>
                            {contentFile ? "Replace File" : "Upload New PDF"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Empty State
                      <div className="flex flex-col items-center text-center p-4 pointer-events-none">
                        <div className="p-3 bg-white rounded-full shadow-sm ring-1 ring-gray-100">
                          <UploadCloud
                            size={24}
                            className="text-ft-primary-blue"
                          />
                        </div>
                        <p
                          className={`text-sm font-bold transition-colors text-gray-700 group-hover:text-ft-primary-blue mt-4`}
                        >
                          Click to upload PDF
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PDF files only (Max 10MB)
                        </p>
                      </div>
                    )}

                    {/* Actual File Input (Z-Index 10 covers almost everything) */}
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setContentFile(file);
                        setValue("pdf_validation", file ? "valid" : "", {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Error Text */}
                {errors.pdf_validation && (
                  <span className="text-ft-danger text-xs mt-1 block">
                    {errors.pdf_validation.message as string}
                  </span>
                )}
              </div>
            </div>

            {/* Authors & Labels */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                  Authors <span className="text-ft-danger">*</span>
                </label>
                <Controller
                  control={control}
                  name="authors"
                  rules={{
                    required: "Authors are required",
                    validate: (val) =>
                      val.length > 0 || "At least one author is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TagInput
                      value={value}
                      onChange={onChange}
                      placeholder="Type name & press Enter..."
                      error={errors.authors?.message as string}
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                  Labels <span className="text-ft-danger">*</span>
                </label>
                <Controller
                  control={control}
                  name="labels"
                  rules={{
                    required: "Labels are required",
                    validate: (val) =>
                      val.length > 0 || "At least one label is required",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TagInput
                      value={value}
                      onChange={onChange}
                      placeholder="Type label & press Enter..."
                      error={errors.labels?.message as string}
                    />
                  )}
                />
              </div>
            </div>

            {/* Publication Date */}
            <div>
              <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                Publication Date
              </label>

              <div className="relative">
                <Controller
                  control={control}
                  name="publicationDate"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      selected={value ? new Date(value) : null}
                      onChange={(date: Date | null) => {
                        onChange(date ? date.toISOString() : "");
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                      className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none transition text-gray-700 block"
                      wrapperClassName="w-full"
                      autoComplete="off"
                    />
                  )}
                />

                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Calendar size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-ft-background flex flex-col gap-3 shrink-0">
            {isUploading && (
              <div className="w-full space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between text-xs font-semibold text-ft-primary-blue">
                  <span>Uploading files...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress
                  size="sm"
                  value={uploadProgress}
                  color="primary"
                  className="w-full"
                />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={isBusy}
                className={`relative px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${isBusy ? "bg-ft-primary-blue/70 cursor-not-allowed" : "bg-ft-primary-blue hover:brightness-110 shadow-lg shadow-blue-500/20"}`}
              >
                {isBusy && <Spinner color="white" size="sm" />}
                <span className="relative z-10">
                  {isUploading
                    ? `Processing...`
                    : isSaving
                      ? "Saving..."
                      : initialData
                        ? "Update"
                        : "Create"}
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
