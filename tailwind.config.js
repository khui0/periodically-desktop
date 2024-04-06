import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  future: {
    hoverOnlyWhenSupported: true,
  },
  daisyui: {
    themes: [
      {
        light: {
          "color-scheme": "light",
          "primary": "#059fff",
          "primary-content": "#3d3d3d",
          "secondary": "#0061bc",
          "secondary-content": "#3d3d3d",
          "accent": "#059fff",
          "neutral": "#9c9c9c",
          "neutral-content": "#555555",
          "base-100": "#ffffff",
          "base-200": "#ececec",
          "base-300": "#dfdfdf",
          "base-content": "#3d3d3d",
          "error": "#f54c63",
          "error-content": "#3d3d3d",

          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
      {
        dark: {
          "color-scheme": "dark",
          "primary": "#059fff",
          "primary-content": "#ffffff",
          "secondary": "#0061bc",
          "secondary-content": "#ffffff",
          "accent": "#059fff",
          "neutral": "#3f3f3f",
          "neutral-content": "#cfcfcf",
          "base-100": "#0f0f0f",
          "base-200": "#252525",
          "base-300": "#303030",
          "base-content": "#ffffff",
          "error": "#f54c63",
          "error-content": "#ffffff",

          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
};
