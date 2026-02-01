// app/admin/ebmb/components/ImageUpload.tsx
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string | File | null;
  onChange: (file: File | string | null) => void;
}

export const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    if (typeof value === "string") {
      setPreviewUrl(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    onChange(file);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden bg-gray-50
          ${previewUrl ? "border-ft-primary-blue/50" : "border-gray-300 hover:border-ft-primary-blue hover:bg-blue-50"}
        `}
      >
        {previewUrl ? (
          <div className="relative w-full h-full group">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain p-2"
            />
            {/* Remove Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={handleRemove}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg transform hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <div className="p-4 bg-white rounded-full shadow-sm ring-1 ring-gray-100">
              <UploadCloud size={28} className="text-ft-primary-blue" />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-gray-600">Click to select</span>
              <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG (max 5MB)</p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};