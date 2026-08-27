import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F3EEDF",
        "paper-dark": "#E8E0C9",
        ledger: "#1F3B2C",
        "ledger-light": "#2E5240",
        ink: "#1B2233",
        brass: "#B08A4E",
        "brass-light": "#D4B678",
        stamp: "#A63D2F",
        card: "#FFFFFF",
      },
      fontFamily: {
        display: [
          "Iowan Old Style",
          "Palatino Linotype",
          "URW Palladio L",
          "P052",
          "Georgia",
          "serif",
        ],
        body: [
          "Charter",
          "Bitstream Charter",
          "Sitka Text",
          "Cambria",
          "ui-serif",
          "Georgia",
          "serif",
        ],
        mono: [
          "IBM Plex Mono",
          "Menlo",
          "Consolas",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      backgroundImage: {
        "paper-texture":
          "radial-gradient(circle at 20% 20%, rgba(31,59,44,0.04) 0, transparent 45%), radial-gradient(circle at 80% 60%, rgba(176,138,78,0.05) 0, transparent 50%)",
      },
      boxShadow: {
        card: "0 1px 0 rgba(27,34,51,0.06), 0 8px 20px -12px rgba(27,34,51,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
