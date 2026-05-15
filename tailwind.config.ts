import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Drapeau RDC
        rdc: {
          blue: {
            50: "#eef7ff",
            100: "#d9edff",
            200: "#bce0ff",
            300: "#8eccff",
            400: "#53b0ff",
            500: "#1a8cff",
            600: "#0070f0",
            700: "#0059cc",
            800: "#0048a8",
            900: "#003d8a",
            950: "#00275a",
          },
          yellow: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#e8b800",
            600: "#c99400",
            700: "#a06c00",
            800: "#845400",
            900: "#6e4400",
            950: "#402400",
          },
          red: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ce1020",
            600: "#b00e1c",
            700: "#930b17",
            800: "#7a0913",
            900: "#640710",
            950: "#38040a",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"],
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(135deg, #00275a 0%, #0059cc 50%, #1a8cff 100%)",
        "cta-gradient":
          "linear-gradient(135deg, #ce1020 0%, #e8b800 50%, #ce1020 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(232, 184, 0, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(232, 184, 0, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
