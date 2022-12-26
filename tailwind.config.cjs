/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: Array.from({ length: 6 }).map((_, index) => { return [`w-${5 + index}`, `h-${5 + index}`] }).flat(1),
  theme: {
    extend: {},
  },
  plugins: [],
}