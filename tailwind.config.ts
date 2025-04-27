import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        boldonse: ['var(--font-boldonse)'],
        lexend: ['var(--font-lexend)'],
      },
    },
  },
  plugins: [],
};

export default config; 