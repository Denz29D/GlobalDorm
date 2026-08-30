import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        customGrey: {
          ...daisyUIThemes["light"],
          primary: "#7e8a97", // Muted grey-blue for primary buttons or elements
          secondary: "#b0b8c1", // Softer grey for secondary buttons or highlights
          accent: "#e4e7ea", // Light grey for accents like cards or lighter backgrounds
          neutral: "#f5f5f5", // Very light grey for the background of cards or content
          "base-100": "#e0e0e0", // Light grey background
          "base-200": "#d6d6d6", // Slightly darker grey
          "base-300": "#c2c2c2", // Mid-tone grey
          "base-content": "#333333", // Dark text color for contrast against lighter backgrounds
        },
      },
    ],
  },
};
