/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFDF2",
        primary: "#000000",
      }
    },
  },
  plugins: [],
}

