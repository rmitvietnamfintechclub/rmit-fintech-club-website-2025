import { Poppins as FontSans, Fira_Code as FontMono } from "next/font/google";

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
