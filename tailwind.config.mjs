/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        prestige1: "#3B82F6", // blue-500
        prestige2: "#2563EB", // blue-600
        prestige3: "#1D4ED8", // blue-700
        prestigeTeal: "#7CC2BA", // custom teal
      },
      animation: {
        ctaglitch: "ctaglitch 0.6s infinite",
        glitch1: "glitch1 0.8s infinite",
        glitch2: "glitch2 0.8s infinite",
        glow: "glow 1.2s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease-out forwards",
        fadeUp: "fadeUp 0.6s ease-out forwards",
        slideDown: "slideDown 0.3s ease-out forwards",
        shadowPulse: "shadowPulse 0.6s ease-in-out",
        pop: "pop 0.4s ease-out forwards",
      },
      keyframes: {
        glow: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "50%": { transform: "translateX(50%)", opacity: 0.5 },
          "100%": { transform: "translateX(100%)", opacity: 0 },
        },

    shadowPulse: {
      "0%": { boxShadow: "0 0 0 rgba(0,0,0,0)" },
      "50%": { boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
      "100%": { boxShadow: "0 0 0 rgba(0,0,0,0)" },
    },
          slideDown: {
      "0%": { transform: "translateY(-10px)", opacity: 0 },
      "100%": { transform: "translateY(0)", opacity: 1 },
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
        glitch1: {
          "0%": { transform: "translate(0)" },
          "25%": { transform: "translate(-1px, 1px)" },
          "50%": { transform: "translate(1px, -1px)" },
          "75%": { transform: "translate(-1px, -1px)" },
          "100%": { transform: "translate(0)" },
        },
        glitch2: {
          "0%": { transform: "translate(0)" },
          "25%": { transform: "translate(1px, 1px)" },
          "50%": { transform: "translate(-1px, -1px)" },
          "75%": { transform: "translate(1px, -1px)" },
          "100%": { transform: "translate(0)" },
        },
         fadeUp: {
      "0%": { opacity: 0, transform: "translateY(20px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
         },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
