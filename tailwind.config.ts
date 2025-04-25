import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|date-picker|divider|drawer|input|ripple|spinner|calendar|date-input|form|popover|modal).js"
  ],

  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui(), require('@tailwindcss/typography')]
} satisfies Config;