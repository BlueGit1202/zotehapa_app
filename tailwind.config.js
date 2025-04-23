/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx}", "./src/components/**/*.{js,jsx}","./src/navigation/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "text": "#6E7191",
        "success": "#1AB759",
        "danger": "#E93C3C",
        "focus": "#006CC0",
        "heading": "#1F1F39",
        "paragraph": "#6E7191",
        "primary": "rgb(var(--primary) / <alpha-value>)",
        "primary-light": "rgb(var(--primary-light) / <alpha-value>)",
        "primary-slate": "rgb(var(--primary-slate) / <alpha-value>)",
        "secondary": "#1F1F39",
        "shopperz-red": "#FF6262",
        "shopperz-gray": "#EFF0F6",
        "shopperz-slate": "#D9DBE9",
        "shopperz-yellow": "#FFBC1F",
        "shopperz-pink": "#FD0063",
        "shopperz-orange": "#F23E14",
        "shopperz-purple": "#9353DE",
        "shopperz-blue": "#0072F4",
        admin: {
          red: "#FB4E4E",
          sky: "#007FE3",
          pink: "#FD0063",
          blue: "#426EFF",
          green: "#2AC769",
          orange: "#F23E14",
          yellow: "#F6A609",
          purple: "#6A45FE",
        }
      }
    }
  },
  plugins: []
};
