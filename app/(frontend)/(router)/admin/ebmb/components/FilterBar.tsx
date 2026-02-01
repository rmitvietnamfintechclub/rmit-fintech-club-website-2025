import React from "react";
import { Users, Layers, Filter } from "lucide-react";
import { BoardType } from "../types"; // Đảm bảo bạn đã tạo file types.ts như hướng dẫn trước

interface FilterBarProps {
  activeTab: BoardType;
  setActiveTab: (tab: BoardType) => void;
  selectedGen: number;
  setSelectedGen: (gen: number) => void;
  availableGens?: number[]; // Optional: Để sau này dễ dàng thêm Gen 7, 8...
}

export const FilterBar = ({
  activeTab,
  setActiveTab,
  selectedGen,
  setSelectedGen,
  availableGens = [], 
}: FilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8">
      
      {/* --- Tab Switcher (EB vs MB) --- */}
      <div className="flex bg-gray-100/80 p-1.5 rounded-xl w-full sm:w-auto">
        <button
          onClick={() => setActiveTab("EB")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
            activeTab === "EB"
              ? "bg-ft-primary-yellow text-ft-primary-blue shadow-sm ring-1 ring-black/5"
              : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <Users size={18} /> 
          <span>Executive Board</span>
        </button>
        <button
          onClick={() => setActiveTab("MB")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
            activeTab === "MB"
              ? "bg-ft-primary-yellow text-ft-primary-blue shadow-sm ring-1 ring-black/5"
              : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <Layers size={18} /> 
          <span>Management Board</span>
        </button>
      </div>

      {/* --- Generation Filter --- */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm font-medium whitespace-nowrap">
          <Filter size={16} /> Filter by:
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={selectedGen}
            onChange={(e) => setSelectedGen(Number(e.target.value))}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-ft-primary-yellow/50 focus:border-ft-primary-yellow block w-full p-2.5 pr-8 outline-none font-bold transition-all cursor-pointer hover:bg-gray-100"
          >
            {availableGens.map((gen) => (
              <option key={gen} value={gen}>
                Generation {gen}
              </option>
            ))}
          </select>
          {/* Custom Chevron Icon absolute positioning */}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
};