import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";
import {
  uiThemeConfig,
  stylingConfig,
  tailwindExtendedThemeConfig,
} from "./config/theme";
import responsiveStyling, {
  orientationPlugin,
} from "./plugins/responsiveStyling";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: tailwindExtendedThemeConfig,
    animation: {
      scroll: "scroll 20s linear infinite",
    },
    keyframes: {
      scroll: {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-50%)" },
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      bluePrimary: "#2C305F",
      blueMidnight: "#0D1742",
      blueSlate: "#5E5E92",
      blueMist: "#F0EDFF",
      blueSoft: "#97ABD6",
      yellowPrimary: "#DCB968",
      yellowEarth: "#A28436",
      yellowSand: "#F7D27F",
      yellowCream: "#FFEFCA",
      yellowGlow: "#F8DA92",
    }
  },
  darkMode: ["class", "class"],
  plugins: [
    heroui(uiThemeConfig),
    responsiveStyling(stylingConfig),
    orientationPlugin,
  ],
};

export default config;
