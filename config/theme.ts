import { type HeroUIPluginConfig } from "@heroui/react";
import { CustomThemeConfig } from "tailwindcss/types/config";
import { ResponsiveStylingConfig } from "@/plugins/responsiveStyling";

export const uiThemeConfig = {
  prefix: "fintech",
  addCommonColors: false,
  defaultTheme: "light",
  defaultExtendTheme: "light",
  themes: {
    light: {
      colors: {
        ft: {
          background: {
            DEFAULT: "#F9FAFB",
            popup: "#979797",
          },
          text: {
            dark: "#000000",
            bright: "#EBEBEB",
          },
          primary: {
            yellow: {
              50: "#DCB968", // primary
              100: "#A28436",
              200: "#F7D27F",
              300: "#FFEFCA",
              DEFAULT: "#DCB968",
            },
            blue: {
              50: "#2C305F", // primary
              100: "#0D1742",
              200: "#5E5E92",
              300: "#F0EDFF",
              DEFAULT: "#2C305F",
            },
          },
          secondary: {
            yellow: "#F8DA92",
            blue: "#97ABD6",
          },

          // Semantic colors
          success: "#60D681",
          info: "#97ABD6",
          warning: "#F8DA92",
          danger: "#BB2649",

          supporting: {
            red: "#BB2649",
            pink: "#EDCDC2",
            lightpink: "#D4CACD",
          },
        },
      },
      layout: {
        radius: {
          small: "0.25rem",
          medium: "0.5rem",
          large: "1rem",
        },
      },
    },
  },
} as HeroUIPluginConfig;

export const tailwindExtendedThemeConfig: Partial<CustomThemeConfig> = {
  spacing: {
    "side-margin-mobile": "1rem",
    "side-margin": "8.375rem",
  },
  // fontFamily: {
  //     sans: ['Poppins', 'system-ui', 'sans-serif'],
  // },
};

export const stylingConfig = {
  default: {
    fontSize: {
      "ft-heading-1": ["2.5rem", { lineHeight: "3rem", fontWeight: "600" }],
      "ft-heading-2": ["2rem", { lineHeight: "2.5rem", fontWeight: "600" }],
      "ft-heading-3": ["1.75rem", { lineHeight: "2.25rem", fontWeight: "600" }],
      "ft-heading-4": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
      "ft-heading-5": [
        "1.375rem",
        { lineHeight: "1.75rem", fontWeight: "600" },
      ],
      "ft-heading-6": [
        "1.25rem",
        { lineHeight: "1.625rem", fontWeight: "600" },
      ],
      "ft-subtitle-1": [
        "1.25rem",
        { lineHeight: "1.625rem", fontWeight: "600" },
      ],
      "ft-subtitle-2": [
        "1.125rem",
        { lineHeight: "1.5rem", fontWeight: "500" },
      ],
      "ft-body-1": ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
      "ft-body-2": ["0.875rem", { lineHeight: "1.375rem", fontWeight: "400" }],
    },
  },
  md: {
    fontSize: {
      "ft-heading-1": ["3rem", { lineHeight: "3.5rem", fontWeight: "700" }],
      "ft-heading-2": ["2.5rem", { lineHeight: "3rem", fontWeight: "600" }],
      "ft-heading-3": ["2.25rem", { lineHeight: "2.75rem", fontWeight: "600" }],
      "ft-heading-4": ["2rem", { lineHeight: "2.5rem", fontWeight: "600" }],
      "ft-heading-5": ["1.75rem", { lineHeight: "2.25rem", fontWeight: "600" }],
      "ft-heading-6": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
      "ft-subtitle-1": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
      "ft-subtitle-2": [
        "1.375rem",
        { lineHeight: "1.75rem", fontWeight: "500" },
      ],
      "ft-body-1": ["1.125rem", { lineHeight: "1.75rem", fontWeight: "400" }],
      "ft-body-2": ["1rem", { lineHeight: "1.5rem", fontWeight: "400" }],
    },
  },
  lg: {
    fontSize: {
      "ft-heading-1": ["3.5rem", { lineHeight: "4rem", fontWeight: "700" }],
      "ft-heading-2": ["3rem", { lineHeight: "3.5rem", fontWeight: "600" }],
      "ft-heading-3": ["2.75rem", { lineHeight: "3.25rem", fontWeight: "600" }],
      "ft-heading-4": ["2.5rem", { lineHeight: "3rem", fontWeight: "600" }],
      "ft-heading-5": ["2.25rem", { lineHeight: "2.75rem", fontWeight: "600" }],
      "ft-heading-6": ["2rem", { lineHeight: "2.5rem", fontWeight: "600" }],
      "ft-subtitle-1": ["2rem", { lineHeight: "2.5rem", fontWeight: "600" }],
      "ft-subtitle-2": [
        "1.75rem",
        { lineHeight: "2.25rem", fontWeight: "500" },
      ],
      "ft-body-1": ["1.25rem", { lineHeight: "2rem", fontWeight: "400" }],
      "ft-body-2": ["1.125rem", { lineHeight: "1.75rem", fontWeight: "400" }],
    },
  },
} as ResponsiveStylingConfig;
