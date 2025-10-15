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
        blue: {
          950: "#06283D",
        },
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
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
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
        popScale: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        floatY: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "pop-up": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slow-float": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "tooltip-pop": {
          "0%": { opacity: "0", transform: "translateY(4px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        ctaglitch: "ctaglitch 0.6s infinite",
        "tooltip-pop": "tooltip-pop 180ms cubic-bezier(.2,.8,.2,1) forwards",
        glitch1: "glitch1 0.8s infinite",
        glitch2: "glitch2 0.8s infinite",
        glow: "glow 1.2s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease-out forwards",
        fadeUp: "fadeUp 0.6s ease-out forwards",
        slideDown: "slideDown 0.3s ease-out forwards",
        shadowPulse: "shadowPulse 0.6s ease-in-out",
        pop: "popScale 0.4s ease-out forwards",
        fadeInUp: "fadeUp 0.8s ease-out forwards",
        "fade-in-up": "fadeUp 220ms cubic-bezier(.2,.8,.2,1) both",
        "pop-scale": "popScale 180ms cubic-bezier(.2,.8,.2,1) both",
        "float-y": "floatY 4s ease-in-out infinite",
        "pop-up": "pop-up 200ms cubic-bezier(.2,.8,.2,1)",
        "fade-in": "fade-in 200ms ease-out",
        "slow-float": "slow-float 4s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        poppins: ["Poppins", "sans-serif"],
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  plugins: [],
};
