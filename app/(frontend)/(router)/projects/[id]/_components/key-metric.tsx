"use client";

import { Card, CardBody } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { useCountUp } from "react-countup";
import SectionTitle from "./SectionTitle";
import { Metric } from "./types";
import { Icon } from "./icon-map"; // <-- Dùng icon-map

// --- Prop Types ---
type KeyMetricProps = {
  key_metrics: Metric[]; // Nhận type từ API (icon là string)
  title?: string;
};

// --- Animated Count Component ---
function AnimatedCount({
  value,
  prefix,
  suffix,
  shouldStart,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  shouldStart: boolean;
}) {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const { start } = useCountUp({
    ref: spanRef,
    end: value,
    duration: 5,
    prefix: prefix ?? "",
    suffix: suffix ?? "",
  });

  useEffect(() => {
    if (shouldStart) {
      start();
    }
  }, [shouldStart, start]);

  return <span ref={spanRef} />;
}

// --- Main KeyMetric Component ---
export default function KeyMetric({
  key_metrics = [],
  title = "Key Metrics",
}: KeyMetricProps) {
  // --- Hooks for animation trigger ---
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const onFirstScroll = () => {
      setHasUserScrolled(true);
      window.removeEventListener("scroll", onFirstScroll);
      window.removeEventListener("wheel", onFirstScroll);
      window.removeEventListener("touchmove", onFirstScroll);
    };
    window.addEventListener("scroll", onFirstScroll, { passive: true });
    window.addEventListener("wheel", onFirstScroll, { passive: true });
    window.addEventListener("touchmove", onFirstScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onFirstScroll);
      window.removeEventListener("wheel", onFirstScroll);
      window.removeEventListener("touchmove", onFirstScroll);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasUserScrolled) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { root: null, threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasUserScrolled]);

  const shouldStart = isInView;

  if (!key_metrics || key_metrics.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle>{title}</SectionTitle>
        <div className="flex flex-wrap justify-center gap-6">
          {key_metrics.map((metric, index) => {
            return (
              <div
                key={index}
                className="w-full sm:w-[45%] md:w-[40%] lg:w-[22%] max-w-xs"
              >
                <Card className="h-full bg-white rounded-xl shadow-md border-t-4 border-[#2C305F] transition-transform hover:scale-105">
                  <CardBody className="flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <div className="p-3 rounded-full bg-[#DBB968] text-[#2C305F]">
                      {/* Dùng <Icon /> để "biên dịch" string */}
                      <Icon
                        name={metric.icon}
                        className="w-6 h-6 text-[#2C305F] md:w-8 md:h-8"
                      />
                    </div>
                    <div>
                      <p className="text-[#2C305F] lg:text-4xl md:text-3xl text-2xl font-bold">
                        <AnimatedCount
                          value={metric.value}
                          prefix={metric.prefix}
                          suffix={metric.suffix}
                          shouldStart={shouldStart}
                        />
                      </p>
                      <h4 className="font-semibold text-base text-gray-600 mt-1">
                        {metric.label}
                      </h4>
                    </div>
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}