import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { Spinner, Progress } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

import { Honoree, HOF_CATEGORIES, parseSemester } from "../types";
import { ImageUpload } from "../../ebmb/components/ImageUpload";
import {
  uploadFileToS3,
  deleteFileFromS3,
} from "@/app/(backend)/libs/upload-client";
import { STORAGE_PATHS } from "@/config/storage-paths";

interface HallOfFameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Honoree | null;
  isLoading: boolean;
}

export const HallOfFameModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading: isSaving,
}: HallOfFameModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [isUploading, setIsUploading] = useState(false);
  const currentName = watch("name");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedTerm, setSelectedTerm] = useState("A");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
        const { year, term } = parseSemester(initialData.semester);
        setSelectedYear(year);
        setSelectedTerm(term);
      } else {
        reset({
          name: "",
          achievement: "",
          category: HOF_CATEGORIES[0],
          photo_url: null,
          semester: "",
        });
        setSelectedYear(currentYear);
        setSelectedTerm("A");
      }
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = async (data: any) => {
    try {
      let finalPhotoUrl = data.photo_url;

      if (data.photo_url instanceof File) {
        setIsUploading(true);

        const semesterPrefix = `${selectedYear}${selectedTerm}`;
        const uniqueFileName = `${semesterPrefix}-${data.name.replace(/\s+/g, "-")}-${Date.now()}`;

        try {
          finalPhotoUrl = await uploadFileToS3(
            data.photo_url,
            STORAGE_PATHS.HALL_OF_FAME,
            uniqueFileName,
            (percent) => setUploadProgress(percent),
          );
        } catch (error) {
          toast.error("Failed to upload image");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      if (initialData?.photo_url && initialData.photo_url !== finalPhotoUrl) {
        deleteFileFromS3(initialData.photo_url).catch(console.error);
      }

      const semesterString = `${selectedYear}${selectedTerm}`;

      const payload = {
        ...data,
        photo_url: finalPhotoUrl,
        semester: semesterString,
      };

      await onSubmit(payload);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  const isBusy = isUploading || isSaving;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-ft-background border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-ft-primary-blue">
            {initialData ? "Edit Honoree" : "Add New Honoree"}
          </h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1 hover:bg-gray-200 rounded-full transition disabled:opacity-50 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                Full Name <span className="text-ft-danger">*</span>
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow focus:border-transparent outline-none transition"
                placeholder="Please enter full name"
              />
              {errors.name && (
                <span className="text-ft-danger text-xs mt-1 block">
                  {errors.name.message as string}
                </span>
              )}
            </div>

            {/* Achievement */}
            <div>
              <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                Achievement <span className="text-ft-danger">*</span>
              </label>
              <input
                type="text"
                {...register("achievement", {
                  required: "Achievement is required",
                  maxLength: {
                    value: 500,
                    message: "Max 500 characters allowed",
                  },
                })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow focus:border-transparent outline-none transition"
                placeholder="Ex: Hack-A-Venture MVP"
              />
              {errors.achievement && (
                <span className="text-ft-danger text-xs mt-1 block">
                  {errors.achievement.message as string}
                </span>
              )}
            </div>

            {/* Row: Category & Semester */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                  Category <span className="text-ft-danger">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("category", { required: true })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                  >
                    {HOF_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                  Semester <span className="text-ft-danger">*</span>
                </label>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      placeholder="YYYY"
                      min={2000}
                      max={2100}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div className="relative w-24">
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow focus:border-transparent outline-none bg-white appearance-none cursor-pointer text-center font-medium"
                    >
                      {["A", "B", "C"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Helper text nhỏ bên dưới để user hiểu format */}
                <p className="text-[10px] text-gray-400 mt-1 pl-1">
                  Ex: Year 2025, Semester A → Result: 2025A
                </p>
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                Profile Photo <span className="text-ft-danger">*</span>
              </label>
              <Controller
                control={control}
                name="photo_url"
                rules={{ required: "Photo is required" }}
                render={({ field: { onChange, value } }) => (
                  <ImageUpload value={value} onChange={onChange} />
                )}
              />
              {errors.photo_url && (
                <span className="text-ft-danger text-xs mt-1 block">
                  Profile photo is required
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-ft-background flex flex-col gap-3 shrink-0">
            {/* 🔥 ADDED: Progress Bar UI */}
            {isUploading && (
              <div className="w-full space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between text-xs font-semibold text-ft-primary-blue">
                  <span>Uploading image...</span>
                  {/* Bạn cần thêm state uploadProgress vào component này giống EBMBModal */}
                  <span>{uploadProgress}%</span>
                </div>
                {/* Import Progress từ @heroui/react */}
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
                className={`
                  relative overflow-hidden px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center gap-2 
                  ${isBusy ? "bg-ft-primary-blue/70 cursor-not-allowed" : "bg-ft-primary-blue hover:brightness-110 shadow-lg shadow-blue-500/20"}
                `}
              >
                {isBusy && <Spinner color="white" size="sm" />}

                {/* Z-index 10 để text nằm trên overlay progress */}
                <span className="relative z-10">
                  {isUploading
                    ? `Uploading ${uploadProgress}%`
                    : isSaving
                      ? "Saving..."
                      : initialData
                        ? "Update"
                        : "Create"}
                </span>

                {/* Optional: Overlay Progress ngay trên nút bấm (Style giống EBMBModal) */}
                {isUploading && (
                  <div
                    className="absolute inset-0 bg-white/20 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                )}
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
