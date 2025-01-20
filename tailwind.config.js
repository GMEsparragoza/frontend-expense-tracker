/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      darkBlue: "#15314b",
      gray: "#c6d1d8",
      white: "#e1e1e1",
      black: "#111111",
      darkSlate: "#0f172a",
      lightSlate: '#8D99AE',
      lightBlue: '#3B82F6',
      red: '#991b1b',
      lightDarkBlue: '#2a3b54',
    },
  },
  plugins: [],
}

