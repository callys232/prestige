/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  darkMode: "class", // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        prestige1: "#3B82F6", // blue-500
        prestige2: "#2563EB", // blue-600
        prestige3: "#1D4ED8", // blue-700
        prestigeTeal: "#7CC2BA",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-1px, 1px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(1px, -1px)" },
        },
        glow: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "50%": { transform: "translateX(50%)", opacity: 0.5 },
          "100%": { transform: "translateX(100%)", opacity: 0 },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        ctaglitch: {
          "0%": { transform: "translate(0)" },
          "15%": { transform: "translate(-2px, 1px)" },
          "30%": { transform: "translate(2px, -1px)" },
          "45%": { transform: "translate(-1px, 2px)" },
          "60%": { transform: "translate(1px, -2px)" },
          "75%": { transform: "translate(-2px, 2px)" },
          "100%": { transform: "translate(0)" },
        },
      },
      animation: {
        glitch: "glitch 1s infinite linear",
        "glitch-delay": "glitch 1s infinite linear 0.2s",
        "glitch-1": "glitch 1s infinite",
        "glitch-2": "glitch 1s infinite 0.25s",
        "glitch-3": "glitch 1s infinite 0.4s",
        glow: "glow 1.2s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease-out forwards",
        ctaglitch: "glitch 0.6s infinite",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
