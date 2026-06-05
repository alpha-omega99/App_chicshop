/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FBF9F6",
        surface: "#FFFFFF",
        rose: {
          50: "#FCF1F1",
          100: "#F7DEDE",
          200: "#EFC4C4",
          300: "#E5B3B3",
          400: "#D89595",
          500: "#C56F6F",
        },
        emerald2: {
          50: "#E6EEEA",
          100: "#B8CDC1",
          400: "#3D6B58",
          500: "#1A3C2F",
          900: "#0E2419",
        },
        gold: {
          400: "#E4C76A",
          500: "#D4AF37",
          600: "#B8932A",
        },
        bone: "#F2EBE5",
        ink: "#1C1918",
        inkLight: "#4A4542",
        line: "#E6DFD5",
        background: "#FBF9F6",
        foreground: "#1C1918",
        border: "#E6DFD5",
        primary: { DEFAULT: "#E5B3B3", foreground: "#1A3C2F" },
        secondary: { DEFAULT: "#1A3C2F", foreground: "#FFFFFF" },
        accent: { DEFAULT: "#D4AF37", foreground: "#1C1918" },
        muted: { DEFAULT: "#F2EBE5", foreground: "#78716C" },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Outfit'", "sans-serif"],
        calli: ["'Amiri'", "serif"],
      },
      borderRadius: {
        xl2: "24px",
        xl3: "32px",
      },
      boxShadow: {
        soft: "0 20px 40px -15px rgba(26,60,47,0.10)",
        emerald: "0 8px 30px rgba(26,60,47,0.30)",
        rose: "0 8px 30px rgba(229,179,179,0.45)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        floaty: "floaty 4s ease-in-out infinite",
        fadeUp: "fadeUp 0.7s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
