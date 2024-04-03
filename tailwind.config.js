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
        dark: {
          "color-scheme": "dark",
          "primary": "#059fff",
          "primary-content": "white",
          "secondary": "#059fff",
          "secondary-content": "white",
          "accent": "#059fff",
          "neutral": "#3f3f3f",
          "base-100": "#0f0f0f",
          "base-200": "#272727",
          "base-300": "#ababab",
          "base-content": "white",

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
