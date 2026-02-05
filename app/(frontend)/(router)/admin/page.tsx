"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Star,
  FileText,
  Podcast,
  Video,
  Presentation,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";

// --- Configuration Data ---
const dashboardItems = [
  {
    title: "EBMB",
    icon: Users,
    href: "/admin/ebmb",
  },
  {
    title: "Hall of Fame",
    icon: Star,
    href: "/admin/hall-of-fame",
  },
  {
    title: "Article",
    icon: FileText,
    href: "/admin/articles",
  },
  {
    title: "Podcast",
    icon: Podcast,
    href: "/admin/podcasts",
  },
  {
    title: "FinTech 101",
    icon: Video,
    href: "/admin/fintech101",
  },
  {
    title: "Project",
    icon: Presentation,
    href: "/admin/projects",
  },
  {
    title: "Event",
    icon: CalendarDays,
    href: "/admin/events",
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

export default function AdminDashboard() {
  return (
    <div className="min-h-[calc(100vh-8vh)] bg-gray-50/50 p-6 md:p-10">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-ft-primary-blue rounded-lg shadow-md">
            <LayoutDashboard className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Dashboard Overview
          </h1>
        </div>
      </div>

      {/* Grid Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {dashboardItems.map((item, index) => (
          <motion.div key={index} variants={itemVariants} className="h-full">
            <Link href={item.href} className="block h-full group outline-none">
              <div className="h-full flex flex-col bg-[#F3F4FE] border border-indigo-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ft-primary-blue">
                
                {/* Card Header (Dark Blue) */}
                <div className="bg-[#2A2A5B] py-4 px-4 text-center relative overflow-hidden">
                   {/* Subtle shine effect on hover */}
                   <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <h3 className="text-white font-bold text-lg tracking-wide uppercase group-hover:text-ft-primary-yellow transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Card Body (Light Purple/Blue) */}
                <div className="flex-grow flex flex-col items-center justify-center py-10 px-6 gap-4 relative">
                  
                  {/* Icon Container with Scale Effect */}
                  <div className="bg-white p-4 rounded-full shadow-sm ring-1 ring-indigo-50 group-hover:scale-110 transition-transform duration-300 ease-out">
                    <item.icon 
                        size={48} 
                        className="text-[#EAB308] stroke-[1.5px]" // Gold color
                    />
                  </div>
                </div>

                {/* Optional: Bottom interaction hint */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#EAB308] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}