import "@styles/globals.css";
import Navbar from "@/components/navbar";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import clsx from "clsx";
import type { Metadata, Viewport } from "next";
import { Providers } from "../providers";
import FooterWrapper from "./footer-wrapper";

export const metadata: Metadata = {
  title: {
    default: "RMIT Vietnam FinTech Club",
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "https://d2uq10394z5icp.cloudfront.net/global/FTC-TabLogo.png",
    shortcut: "https://d2uq10394z5icp.cloudfront.net/global/FTC-TabLogo.png",
    apple: "https://d2uq10394z5icp.cloudfront.net/global/FTC-TabLogo.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
    { media: "(prefers-color-scheme: tokyo)", color: "red" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="overflow-x-hidden" lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          "min-h-screen bg-[#F9FAFB] font-sans antialiased overflow-x-hidden",
          fontSans.className
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="flex-grow overflow-x-clip">{children}</main>
            <FooterWrapper />
          </div>
        </Providers>
      </body>
    </html>
  );
}