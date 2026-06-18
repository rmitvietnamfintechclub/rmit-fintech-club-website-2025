"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import FooterNoRounded from "@/components/footerNoRounded";

export default function FooterWrapper() {
  const pathname = usePathname();
  const isFooterNoRoundedPage = pathname === "/media";

  return isFooterNoRoundedPage ? <FooterNoRounded /> : <Footer />;
}
