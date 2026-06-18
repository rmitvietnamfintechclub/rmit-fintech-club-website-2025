"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Project } from "../../types";
import ProjectCarousel from "./ProjectCarousel";
import { ExternalLink, Rocket } from "lucide-react";
import { Button } from "@heroui/react";

type Props = {
  label: string;
  items: Project[];
};

export default function DeptSection({ label, items }: Props) {
  if (!items || items.length === 0) {
    return (
      <section className="w-full lg:w-[calc(100vw-240px)] h-[60vh] lg:h-[90vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#DBB968] blur-xl opacity-20 rounded-full animate-pulse" />
          <Rocket size={54} className="text-[#2C305F] relative z-10 lg:scale-125" />
        </div>

        <div className="max-w-md space-y-2">
          <h3 className="text-xl md:text-2xl font-bold text-[#2C305F]">
            Something exciting is brewing!
          </h3>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            The <span className="font-semibold text-[#DBB968]">{label}</span>{" "}
            department is working hard on upcoming projects. Stay tuned for
            updates!
          </p>
        </div>
      </section>
    );
  }

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      setActiveProjectId(items[0].id);
    }
  }, [items]);

  const activeProject = useMemo(
    () => items.find((p) => p.id === activeProjectId),
    [items, activeProjectId],
  );

  return (
    <section className="relative w-full max-w-[1400px] min-w-[74.5vw] mx-auto flex flex-col h-full">
      {/* Background Decoration */}
      <div
        className="bg-[#2C305F] h-12 w-64 absolute hidden lg:block top-16 -left-10 z-0 opacity-90"
        style={{ clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)" }}
      />

      <div className="relative z-10 mb-6 lg:mb-8">
        <header className="flex flex-col gap-1 lg:gap-2 mb-2 lg:mb-4">
          <h1 className="leading-tight text-2xl md:text-4xl lg:text-5xl">
            <span className="font-light text-gray-800">Visit </span>
            <span className="font-extrabold tracking-wide text-[#DBB968]">
              {label}
            </span>
            <span className="font-light text-gray-800"> department</span>
          </h1>
          <h2 className="text-right font-bold text-[#2C305F] text-xl md:text-3xl lg:text-4xl">
            Ongoing Projects
          </h2>
        </header>
      </div>

      {/* DYNAMIC PROJECT DESCRIPTION AREA */}
      <div className="relative z-10 flex-1 flex flex-col gap-6">
        {/* Detail View Box - Tối ưu hóa thu gọn chiều cao trên Mobile */}
        <div className="bg-gray-50 rounded-2xl p-5 md:p-8 border border-gray-100 shadow-inner min-h-fit lg:min-h-[310px] transition-all duration-300">
          {activeProject && (
            <div
              key={activeProject.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col md:flex-row gap-5 md:items-start justify-between"
            >
              <div className="flex-1 space-y-2.5 lg:space-y-3">
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {activeProject.labels.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#DBB968]/20 text-[#856b2a] text-[10px] lg:text-[11px] font-bold uppercase tracking-wider rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl md:text-3xl font-bold text-[#2C305F] leading-tight">
                  {activeProject.title}
                </h3>

                <p className="text-sm lg:text-base text-gray-600 leading-relaxed text-justify md:text-left">
                  {activeProject.description}
                </p>
              </div>

              {activeProject.link && activeProject.link !== "#" && (
                <div className="shrink-0 pt-2 md:pt-1 flex justify-end">
                  <Button
                    as="a"
                    href={activeProject.link}
                    target="_blank"
                    size="sm"
                    className="bg-[#2C305F] text-white font-semibold shadow-md hover:bg-[#2C305F]/90 hover:shadow-lg transition-all text-xs lg:text-sm h-10 px-4 rounded-xl"
                    endContent={<ExternalLink size={14} />}
                  >
                    Explore Project
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Carousel Selector (Bottom) */}
        <div className="w-full">
          <ProjectCarousel
            items={items}
            activeId={activeProjectId}
            onSelect={setActiveProjectId}
          />
        </div>
      </div>
    </section>
  );
}