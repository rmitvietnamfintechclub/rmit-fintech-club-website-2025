import React from "react";
import Image from "next/image";
import { Edit, Trash2, Linkedin } from "lucide-react";
import { Member } from "../types";

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export const MemberCard = ({ member, onEdit, onDelete }: MemberCardProps) => {
  return (
    <div className="group relative flex flex-col items-center bg-white border-2 border-ft-primary-yellow rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Action Buttons (Admin only) */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button 
          onClick={() => onEdit(member)}
          className="p-1.5 bg-gray-100 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => onDelete(member._id)}
          className="p-1.5 bg-gray-100 hover:bg-red-100 text-red-600 rounded-full transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Image Area */}
      <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-ft-primary-yellow/20">
        <Image
          src={member.photo_url}
          alt={member.name}
          fill
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="text-center w-full">
        <h3 className="text-lg font-bold text-ft-primary-blue truncate">
          {member.name}
        </h3>
        <p className="text-sm text-gray-500 font-medium mb-3">
          {member.position}
        </p>

        {/* Footer with LinkedIn */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2 w-full">
            <span className="text-xs font-bold text-ft-primary-yellow bg-ft-primary-yellow/10 px-2 py-1 rounded-md">
                Gen {member.generation}
            </span>
            
            {member.linkedin_url && (
                <a 
                    href={member.linkedin_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-gray-400 hover:text-[#0077b5] transition-colors"
                >
                    <Linkedin size={20} />
                </a>
            )}
        </div>
      </div>
    </div>
  );
};