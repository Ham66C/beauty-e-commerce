import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: "#FFF5F5",
          card: "#FDE8E8",
          primary: "#9B6B6B",
          secondary: "#C8A2A2",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(155, 107, 107, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
