import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#1B6DB3",
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#5B9CD4",
          500: "#1B6DB3",
          600: "#155EA0",
          700: "#0F4A80",
          800: "#0A3660",
          900: "#062040",
          950: "#031020",
        },
        navy: {
          DEFAULT: "#0B1F3A",
          50: "#f0f4f9",
          100: "#dce6f1",
          200: "#c0d1e7",
          300: "#94b3d5",
          400: "#628dbf",
          500: "#406fa9",
          600: "#2e578f",
          700: "#264674",
          800: "#233c61",
          900: "#1b2e4a",
          950: "#0B1F3A",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      spacing: {
        // 8px grid
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      boxShadow: {
        card: "0 2px 8px 0 rgba(11,31,58,0.07), 0 1px 2px 0 rgba(11,31,58,0.05)",
        "card-hover":
          "0 16px 48px 0 rgba(11,31,58,0.14), 0 4px 12px 0 rgba(11,31,58,0.08)",
        teal: "0 4px 20px 0 rgba(27,109,179,0.35)",
      },
      backgroundImage: {
        "grain":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
