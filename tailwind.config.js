/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        surface: "#f5f8f4",
        foreground: "#112418",
        muted: "#35513f",
        primary: "#ed9911",
        "primary-foreground": "#ffffff",
        secondary: "#eaf2eb",
        border: "#d2e2d4",
      },
    },
  },
  plugins: [],
};
