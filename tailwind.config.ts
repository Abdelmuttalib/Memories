import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "src/**/*.{ts,tsx}",
    // "components/**/*.{ts,tsx}",
    // "app/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        taupe: "#453D31",
        "battleship-gray": "#8F8B7B",
        "eerie-black-light": "#24211B",
        "ash-gray": "#B8BAB2",
        night: "#0C0B0F",
        "smoky-black": "#13100D",
        "night-dark": "#0B090B",
        "eerie-black": "#0B090B",

        ashgray: {
          100: "#f1f1f0",
          200: "#e3e3e0",
          300: "#d4d6d1",
          400: "#c6c8c1",
          500: "#b8bab2",
          600: "#93958e",
          700: "#6e706b",
          800: "#4a4a47",
          900: "#252524",
        },
        black: {
          DEFAULT: "#0b0b0b", // 800 #080605
          100: "#d0cfcf",
          200: "#a19f9e",
          300: "#71706e",
          400: "#42403d",
          500: "#13100d",
          600: "#0f0d0a",
          700: "#0b0a08",
          800: "#080605",
          900: "#040303",
        },

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
