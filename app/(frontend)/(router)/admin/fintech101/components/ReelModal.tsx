import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  Youtube,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Spinner, Progress } from "@heroui/react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

import { TagInput } from "../../articles/components/TagInput";
import { ImageUpload } from "../../ebmb/components/ImageUpload";
import { Reel } from "../types";
import {
  uploadFileToS3,
  deleteFileFromS3,
} from "@/app/(backend)/libs/upload-client";
import { STORAGE_PATHS } from "@/config/storage-paths";

interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Reel | null;
  isLoading: boolean;
}

// Helper trích xuất ID (hỗ trợ cả link Shorts)
const getYouTubeID = (url: string) => {
  if (!url) return null;
  // Regex hỗ trợ: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const ReelModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading: isSaving,
}: ReelModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Watch input để hiển thị preview
  const videoInputVal = watch("videoInput"); // Input tạm để nhập URL
  const previewId = getYouTubeID(videoInputVal);

  useEffect(() => {
    if (isOpen) {
      setUploadProgress(0);
      setIsUploading(false);

      if (initialData) {
        reset({
          ...initialData,
          // Khi edit, giả lập lại URL youtube để hiện vào ô input
          videoInput: `https://www.youtube.com/watch?v=${initialData.videoId}`,
          publicationDate: initialData.publicationDate
            ? new Date(initialData.publicationDate).toISOString().split("T")[0]
            : "",
          thumbnail_validation: "valid",
        });
      } else {
        reset({
          title: "",
          description: "",
          videoInput: "", // Reset ô nhập
          thumbnailUrl: null,
          labels: [],
          publicationDate: new Date().toISOString().split("T")[0],
          thumbnail_validation: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = async (data: any) => {
    try {
      // 1. Validate Video ID
      const extractedId = getYouTubeID(data.videoInput);
      if (!extractedId) {
        toast.error("Invalid YouTube URL");
        return;
      }

      // 2. Upload Thumbnail
      let finalThumbnailUrl = data.thumbnailUrl;
      if (data.thumbnailUrl instanceof File) {
        setIsUploading(true);
        try {
          const uniqueName = `reel-thumb-${Date.now()}-${data.title.replace(/\s+/g, "-").slice(0, 15)}`;
          finalThumbnailUrl = await uploadFileToS3(
            data.thumbnailUrl,
            STORAGE_PATHS.REELS_THUMBNAIL,
            uniqueName,
            setUploadProgress,
          );

          // Cleanup old image
          if (initialData?.thumbnailUrl) {
            await deleteFileFromS3(initialData.thumbnailUrl).catch(
              console.error,
            );
          }
        } catch (error) {
          toast.error("Thumbnail upload failed");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // 3. Prepare Payload
      const payload = {
        title: data.title,
        description: data.description,
        videoId: extractedId,
        thumbnailUrl: finalThumbnailUrl,
        labels: data.labels,
        publicationDate: new Date(data.publicationDate),
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-ft-background border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-ft-primary-blue">
            {initialData ? "Edit Reel" : "Create New Reel"}
          </h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                Title <span className="text-ft-danger">*</span>
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none transition"
                placeholder="Please enter reel title"
              />
              {errors.title && (
                <span className="text-ft-danger text-xs mt-1 block">
                  {errors.title.message as string}
                </span>
              )}
            </div>

            {/* YouTube URL Input & Preview */}
            <div>
              <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                YouTube URL <span className="text-ft-danger">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("videoInput", {
                    required: "YouTube URL is required",
                    validate: (v) => !!getYouTubeID(v) || "Invalid YouTube URL",
                  })}
                  className={`w-full px-3 py-2.5 pl-10 pr-10 border rounded-xl outline-none transition ${previewId ? "border-green-500 ring-1 ring-green-500/20" : "border-gray-300 focus:ring-2 focus:ring-ft-primary-yellow"}`}
                  placeholder="Please enter YouTube Shorts video URL"
                />
                <Youtube
                  size={18}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${previewId ? "text-red-600" : "text-gray-400"}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {previewId ? (
                    <CheckCircle2 size={18} className="text-green-500" />
                  ) : errors.videoInput ? (
                    <AlertCircle size={18} className="text-ft-danger" />
                  ) : null}
                </div>
              </div>

              {/* Preview Box */}
              {previewId && (
                <div className="mt-3 relative rounded-xl overflow-hidden bg-black aspect-video border border-gray-200">
                  <iframe
                    src={`https://www.youtube.com/embed/${previewId}`}
                    title="Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                  <a
                    href={videoInputVal}
                    target="_blank"
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-ft-primary-blue transition"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
              {errors.videoInput && (
                <span className="text-ft-danger text-xs mt-1 block">
                  {errors.videoInput.message as string}
                </span>
              )}
            </div>

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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none resize-none transition"
                placeholder="Please enter reel description"
              />
              {errors.description && (
                <span className="text-ft-danger text-xs mt-1 block">
                  {errors.description.message as string}
                </span>
              )}
            </div>

            {/* Date & Labels */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                  Publish Date
                </label>
                <div className="relative">
                  <Controller
                    control={control}
                    name="publicationDate"
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        selected={value ? new Date(value) : null}
                        onChange={(date: Date | null) =>
                          onChange(date ? date.toISOString() : "")
                        }
                        dateFormat="dd/MM/yyyy"
                        wrapperClassName="w-full"
                        className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none"
                        autoComplete="off"
                      />
                    )}
                  />
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                  Labels
                </label>
                <Controller
                  control={control}
                  name="labels"
                  rules={{
                    required: "At least one label required",
                    validate: (v) => v.length > 0,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TagInput
                      value={value}
                      onChange={onChange}
                      placeholder="Type label and press Enter"
                      error={errors.labels?.message as string}
                    />
                  )}
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-semibold text-ft-text-dark mb-2">
                Thumbnail <span className="text-ft-danger">*</span>
              </label>
              <div className="h-40">
                <input
                  type="hidden"
                  {...register("thumbnail_validation", { required: true })}
                />
                <Controller
                  control={control}
                  name="thumbnailUrl"
                  render={({ field: { onChange, value } }) => (
                    <ImageUpload
                      value={value}
                      onChange={(file) => {
                        onChange(file);
                        setValue("thumbnail_validation", file ? "valid" : "", {
                          shouldValidate: true,
                        });
                      }}
                      className={`h-full w-full`}
                    />
                  )}
                />
              </div>
              {errors.thumbnail_validation && (
                <span className="text-ft-danger text-xs mt-1 block">
                  Thumbnail is required
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-ft-background flex flex-col gap-3 shrink-0">
            {isUploading && (
              <div className="w-full space-y-1">
                <div className="flex justify-between text-xs font-semibold text-ft-primary-blue">
                  <span>Uploading thumbnail...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress size="sm" value={uploadProgress} color="primary" />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={isBusy}
                className={`relative px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 ${isBusy ? "bg-ft-primary-blue/70" : "bg-ft-primary-blue hover:brightness-110 shadow-lg"}`}
              >
                {isBusy && <Spinner color="white" size="sm" />}
                <span>
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
                className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition"
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
