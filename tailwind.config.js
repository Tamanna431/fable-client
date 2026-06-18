import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
      backgroundImage: {
        "purple-gradient": "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6366f1 100%)",
        "dark-gradient": "linear-gradient(180deg, #0f0a1e 0%, #1a1035 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(99,102,241,0.05) 100%)",
        "hero-gradient": "linear-gradient(135deg, #0f0a1e 0%, #1a0533 40%, #0f0a1e 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shimmer": "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          from: { boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)" },
          to: { boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#7c3aed",
              foreground: "#ffffff",
              50: "#f5f3ff",
              100: "#ede9fe",
              200: "#ddd6fe",
              300: "#c4b5fd",
              400: "#a78bfa",
              500: "#8b5cf6",
              600: "#7c3aed",
              700: "#6d28d9",
              800: "#5b21b6",
              900: "#4c1d95",
            },
            secondary: {
              DEFAULT: "#a855f7",
              foreground: "#ffffff",
            },
            background: "#0f0a1e",
            foreground: "#f8fafc",
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: "#7c3aed",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#a855f7",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};

export default config;
