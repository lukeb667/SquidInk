import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|ripple|spinner).js"
  ],

  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()]
} satisfies Config;