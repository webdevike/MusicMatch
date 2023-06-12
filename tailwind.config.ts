import { type Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)']
      }
    },
  },
  plugins: [],
} satisfies Config;
