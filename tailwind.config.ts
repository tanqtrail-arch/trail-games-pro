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
          primary: "#16A34A",   // フレッシュグリーン — メインカラー
          secondary: "#FACC15", // ひまわりイエロー — CTA・強調
          accent: "#38BDF8",    // そらいろ — 補助・ハイライト
          success: "#4ADE80",   // 若葉ライトグリーン — 成功・成長
          danger: "#F87171",    // コーラルレッド — 警告
          dark: "#1E293B",      // スレートダーク — テキスト
          light: "#F8FAF8",     // ほんのりグリーンホワイト — 背景
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(2deg)" },
          "66%": { transform: "translateY(6px) rotate(-1deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        /* Diagonal drift for variety – moves on both axes */
        "float-drift": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(8px, -14px) rotate(3deg)" },
          "50%": { transform: "translate(-6px, -8px) rotate(-2deg)" },
          "75%": { transform: "translate(4px, 6px) rotate(1deg)" },
        },
        /* Organic morph for aurora blobs – scale + translate */
        "aurora-morph": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" },
          "25%": { transform: "translate(30px, -20px) scale(1.05)", borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { transform: "translate(-20px, 15px) scale(0.95)", borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "75%": { transform: "translate(15px, 10px) scale(1.02)", borderRadius: "50% 40% 60% 50% / 30% 70% 40% 60%" },
        },
        /* Slow rotation for decorative elements */
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        /* Twinkle/sparkle for star-like elements */
        "twinkle": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "scroll-down": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "75%": { opacity: "0.4", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "ripple": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "fade-in-left": "fade-in-left 0.7s ease-out forwards",
        "fade-in-right": "fade-in-right 0.7s ease-out forwards",
        "fade-in-scale": "fade-in-scale 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-drift": "float-drift 10s ease-in-out infinite",
        "aurora-morph": "aurora-morph 15s ease-in-out infinite",
        "spin-slow": "spin-slow 30s linear infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "scroll-down": "scroll-down 2s ease-in-out infinite",
        "marquee": "marquee 25s linear infinite",
        "ripple": "ripple 1.5s ease-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
