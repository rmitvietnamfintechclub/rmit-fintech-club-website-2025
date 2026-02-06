// app/(admin)/admin/projects/components/ProjectModal.tsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Globe } from "lucide-react";
import { Spinner, Progress } from "@heroui/react";
import toast from "react-hot-toast";

import { TagInput } from "../../articles/components/TagInput";
import { ImageUpload } from "../../ebmb/components/ImageUpload";
import { Project } from "../types";
import {
  uploadFileToS3,
  deleteFileFromS3,
} from "@/app/(backend)/libs/upload-client";
import { STORAGE_PATHS } from "@/config/storage-paths";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Project | null;
  isLoading: boolean;
}

export const ProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading: isSaving,
}: ProjectModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // UX: Watch fields to toggle visibility
  const typeValue = watch("type");
  const statusValue = watch("status");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setUploadProgress(0);
      setIsUploading(false);

      if (initialData) {
        reset({
          ...initialData,
          image_validation: "valid",
        });
      } else {
        reset({
          title: "",
          description: "",
          type: "large-scaled", // Default
          status: "ongoing", // Default
          department: "",
          year: new Date().getFullYear(),
          exploreLink: "",
          labels: [],
          image_url: null,
          image_validation: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = async (data: any) => {
    try {
      let finalImageUrl = data.image_url;

      // Handle Image Upload
      if (data.image_url instanceof File) {
        setIsUploading(true);
        setUploadProgress(0);
        try {
          const uniqueName = `project-${Date.now()}-${data.title.replace(/\s+/g, "-").slice(0, 15)}`;
          finalImageUrl = await uploadFileToS3(
            data.image_url,
            STORAGE_PATHS.PROJECTS_IMAGE,
            uniqueName,
            (p) => setUploadProgress(p),
          );

          // Delete old image on edit
          if (initialData?.image_url) {
            await deleteFileFromS3(initialData.image_url).catch(console.error);
          }
        } catch (error) {
          toast.error("Image upload failed");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // Cleanup Payload
      const payload = { ...data, image_url: finalImageUrl };
      delete payload.image_validation;

      if (payload.type !== "department") delete payload.department;
      if (payload.status === "ongoing") delete payload.year;

      await onSubmit(payload);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  const isBusy = isUploading || isSaving;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-ft-background border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-ft-primary-blue">
            {initialData ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1 hover:bg-gray-200 rounded-full transition disabled:opacity-50 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* --- LEFT: General Info --- */}
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                    Project Title <span className="text-ft-danger">*</span>
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none transition"
                    placeholder="Please enter project title"
                  />
                  {errors.title && (
                    <span className="text-ft-danger text-xs mt-1 block">
                      {errors.title.message as string}
                    </span>
                  )}
                </div>

                {/* Type & Status Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                      Type <span className="text-ft-danger">*</span>
                    </label>
                    <select
                      {...register("type", { required: true })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none bg-white cursor-pointer"
                    >
                      <option value="large-scaled">Large Scaled</option>
                      <option value="department">Department</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                      Status <span className="text-ft-danger">*</span>
                    </label>
                    <select
                      {...register("status", { required: true })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none bg-white cursor-pointer"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Conditional: Department */}
                {typeValue === "department" && (
                  <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                    <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                      Department Name <span className="text-ft-danger">*</span>
                    </label>
                    <select
                      {...register("department", {
                        required: "Department is required for this type",
                      })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none bg-white"
                    >
                      <option value="">Select Department</option>
                      <option value="Business">Business</option>
                      <option value="Technology">Technology</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                    {errors.department && (
                      <span className="text-ft-danger text-xs mt-1 block">
                        {errors.department.message as string}
                      </span>
                    )}
                  </div>
                )}

                {/* Conditional: Year */}
                {statusValue === "completed" && (
                  <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                    <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                      Completion Year <span className="text-ft-danger">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("year", {
                        required: "Year is required for completed projects",
                        min: { value: 2000, message: "Invalid year" },
                      })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none"
                      placeholder="Please enter completion year"
                    />
                    {errors.year && (
                      <span className="text-ft-danger text-xs mt-1 block">
                        {errors.year.message as string}
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                    Description <span className="text-ft-danger">*</span>
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={10}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none resize-none"
                    placeholder="Please enter brief description of the project"
                  />
                  {errors.description && (
                    <span className="text-ft-danger text-xs mt-1 block">
                      {errors.description.message as string}
                    </span>
                  )}
                </div>
              </div>

              {/* --- RIGHT: Media & Meta --- */}
              <div className="space-y-5 bg-gray-50/50 pl-0 lg:pl-8 lg:border-l border-gray-100 pt-5 lg:pt-0 border-t lg:border-t-0">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-2">
                    Project Image <span className="text-ft-danger">*</span>
                  </label>
                  <div className="h-56">
                    <input
                      type="hidden"
                      {...register("image_validation", {
                        required: "Image is required",
                      })}
                    />
                    <Controller
                      control={control}
                      name="image_url"
                      render={({ field: { onChange, value } }) => (
                        <ImageUpload
                          value={value}
                          onChange={(file) => {
                            onChange(file);
                            setValue("image_validation", file ? "valid" : "", {
                              shouldValidate: true,
                            });
                          }}
                          className="h-full w-full"
                        />
                      )}
                    />
                  </div>
                  {errors.image_validation && (
                    <span className="text-ft-danger text-xs mt-1 block">
                      Project image is required
                    </span>
                  )}
                </div>

                {/* Explore Link */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                    Explore Link (Optional)
                  </label>
                  <div className="relative">
                    <input
                      {...register("exploreLink")}
                      className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none"
                      placeholder="Please enter external link"
                    />
                    <Globe
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                    Labels <span className="text-ft-danger">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="labels"
                    rules={{ required: "At least one label required" }}
                    render={({ field: { onChange, value } }) => (
                      <TagInput
                        value={value}
                        onChange={onChange}
                        placeholder="Enter label & press Enter"
                        error={errors.labels?.message as string}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-ft-background flex flex-col gap-3 shrink-0">
            {isUploading && (
              <div className="w-full space-y-1 animate-in fade-in">
                <div className="flex justify-between text-xs font-semibold text-ft-primary-blue">
                  <span>Uploading image...</span>
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
                className={`relative px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${isBusy ? "bg-ft-primary-blue/70 cursor-not-allowed" : "bg-ft-primary-blue hover:brightness-110 shadow-lg"}`}
              >
                {isBusy && <Spinner color="white" size="sm" />}
                <span className="relative z-10">
                  {isUploading
                    ? "Uploading..."
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
