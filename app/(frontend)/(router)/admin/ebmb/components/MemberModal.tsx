import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, ChevronDown } from "lucide-react";
import { Spinner, Progress } from "@heroui/react";
import { Member, BoardType } from "../types";
import { ImageUpload } from "./ImageUpload";
import { STORAGE_PATHS } from "@/config/storage-paths";
import {
  uploadFileToS3,
  deleteFileFromS3,
} from "@/app/(backend)/libs/upload-client";
import toast from "react-hot-toast";

const EB_POSITIONS = [
  "President",
  "Internal Vice President",
  "External Vice President",
  "Chief of Finance Officer",
];

const MB_POSITIONS = [
  "Head of Business",
  "Head of Technology",
  "Head of Marketing",
  "Head of Human Resources",
];

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Member | null;
  defaultGen: number;
  boardType: BoardType;
  isLoading: boolean;
}

export const MemberModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultGen,
  boardType,
  isLoading: isSaving,
}: MemberModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const positionOptions = boardType === "EB" ? EB_POSITIONS : MB_POSITIONS;

  useEffect(() => {
    if (isOpen) {
      setUploadProgress(0);
      setIsUploading(false);
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: "",
          position: positionOptions[0],
          photo_url: null,
          linkedin_url: "",
          generation: defaultGen,
        });
      }
    }
  }, [isOpen, initialData, defaultGen, reset, positionOptions]);

  const uploadFolder = boardType === "EB" ? STORAGE_PATHS.EB : STORAGE_PATHS.MB;

  const onFormSubmit = async (data: any) => {
    try {
      let finalPhotoUrl = data.photo_url;

      if (data.photo_url instanceof File) {
        setIsUploading(true);
        setUploadProgress(0);

        try {
          finalPhotoUrl = await uploadFileToS3(
            data.photo_url,
            uploadFolder,
            data.name,
            (percent) => setUploadProgress(percent),
          );
        } catch (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload image");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      if (initialData?.photo_url && initialData.photo_url !== finalPhotoUrl) {
        try {
          await deleteFileFromS3(initialData.photo_url);
        } catch (err) {
          console.error("Failed to clean up old image", err);
        }
      }

      const payload = {
        ...data,
        generation: Number(data.generation),
        photo_url: finalPhotoUrl,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Member" : "Add New Member"} ({boardType})
          </h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1 hover:bg-gray-200 rounded-full transition disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {/* --- NAME --- */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-ft-danger">*</span>
                </label>
                <input
                  {...register("name", { required: "Full Name is required" })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ft-primary-yellow outline-none transition"
                  placeholder="Please enter full name"
                />
                {errors.name && (
                  <span className="text-ft-danger text-xs mt-1 block">
                    {errors.name.message as string}
                  </span>
                )}
              </div>

              {/* --- POSITION --- */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position <span className="text-ft-danger">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("position", { required: "Position is required" })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ft-primary-yellow outline-none transition appearance-none bg-white cursor-pointer"
                  >
                    {positionOptions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  {/* Custom Arrow Icon */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
                {errors.position && (
                  <span className="text-ft-danger text-xs mt-1 block">
                    {errors.position.message as string}
                  </span>
                )}
              </div>

              {/* --- GENERATION --- */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Generation <span className="text-ft-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register("generation", {
                    required: "Generation is required",
                    min: { value: 1, message: "Generation must be at least 1" },
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ft-primary-yellow outline-none transition"
                />
                {errors.generation && (
                  <span className="text-ft-danger text-xs mt-1 block">
                    {errors.generation.message as string}
                  </span>
                )}
              </div>
            </div>

            {/* --- PHOTO URL --- */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo <span className="text-ft-danger">*</span>
              </label>
              <Controller
                control={control}
                name="photo_url"
                rules={{ required: "Profile photo is required" }}
                render={({ field: { onChange, value } }) => (
                  <ImageUpload value={value} onChange={onChange} />
                )}
              />
              {errors.photo_url && (
                <span className="text-ft-danger text-xs mt-1 block">
                  {errors.photo_url.message as string}
                </span>
              )}
            </div>

            {/* --- LINKEDIN --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL (Optional)
              </label>
              <input
                {...register("linkedin_url")}
                placeholder="Please enter LinkedIn URL"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ft-primary-yellow outline-none transition"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3 flex-shrink-0">
            {isUploading && (
              <div className="w-full space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between text-xs font-semibold text-ft-primary-blue">
                  <span>Uploading image...</span>
                  <span>{uploadProgress}%</span>
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
                className={`
                  relative overflow-hidden px-6 py-2 rounded-lg font-bold text-white transition-all flex items-center gap-2
                  ${isBusy ? "bg-ft-primary-blue/70 cursor-not-allowed" : "bg-ft-primary-blue hover:brightness-110 shadow-lg shadow-blue-500/20"}
                `}
              >
                {isBusy && <Spinner color="white" size="sm" />}
                <span>
                  {isUploading
                    ? `Uploading ${uploadProgress}%`
                    : isSaving
                      ? "Saving..."
                      : initialData
                        ? "Update"
                        : "Create"}
                </span>
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
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
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