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
        trail: {
          primary: "#2563EB",
          secondary: "#7C3AED",
          accent: "#F59E0B",
          success: "#10B981",
          danger: "#EF4444",
          dark: "#1E293B",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
