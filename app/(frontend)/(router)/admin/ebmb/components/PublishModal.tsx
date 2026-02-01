import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Globe } from "lucide-react";
import { Spinner } from "@heroui/react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gen: number) => Promise<void>;
  availableGens: number[];
  currentPublicGen: number; 
  isLoading: boolean;
}

export const PublishModal = ({
  isOpen,
  onClose,
  onSave,
  availableGens,
  currentPublicGen,
  isLoading,
}: PublishModalProps) => {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (isOpen) {
      setValue("generation", currentPublicGen);
    }
  }, [isOpen, currentPublicGen, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Globe size={18} className="text-ft-primary-blue" />
            Website Display
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => onSave(Number(data.generation)))} className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Select which generation will be visible on the public website.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Public Generation
            </label>
            <select
              {...register("generation")}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ft-primary-yellow outline-none font-medium bg-white"
            >
              {availableGens.map((gen) => (
                <option key={gen} value={gen}>
                  Generation {gen} {gen === currentPublicGen ? "(Current)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-ft-primary-blue text-white font-bold rounded-lg hover:brightness-110 flex items-center gap-2"
            >
              {isLoading && <Spinner color="white" size="sm" />}
              Save Changes
            </button>
             <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};