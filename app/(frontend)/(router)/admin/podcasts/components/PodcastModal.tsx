import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Youtube, Linkedin, User } from "lucide-react";
import { Spinner, Progress } from "@heroui/react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

import { TagInput } from "../../articles/components/TagInput";
import { ImageUpload } from "../../ebmb/components/ImageUpload";
import { Podcast } from "../types";
import {
  uploadFileToS3,
  deleteFileFromS3,
} from "@/app/(backend)/libs/upload-client";
import { STORAGE_PATHS } from "@/config/storage-paths";

interface PodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Podcast | null;
  isLoading: boolean;
}

const getYouTubeID = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const PodcastModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading: isSaving,
}: PodcastModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const videoUrlValue = watch("video_url");
  const videoId = getYouTubeID(videoUrlValue);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- 1. INITIALIZE FORM ---
  useEffect(() => {
    if (isOpen) {
      setUploadProgress(0);
      setIsUploading(false);

      if (initialData) {
        reset({
          ...initialData,
          publicationDate: initialData.publicationDate
            ? new Date(initialData.publicationDate).toISOString().split("T")[0]
            : "",
          // Flatten nested validation triggers
          thumbnail_validation: "valid",
          guest_avatar_validation: "valid",
        });
      } else {
        reset({
          title: "",
          summary: "",
          video_url: "",
          thumbnail_url: null,
          labels: [],
          publicationDate: new Date().toISOString().split("T")[0],
          guest_speaker: {
            name: "",
            description: "",
            linkedIn_url: "",
            avatar_url: null,
          },
          // Hidden fields for image validation
          thumbnail_validation: "",
          guest_avatar_validation: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // --- 2. SUBMIT HANDLER ---
  const onFormSubmit = async (data: any) => {
    try {
      const videoId = getYouTubeID(data.video_url);
      const finalVideoUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : data.video_url;

      let finalThumbnailUrl = data.thumbnail_url;
      let finalGuestAvatarUrl = data.guest_speaker.avatar_url;

      const filesToUpload = [];
      if (data.thumbnail_url instanceof File) filesToUpload.push("thumbnail");
      if (data.guest_speaker.avatar_url instanceof File)
        filesToUpload.push("avatar");

      const totalFiles = filesToUpload.length;

      if (totalFiles > 0) {
        setIsUploading(true);
        setUploadProgress(0);

        try {
          let completedFiles = 0;
          const segment = 100 / totalFiles;

          const updateSmartProgress = (
            fileProgress: number,
            fileIndex: number,
          ) => {
            const total = fileIndex * segment + fileProgress / totalFiles;
            setUploadProgress(total);
          };

          // A. Upload Thumbnail
          if (data.thumbnail_url instanceof File) {
            const uniqueName = `thumb-${Date.now()}-${data.title.replace(/\s+/g, "-").slice(0, 15)}`;
            finalThumbnailUrl = await uploadFileToS3(
              data.thumbnail_url,
              STORAGE_PATHS.PODCASTS_THUMBNAIL,
              uniqueName,
              (p) => updateSmartProgress(p, completedFiles),
            );

            // Cleanup old thumbnail
            if (initialData?.thumbnail_url) {
              await deleteFileFromS3(initialData.thumbnail_url).catch(
                console.error,
              );
            }
            completedFiles++;
          }

          // B. Upload Guest Avatar
          if (data.guest_speaker.avatar_url instanceof File) {
            const uniqueName = `guest-${Date.now()}-${data.guest_speaker.name.replace(/\s+/g, "-").slice(0, 15)}`;
            finalGuestAvatarUrl = await uploadFileToS3(
              data.guest_speaker.avatar_url,
              STORAGE_PATHS.PODCASTS_GUEST,
              uniqueName,
              (p) => updateSmartProgress(p, completedFiles),
            );

            // Cleanup old avatar
            if (initialData?.guest_speaker?.avatar_url) {
              await deleteFileFromS3(
                initialData.guest_speaker.avatar_url,
              ).catch(console.error);
            }
            completedFiles++;
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
        video_url: finalVideoUrl,
        thumbnail_url: finalThumbnailUrl,
        guest_speaker: {
          ...data.guest_speaker,
          avatar_url: finalGuestAvatarUrl,
        },
        publicationDate: new Date(data.publicationDate),
      };

      delete payload.thumbnail_validation;
      delete payload.guest_avatar_validation;

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
            {initialData ? "Edit Podcast" : "Create New Podcast"}
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
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* --- LEFT COLUMN: Podcast Info --- */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Podcast Details
                </h3>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                    Title <span className="text-ft-danger">*</span>
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none transition"
                    placeholder="Please enter podcast title"
                  />
                  {errors.title && (
                    <span className="text-ft-danger text-xs mt-1 block">
                      {errors.title.message as string}
                    </span>
                  )}
                </div>

                {/* Video URL */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-ft-text-dark">
                    YouTube URL <span className="text-ft-danger">*</span>
                  </label>

                  <div className="relative">
                    <input
                      {...register("video_url", {
                        required: "Video URL is required",
                        validate: (value) =>
                          !!getYouTubeID(value) || "Invalid YouTube URL format",
                      })}
                      className={`w-full px-3 py-2.5 pl-10 pr-10 border rounded-xl outline-none transition
                                    ${
                                      errors.video_url
                                        ? "border-ft-danger focus:ring-2 focus:ring-ft-danger/20"
                                        : videoId
                                          ? "border-green-500 focus:ring-2 focus:ring-green-500/20" // Green border if valid
                                          : "border-gray-300 focus:ring-2 focus:ring-ft-primary-yellow"
                                    }
                                `}
                      placeholder="Please enter YouTube video URL"
                    />

                    {/* Icon trái */}
                    <Youtube
                      size={18}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${videoId ? "text-red-600" : "text-gray-400"}`}
                    />

                    {/* Icon phải (Status) */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {errors.video_url ? (
                        <AlertCircle
                          size={18}
                          className="text-ft-danger animate-pulse"
                        />
                      ) : videoId ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                      ) : null}
                    </div>
                  </div>

                  {/* Error Message */}
                  {errors.video_url && (
                    <span className="text-ft-danger text-xs block">
                      {errors.video_url.message as string}
                    </span>
                  )}

                  {videoId && (
                    <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-black/5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="aspect-video w-full">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                    Summary <span className="text-ft-danger">*</span>
                  </label>
                  <textarea
                    {...register("summary", {
                      required: "Summary is required",
                    })}
                    rows={10}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none resize-none transition"
                    placeholder="Please enter a brief summary of the podcast episode"
                  />
                  {errors.summary && (
                    <span className="text-ft-danger text-xs mt-1 block">
                      {errors.summary.message as string}
                    </span>
                  )}
                </div>

                {/* Date & Labels */}
                <div className="grid grid-cols-1 gap-4">
                  {/* DatePicker */}
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
                            placeholderText="DD/MM/YYYY"
                            className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none transition text-gray-700 block"
                            wrapperClassName="w-full"
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

                  {/* Labels */}
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
                          placeholder="Type label & press Enter"
                          error={errors.labels?.message as string}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-2">
                    Thumbnail <span className="text-ft-danger">*</span>
                  </label>
                  <div className="h-48">
                    <input
                      type="hidden"
                      {...register("thumbnail_validation", {
                        required: "Thumbnail is required",
                      })}
                    />
                    <Controller
                      control={control}
                      name="thumbnail_url"
                      render={({ field: { onChange, value } }) => (
                        <ImageUpload
                          value={value}
                          onChange={(file) => {
                            onChange(file);
                            setValue(
                              "thumbnail_validation",
                              file ? "valid" : "",
                              { shouldValidate: true },
                            );
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

              {/* --- RIGHT COLUMN: Guest Speaker --- */}
              <div className="space-y-5 bg-gray-50/50 pl-8 border-l-1 border-gray-100">
                <h3 className="text-sm font-bold text-ft-primary-blue uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User size={16} /> Guest Speaker
                </h3>

                {/* Guest Name */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                    Full Name <span className="text-ft-danger">*</span>
                  </label>
                  <input
                    {...register("guest_speaker.name", {
                      required: "Guest name is required",
                    })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none transition bg-white"
                    placeholder="Please enter guest speaker name"
                  />
                  {(errors.guest_speaker as any)?.name && (
                    <span className="text-ft-danger text-xs mt-1 block">
                      {(errors.guest_speaker as any).name.message}
                    </span>
                  )}
                </div>

                {/* Guest Description */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                    Description <span className="text-ft-danger">*</span>
                  </label>

                  <textarea
                    {...register("guest_speaker.description", {
                      required: "Description is required",
                    })}
                    rows={10}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none transition bg-white"
                    placeholder="Please enter a description of the guest speaker"
                  />
                  {(errors.guest_speaker as any)?.description && (
                    <span className="text-ft-danger text-xs mt-1 block">
                      {(errors.guest_speaker as any).description.message}
                    </span>
                  )}
                </div>

                {/* Guest LinkedIn */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                    LinkedIn URL (Optional)
                  </label>
                  <div className="relative">
                    <input
                      {...register("guest_speaker.linkedIn_url", {
                        required: false,
                      })}
                      className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none transition bg-white"
                      placeholder="Please enter LinkedIn profile URL"
                    />
                    <Linkedin
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
                {/* Guest Avatar */}
                <div>
                  <label className="block text-sm font-semibold text-ft-text-dark mb-2">
                    Guest Avatar <span className="text-ft-danger">*</span>
                  </label>
                  <div className="h-48">
                    <input
                      type="hidden"
                      {...register("guest_avatar_validation", {
                        required: "Avatar is required",
                      })}
                    />
                    <Controller
                      control={control}
                      name="guest_speaker.avatar_url"
                      render={({ field: { onChange, value } }) => (
                        <ImageUpload
                          value={value}
                          onChange={(file) => {
                            onChange(file);
                            setValue(
                              "guest_avatar_validation",
                              file ? "valid" : "",
                              { shouldValidate: true },
                            );
                          }}
                          className={`h-full w-full`}
                        />
                      )}
                    />
                  </div>
                  {errors.guest_avatar_validation && (
                    <span className="text-ft-danger text-xs mt-1 block">
                      Guest avatar is required
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-ft-background flex flex-col gap-3 shrink-0">
            {isUploading && (
              <div className="w-full space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between text-xs font-semibold text-ft-primary-blue">
                  <span>Uploading media...</span>
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
