"use client"; // Bắt buộc phải có dòng này

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import FooterWrapper from "../app/(frontend)/footer-wrapper"; 

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const disableLayoutRoutes = ["/login"];
  
  const shouldShowLayout = !disableLayoutRoutes.includes(pathname);

  return (
    <div className="relative flex flex-col h-screen">
      {shouldShowLayout && <Navbar />}
      
      <main className="flex-grow overflow-x-clip">
        {children}
      </main>
      
      {shouldShowLayout && <FooterWrapper />}
    </div>
  );
}