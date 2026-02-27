import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  Linkedin,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Clock,
  User,
  Plus,
  Trash2,
  Briefcase,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Spinner, Progress } from "@heroui/react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { TagInput } from "../../articles/components/TagInput";
import { ImageUpload } from "../../ebmb/components/ImageUpload";
import { Event, GuestSpeaker } from "../types";
import {
  uploadFileToS3,
  deleteFileFromS3,
} from "@/app/(backend)/libs/upload-client";
import { STORAGE_PATHS } from "@/config/storage-paths";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Event | null;
  isLoading: boolean;
}

const generateTempId = () => Math.random().toString(36).substr(2, 9);

export const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading: isSaving,
}: EventModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      posterUrl: null as string | File | null,
      date: "",
      startTime: "09:00",
      endTime: "11:00",
      mode: "Offline",
      location: "",
      audience: [] as string[],
      agenda: [] as string[],
      registrationLink: "",
      registrationDeadline: "",
      poster_validation: "",
      guest_speaker: [] as (GuestSpeaker & {
        tempId?: string;
        avatarFile?: File | null;
      })[],
      partners: [] as (string | File)[],
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);

  // Speaker Temp State
  const [tempSpeaker, setTempSpeaker] = useState<{
    name: string;
    bio: string;
    linkedIn_url: string;
    avatarFile: File | null;
    avatarPreview: string | null;
  }>({
    name: "",
    bio: "",
    linkedIn_url: "",
    avatarFile: null,
    avatarPreview: null,
  });

  const agendaItems = watch("agenda") || [];
  const speakers = watch("guest_speaker") || [];
  const partners = watch("partners") || [];

  // --- INITIALIZE ---
  useEffect(() => {
    if (isOpen) {
      setUploadProgress(0);
      setIsUploading(false);
      setFilesToDelete([]);
      setTempSpeaker({
        name: "",
        bio: "",
        linkedIn_url: "",
        avatarFile: null,
        avatarPreview: null,
      });

      if (initialData) {
        reset({
          ...initialData,
          date: initialData.date
            ? new Date(initialData.date).toISOString().split("T")[0]
            : "",
          registrationDeadline: initialData.registrationDeadline
            ? new Date(initialData.registrationDeadline).toISOString()
            : "",
          poster_validation: "valid",
          guest_speaker: initialData.guest_speaker.map((s) => ({
            ...s,
            tempId: generateTempId(),
          })),
          partners: initialData.partners || [],
        });
      } else {
        reset({
          name: "",
          description: "",
          posterUrl: null,
          date: new Date().toISOString().split("T")[0],
          startTime: "09:00",
          endTime: "11:00",
          mode: "Offline",
          location: "",
          audience: [],
          agenda: [],
          registrationLink: "",
          registrationDeadline: "",
          poster_validation: "",
          guest_speaker: [],
          partners: [],
        });
      }
    }
  }, [isOpen, initialData, reset]);

  // --- HANDLERS ---
  const handleAddAgenda = () => setValue("agenda", [...agendaItems, ""]);
  const handleRemoveAgenda = (idx: number) => {
    const newArr = [...agendaItems];
    newArr.splice(idx, 1);
    setValue("agenda", newArr);
  };
  const handleChangeAgenda = (idx: number, val: string) => {
    const newArr = [...agendaItems];
    newArr[idx] = val;
    setValue("agenda", newArr);
  };

  const handleAddSpeaker = () => {
    if (
      !tempSpeaker.name ||
      !tempSpeaker.bio ||
      (!tempSpeaker.avatarFile && !tempSpeaker.avatarPreview)
    ) {
      toast.error("Please fill Name, Bio and Avatar.");
      return;
    }
    setValue("guest_speaker", [
      ...speakers,
      {
        name: tempSpeaker.name,
        bio: tempSpeaker.bio,
        linkedIn_url: tempSpeaker.linkedIn_url,
        avatar_url: tempSpeaker.avatarPreview || "",
        avatarFile: tempSpeaker.avatarFile,
        tempId: generateTempId(),
      },
    ]);
    setTempSpeaker({
      name: "",
      bio: "",
      linkedIn_url: "",
      avatarFile: null,
      avatarPreview: null,
    });
  };

  const handleRemoveSpeaker = (idx: number) => {
    const newArr = [...speakers];
    const removedSpeaker = newArr.splice(idx, 1)[0];

    if (
      removedSpeaker.avatar_url &&
      !removedSpeaker.avatar_url.startsWith("blob:")
    ) {
      setFilesToDelete((prev) => [...prev, removedSpeaker.avatar_url]);
    }

    setValue("guest_speaker", newArr);
  };

  const handleAddPartner = (file: File | null) => {
    if (file) setValue("partners", [...partners, file]);
  };

  const handleRemovePartner = (idx: number) => {
    const newArr = [...partners];
    const removedPartner = newArr.splice(idx, 1)[0];

    if (
      typeof removedPartner === "string" &&
      !removedPartner.startsWith("blob:")
    ) {
      setFilesToDelete((prev) => [...prev, removedPartner]);
    }

    setValue("partners", newArr);
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng -
      .replace(/[^\w\-]+/g, "") // Xóa ký tự đặc biệt
      .replace(/\-\-+/g, "-") // Xóa dấu - trùng lặp
      .substring(0, 50); // Giới hạn độ dài để tránh tên file quá dài
  };

  // --- SUBMIT LOGIC ---
  const onFormSubmit = async (data: any) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const eventSlug = slugify(data.name || "new-event");
      const timestamp = Date.now();

      const replacedFiles: string[] = [];

      const uploads: {
        file: File;
        path: string;
        type: "poster" | "speaker" | "partner";
        index?: number;
      }[] = [];

      // 1. POSTER
      if (data.posterUrl instanceof File) {
        uploads.push({
          file: data.posterUrl,
          path: STORAGE_PATHS.EVENTS_POSTER,
          type: "poster",
        });
        if (initialData?.posterUrl) replacedFiles.push(initialData.posterUrl);
      }

      // 2. SPEAKERS
      data.guest_speaker.forEach((sp: any, idx: number) => {
        if (sp.avatarFile instanceof File) {
          uploads.push({
            file: sp.avatarFile,
            path: STORAGE_PATHS.EVENTS_GUESTS,
            type: "speaker",
            index: idx,
          });
          if (sp.avatar_url && !sp.avatar_url.startsWith("blob:")) {
            replacedFiles.push(sp.avatar_url);
          }
        }
      });

      // 3. PARTNERS
      data.partners.forEach((p: any, idx: number) => {
        if (p instanceof File) {
          uploads.push({
            file: p,
            path: STORAGE_PATHS.EVENTS_PARTNERS,
            type: "partner",
            index: idx,
          });
        }
      });

      let finalPosterUrl = data.posterUrl instanceof File ? "" : data.posterUrl;
      const finalSpeakers = [...data.guest_speaker];
      const finalPartners = [...data.partners];

      // --- TIẾN HÀNH UPLOAD ---
      if (uploads.length > 0) {
        const totalSize = uploads.length;
        let completed = 0;
        await Promise.all(
          uploads.map(async (task) => {
            const extension = task.file.name.split(".").pop();
            let prefix = "";
            if (task.type === "poster") {
              prefix = `poster-${eventSlug}`;
            } else if (task.type === "speaker" && task.index !== undefined) {
              const speakerName = slugify(
                data.guest_speaker[task.index].name || "speaker",
              );
              prefix = `speaker-${speakerName}`;
            } else if (task.type === "partner") {
              prefix = `partner-${eventSlug}`;
            }

            const uniqueName = `${prefix}-${timestamp}.${extension}`;
            const url = await uploadFileToS3(
              task.file,
              task.path,
              uniqueName,
              () => {},
            );

            if (task.type === "poster") finalPosterUrl = url;
            if (task.type === "speaker" && task.index !== undefined) {
              finalSpeakers[task.index].avatar_url = url;
              delete finalSpeakers[task.index].avatarFile;
              delete finalSpeakers[task.index].tempId;
            }
            if (task.type === "partner" && task.index !== undefined) {
              finalPartners[task.index] = url;
            }

            completed++;
            setUploadProgress((completed / totalSize) * 100);
          }),
        );
      }

      // Gộp các file bị xóa thủ công (bấm Trash) và các file bị ghi đè (tải file mới lên)
      const allFilesToDelete = Array.from(
        new Set([...filesToDelete, ...replacedFiles]),
      );

      if (allFilesToDelete.length > 0) {
        Promise.all(
          allFilesToDelete.map((url) =>
            deleteFileFromS3(url).catch(console.error),
          ),
        ).then(() => console.log("Cleaned up old files"));
      }

      // --- TẠO PAYLOAD VÀ SUBMIT ---
      const payload = {
        ...data,
        posterUrl: finalPosterUrl,
        date: new Date(data.date),
        registrationDeadline: data.registrationDeadline
          ? new Date(data.registrationDeadline)
          : null,
        guest_speaker: finalSpeakers,
        partners: finalPartners,
        agenda: data.agenda.filter((i: string) => i.trim() !== ""),
      };
      delete payload.poster_validation;

      await onSubmit(payload);
    } catch (error) {
      console.error(error);
      toast.error("Error processing form data");
    } finally {
      setIsUploading(false);
    }
  };
  const isBusy = isUploading || isSaving;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#F3F4F6] flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-ft-primary-blue">
            {initialData ? "Edit Event" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1 hover:bg-[#E5E7EB] rounded-full transition disabled:opacity-50 text-[#6B7280]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* === LEFT COLUMN (7 cols): Content Heavy Items === */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    Basic Information
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                      Event Name <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      {...register("name", {
                        required: "Event name is required",
                      })}
                      className="w-full px-3 py-2.5 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none text-lg font-medium"
                      placeholder="Please enter the event name"
                    />
                    {errors.name && (
                      <span className="text-ft-danger text-xs mt-1 block">
                        {errors.name.message as string}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                      Description <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Event description is required",
                      })}
                      rows={6}
                      className="w-full px-3 py-2.5 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-ft-primary-yellow outline-none resize-none"
                      placeholder="Please enter the detailed event description"
                    />
                    {errors.description && (
                      <span className="text-ft-danger text-xs mt-1 block">
                        {errors.description.message as string}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ft-text-dark mb-1">
                      Target Audience <span className="text-[#EF4444]">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="audience"
                      rules={{
                        required: "At least one target audience required",
                        validate: (v) => v.length > 0,
                      }}
                      render={({ field: { onChange, value } }) => (
                        <TagInput
                          value={value}
                          onChange={onChange}
                          placeholder="Type target audience & press Enter"
                          error={errors.audience?.message as string}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* 2. Agenda (List) */}
                <div>
                  <div className="flex justify-between items-center mb-2 border-b border-[#F3F4F6] pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      Agenda (OPTIONAL)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddAgenda}
                      className="text-xs font-bold text-ft-primary-blue hover:bg-[#EFF6FF] px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {agendaItems.length === 0 && (
                      <div className="text-sm text-[#9CA3AF] italic bg-[#F9FAFB] p-3 rounded-lg text-center border border-dashed border-[#E5E7EB]">
                        No agenda items added yet.
                      </div>
                    )}
                    {agendaItems.map((item: string, index: number) => (
                      <div
                        key={index}
                        className="flex gap-2 items-center group"
                      >
                        <div className="w-6 h-6 flex items-center justify-center bg-[#F3F4F6] text-[#6B7280] rounded-full text-xs font-bold shrink-0">
                          {index + 1}
                        </div>
                        <input
                          value={item}
                          onChange={(e) =>
                            handleChangeAgenda(index, e.target.value)
                          }
                          placeholder={`e.g. 09:00 - Opening`}
                          className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-ft-primary-yellow outline-none text-sm transition-all hover:border-[#D1D5DB]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAgenda(index)}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Speakers (List) */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    Guest Speakers (OPTIONAL)
                  </h3>

                  {/* Add Form */}
                  <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] mb-4">
                    <div className="flex gap-4">
                      <div className="w-[8.5rem] h-[8.5rem] shrink-0">
                        <ImageUpload
                          value={
                            tempSpeaker.avatarFile || tempSpeaker.avatarPreview
                          }
                          onChange={(file) => {
                            if (file instanceof File) {
                              setTempSpeaker((prev) => ({
                                ...prev,
                                avatarFile: file,
                                avatarPreview: URL.createObjectURL(file),
                              }));
                            } else if (file === null) {
                              setTempSpeaker((prev) => ({
                                ...prev,
                                avatarFile: null,
                                avatarPreview: null,
                              }));
                            }
                          }}
                          className="w-full h-full rounded-full bg-white ring-2 ring-[#F3F4F6]"
                          overlayText="+"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                          <input
                            value={tempSpeaker.name}
                            onChange={(e) =>
                              setTempSpeaker((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Please enter guest speaker name"
                            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none bg-white"
                          />
                          <input
                            value={tempSpeaker.linkedIn_url}
                            onChange={(e) =>
                              setTempSpeaker((prev) => ({
                                ...prev,
                                linkedIn_url: e.target.value,
                              }))
                            }
                            placeholder="Please enter LinkedIn URL (Optional)"
                            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none bg-white"
                          />
                          <input
                            value={tempSpeaker.bio}
                            onChange={(e) =>
                              setTempSpeaker((prev) => ({
                                ...prev,
                                bio: e.target.value,
                              }))
                            }
                            placeholder="Please enter job title"
                            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none bg-white"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleAddSpeaker}
                            className="px-4 py-1.5 bg-ft-primary-blue hover:bg-[#1e2246] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Speaker
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {speakers.length === 0 && (
                      <div className="text-sm text-[#9CA3AF] italic text-center py-2">
                        No speakers added yet.
                      </div>
                    )}
                    {speakers.map((sp: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow group"
                      >
                        {/* Avatar Container */}
                        <div className="w-10 h-10 rounded-full bg-[#E5E7EB] overflow-hidden shrink-0 border border-[#F3F4F6] mt-0.5 flex items-center justify-center">
                          {sp.avatar_url || sp.avatarFile ? (
                            <img
                              src={
                                sp.avatar_url ||
                                (sp.avatarFile
                                  ? URL.createObjectURL(sp.avatarFile)
                                  : "")
                              }
                              alt={sp.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={18} className="text-[#9CA3AF]" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-bold truncate text-[#1F2937] max-w-[150px]">
                              {sp.name}
                            </p>

                            {/* LinkedIn Indicator */}
                            {sp.linkedIn_url && (
                              <a
                                href={sp.linkedIn_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0077B5] hover:bg-[#E1F2F9] p-1 rounded-md transition-colors flex items-center justify-center"
                                title="Open LinkedIn Profile"
                                onClick={(e) => e.stopPropagation()} // Ngăn chặn các sự kiện click không mong muốn từ container cha (nếu có)
                              >
                                {/* Dùng Linkedin icon thay vì LinkIcon chung chung */}
                                <Linkedin size={14} strokeWidth={2} />
                              </a>
                            )}
                          </div>

                          <p className="text-xs text-[#6B7280] line-clamp-2 mt-0.5 leading-snug">
                            {sp.bio}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveSpeaker(idx)}
                          className="text-[#9CA3AF] hover:text-[#EF4444] p-1.5 hover:bg-[#FEF2F2] rounded-lg transition-colors"
                          title="Remove Speaker"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* === RIGHT COLUMN (5 cols): Config & Media === */}
              <div className="lg:col-span-5 space-y-6 h-fit">
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    Event Poster <span className="text-[#EF4444]">*</span>
                  </h3>

                  <div>
                    <div className="h-40">
                      <input
                        type="hidden"
                        {...register("poster_validation", { required: true })}
                      />
                      <Controller
                        control={control}
                        name="posterUrl"
                        render={({ field: { onChange, value } }) => (
                          <ImageUpload
                            value={value}
                            onChange={(file) => {
                              onChange(file);
                              setValue(
                                "poster_validation",
                                file ? "valid" : "",
                                { shouldValidate: true },
                              );
                            }}
                            className="h-full w-full"
                          />
                        )}
                      />
                    </div>
                    {errors.poster_validation && (
                      <span className="text-ft-danger text-xs mt-1 block">
                        Event Poster is required
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    Logistics
                  </h3>

                  {/* Date/Time */}
                  <div className="space-y-3">
                    <div className="relative">
                      <label className="text-xs font-bold text-[#6B7280] mb-1 block">
                        Date <span className="text-[#EF4444]">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="date"
                        rules={{ required: "Date is required" }}
                        render={({ field: { onChange, value } }) => (
                          <div className="relative">
                            <DatePicker
                              selected={value ? new Date(value) : null}
                              onChange={(date: Date | null) =>
                                onChange(date ? date.toISOString() : "")
                              }
                              dateFormat="dd/MM/yyyy"
                              className="w-full px-3 py-2 pl-9 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none"
                              wrapperClassName="w-full"
                            />
                            <Calendar
                              size={14}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-[#6B7280] mb-1 block">
                          Start <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          type="time"
                          {...register("startTime", { required: true })}
                          className="w-full px-2 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-[#6B7280] mb-1 block">
                          End <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          type="time"
                          {...register("endTime", { required: true })}
                          className="w-full px-2 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Loc/Mode */}
                  <div className="space-y-3 pt-3 border-t border-[#F3F4F6]">
                    <div>
                      <label className="text-xs font-bold text-[#6B7280] mb-1 block">
                        Mode <span className="text-[#EF4444]">*</span>
                      </label>
                      <select
                        {...register("mode")}
                        className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none bg-white"
                      >
                        <option value="Offline">Offline</option>
                        <option value="Online">Online</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6B7280] mb-1 block">
                        Location / Platform{" "}
                        <span className="text-[#EF4444]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register("location", {
                            required: "Location / Platform is required",
                          })}
                          className="w-full px-3 py-2 pl-9 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none"
                          placeholder="Please enter the event location or online platform"
                        />
                        <MapPin
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                        />
                      </div>
                      {errors.location && (
                        <span className="text-ft-danger text-xs mt-1 block">
                          {errors.location.message as string}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    Registration (OPTIONAL)
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-[#6B7280] mb-1 block">
                      Link
                    </label>
                    <div className="relative">
                      <input
                        {...register("registrationLink")}
                        className="w-full px-3 py-2 pl-9 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none"
                        placeholder="Please enter the registration link"
                      />
                      <LinkIcon
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#6B7280] mb-1 block">
                      Deadline{" "}
                    </label>
                    <Controller
                      control={control}
                      name="registrationDeadline"
                      render={({ field: { onChange, value } }) => (
                        <div className="relative">
                          <DatePicker
                            selected={value ? new Date(value) : null}
                            onChange={(date: Date | null) =>
                              onChange(date ? date.toISOString() : "")
                            }
                            showTimeInput
                            timeInputLabel="Time:"
                            dateFormat="dd/MM/yyyy HH:mm"
                            className="w-full px-3 py-2 pl-9 border border-[#D1D5DB] rounded-lg text-sm focus:ring-1 focus:ring-ft-primary-yellow outline-none font-medium text-gray-700"
                            wrapperClassName="w-full"
                            placeholderText="Please select registration deadline"
                            autoComplete="off"
                          />
                          <Clock
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    Partners (OPTIONAL)
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-[#6B7280] mb-2 flex justify-between">
                      <span>Partner Logos</span>
                      <span className="text-[10px] font-normal text-[#9CA3AF]">
                        {partners.length} added
                      </span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {partners.map((p: any, idx: number) => (
                        <div
                          key={idx}
                          className="relative group aspect-square bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] flex items-center justify-center overflow-hidden p-1"
                        >
                          <img
                            src={p instanceof File ? URL.createObjectURL(p) : p}
                            alt="Partner"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePartner(idx)}
                            className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="aspect-square">
                        <ImageUpload
                          value={null}
                          onChange={handleAddPartner}
                          className="w-full h-full bg-white border border-dashed border-[#D1D5DB] hover:border-ft-primary-yellow transition-colors"
                          overlayText="+"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#F3F4F6] bg-[#F9FAFB] flex flex-col gap-3 shrink-0">
            {isUploading && (
              <div className="w-full space-y-1 animate-in fade-in">
                <div className="flex justify-between text-xs font-semibold text-ft-primary-blue">
                  <span>Uploading assets...</span>
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
                className="px-5 py-2.5 text-[#4B5563] font-bold hover:bg-[#E5E7EB] rounded-xl transition disabled:opacity-50"
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
