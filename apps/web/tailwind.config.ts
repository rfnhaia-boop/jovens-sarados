import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8ec",
          100: "#f8ead0",
          200: "#e9cf9c",
          300: "#dcb26a",
          400: "#d08e3b",
          500: "#b96827",
          600: "#9b4d1e",
          700: "#78381b",
          800: "#512819",
          900: "#2d1a13",
        },
      },
    },
  },
  plugins: [],
};

export default config;
