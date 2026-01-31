"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar"; 
import AdminNavbar from "@/components/admin-navbar"; 
import FooterWrapper from "../app/(frontend)/footer-wrapper"; 
import { UserPayload } from "@/app/(backend)/libs/auth";

interface MainLayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  user: UserPayload | null;
}

export default function MainLayout({ children, isLoggedIn, user }: MainLayoutProps) {
  const pathname = usePathname();

  const disableLayoutRoutes = ["/login"];
  const shouldHideLayout = disableLayoutRoutes.includes(pathname);

  const renderNavbar = () => {
    if (shouldHideLayout) return null;
    
    if (isLoggedIn && user) return <AdminNavbar user={user} />;
    
    return <Navbar />;
  };

  return (
    <div className="relative flex flex-col h-screen">
      {renderNavbar()}
      
      <main className="flex-grow overflow-x-clip">
        {children}
      </main>
      
      {!shouldHideLayout && !isLoggedIn && <FooterWrapper />}
    </div>
  );
}