"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { CircularProgress } from "@mui/material";

// --- Type Imports ---
// Import the component-specific prop types
import {
  Project,
  Leader as TeamStructureLeader, // Rename to avoid conflict
  Product,
  Guest,
} from "./_components/types";

// --- Component Imports ---
import Hero from "./_components/hero";
import CompanyHighlight from "./_components/company-highlight";
import CompetitionDetails from "./_components/competition-details";
import Goal from "./_components/goal";
import Scope from "./_components/scope";
import TeamStructure from "./_components/team-structure";
import Timeline from "./_components/timeline";
import Gallery from "./_components/gallery";
import FeaturedActivities from "./_components/featured-activities";
import GuestCarousel from "./_components/guest-carousel";
import KeyMetric from "./_components/key-metric";
import Partners from "./_components/partners";
import ProductCta from "./_components/product-cta";
import ProductCarousel from "./_components/product-carousel";
import TargetAudience from "./_components/target-audience";
import CompetitionCta from "./_components/competition-cta";

// --- Main Page Component ---
export default function ProjectDetail() {
  // --- State ---
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = params.id as string;

  // --- Fetch data ---
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<{ data: Project }>(
          `/api/v1/projects/${id}`
        );
        setProject(response.data.data);
      } catch (err) {
        console.error("Failed to fetch project details:", err);
        setError("Failed to fetch project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // --- Ánh xạ (Mapping) dữ liệu ---
  const mappedData = useMemo(() => {
    if (!project) return null;

    // 1. Map Project Leaders (API -> Component Prop) - [FIXED]
    const mappedLeaders: TeamStructureLeader[] = // <-- Changed to array
      project.project_leader?.map((leader) => ({
        name: leader.name,
        avatarUrl: leader.avatar_url, // Maps snake_case to camelCase
        role: leader.position || "Project Leader",
        linkedinUrl: leader.linkedin_url, // Maps snake_case to camelCase
      })) || []; // Default to empty array

    // 2. Map Products (API -> Component Prop)
    const mappedProducts: Product[] =
      project.products?.map((item) => ({
        id: item.product._id,
        title: item.product.title,
        image: item.product.illustration_url || item.product.thumbnail_url,
        publicationDate: item.product.publicationDate,
      })) || [];

    // 3. Map Guest Speakers (API -> Component Prop)
    const mappedGuests: Guest[] =
      project.guest_speakers?.map((guest, index) => ({
        id: guest._id || index,
        name: guest.name,
        position: guest.position,
        avatar_url: guest.avatar_url,
      })) || [];

    return {
      mappedLeaders, // <-- Pass the new array
      mappedProducts,
      mappedGuests,
    };
  }, [project]);

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-screen">
        <CircularProgress sx={{ color: "#DCB968" }} />
        <p className="mt-4 text-lg text-[#5E5E92]">Loading</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-[87vw] h-48 mx-auto my-10 md:h-64 p-[4px] rounded-lg bg-gradient-to-b from-[#DCB968] to-[#F7D27F]">
        <div className="flex flex-col items-center justify-center w-full h-full bg-[#F9FAFB] rounded-[7px] text-center px-4">
          <p className="text-5xl font-bold mb-4">⚠️</p>
          <p className="text-[#2C305F] text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (!project || !mappedData) {
    return null;
  }

  // --- Render ---
  return (
    <div>
      <Hero
        title={project.title}
        description={project.description}
        image_url={project.image_url}
        labels={project.labels}
        status={project.status}
        detailsUrl={project.details_link}
      />

      {project.company && <CompanyHighlight company={project.company} />}

      {project.theme && (
        <CompetitionDetails
          duration={project.duration!}
          platformLocation={project.platformLocation!}
          theme={project.theme}
        />
      )}

      {project.goals && project.goals.length > 0 && (
        <Goal goals={project.goals} />
      )}

      {project.scope && project.scope.length > 0 && (
        <Scope scope={project.scope} />
      )}

      {project.target_audience && project.target_audience.length > 0 && (
        <TargetAudience target_audience={project.target_audience} />
      )}

      {project.featured_activities &&
        project.featured_activities.length > 0 && (
          <FeaturedActivities
            featured_activities={project.featured_activities}
          />
        )}

      {project.partners && project.partners.length > 0 && (
        <Partners partners={project.partners} carouselThreshold={10} />
      )}

      {mappedData.mappedGuests.length > 0 && (
        <GuestCarousel guest_speakers={mappedData.mappedGuests} />
      )}

      {/* Check array length and pass the array */}
      {mappedData.mappedLeaders.length > 0 && project.team_structure && (
        <TeamStructure
          leaders={mappedData.mappedLeaders}
          teams={project.team_structure}
        />
      )}

      {project.timeline && project.timeline.length > 0 && (
        <Timeline timeline={project.timeline} />
      )}

      {project.key_metrics && project.key_metrics.length > 0 && (
        <KeyMetric key_metrics={project.key_metrics} />
      )}

      {project.gallery && project.gallery.length > 0 && (
        <Gallery gallery={project.gallery} imagesPerPage={6} />
      )}

      {mappedData.mappedProducts.length > 0 && (
        <ProductCarousel
          products={mappedData.mappedProducts}
          exploreLink={
            project.products?.[0]?.onModel &&
            `/media/${project.products[0].onModel.toLowerCase()}`
          }
        />
      )}

      {project.product_link && <ProductCta productUrl={project.product_link} />}

      {project.details_link && <CompetitionCta detailsUrl={project.details_link} />}
    </div>
  );
}
