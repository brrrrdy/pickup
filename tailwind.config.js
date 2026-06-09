/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#e78c70",
        surface: "#e78c70",
        accentpurple: "#714cdc",
        foreground: "#714cdc",
        accentgreen: "#00c8b3",
        accentred: "#e74200",
        accentblue: "#83e2f1",
        muted: "#39423c",
        primary: "#000000",
        "primary-foreground": "#ffffff",
        secondary: "#eaf2eb",
        border: "#d2e2d4",
      },
    },
  },
  plugins: [],
};
