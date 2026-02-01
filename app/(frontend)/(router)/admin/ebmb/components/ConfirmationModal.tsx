import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Spinner } from "@heroui/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: React.ReactNode; 
  isLoading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  isLoading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-2">
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-12 w-12 text-ft-danger" />
          </div>
          
          <h3 className="text-lg font-bold text-ft-danger mb-2">
            {title}
          </h3>
          
          <div className="text-sm text-gray-500 mb-6">
            {description}
          </div>

          <div className="flex gap-3 justify-center">
             <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-ft-danger border border-transparent rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
            >
              {isLoading && <Spinner color="white" size="sm" />}
              {isLoading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};