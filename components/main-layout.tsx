"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar"; 
import AdminNavbar from "@/components/admin-navbar"; 
import FooterWrapper from "../app/(frontend)/footer-wrapper"; 
import { UserPayload } from "@/app/(backend)/libs/auth";
import { useRef } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  user: UserPayload | null;
}

export default function MainLayout({ children, isLoggedIn, user }: MainLayoutProps) {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const disableLayoutRoutes = ["/login"];
  const shouldHideLayout = disableLayoutRoutes.includes(pathname);

  const renderNavbar = () => {
    if (shouldHideLayout) return null;
    
    if (isLoggedIn && user) return <AdminNavbar user={user} scrollContainerRef={scrollContainerRef} />;
    
    return <Navbar scrollContainerRef={scrollContainerRef} />;
  };

  return (
    <div
      ref={scrollContainerRef}
      className="relative flex flex-col h-screen overflow-y-auto max-w-[100vw] overflow-x-clip"
    >
      {renderNavbar()}
      
      <main className="flex-grow overflow-x-clip pt-[8vh]">
        {children}
      </main>
      
      {!shouldHideLayout && !isLoggedIn && <FooterWrapper />}
    </div>
  );
}
