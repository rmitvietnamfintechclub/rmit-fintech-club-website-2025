import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string | File | null;
  onChange: (file: File | string | null) => void;
  className?: string;
}

export const ImageUpload = ({ 
  value, 
  onChange, 
  className = "h-56 w-full" 
}: ImageUploadProps) => {
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
    <div className="w-full h-full"> 
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 overflow-hidden bg-gray-50
          ${previewUrl 
            ? "border-ft-primary-blue/50 bg-blue-50/10" 
            : "border-gray-300 hover:border-ft-primary-blue hover:bg-blue-50"}
          ${className} 
        `}
      >
        {previewUrl ? (
          <div className="relative w-full h-full group">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain" 
            />
            
            {/* Remove Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
              <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">
                Click to Change
              </span>
              <button
                onClick={handleRemove}
                className="bg-white text-ft-danger p-2 rounded-full hover:bg-red-50 transition shadow-lg transform hover:scale-110"
                title="Remove image"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-400 p-4 text-center">
            <div className="p-3 bg-white rounded-full shadow-sm ring-1 ring-gray-100 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud size={24} className="text-ft-primary-blue" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-600 group-hover:text-ft-primary-blue transition-colors">
                Click to upload cover
              </span>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide font-medium">
                JPG, PNG, WEBP (Max 5MB)
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};