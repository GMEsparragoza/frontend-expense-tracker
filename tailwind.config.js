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
      lightBlue: '#3B82F6',
      lightDarkBlue: '#2a3b54',
      softBlue: '#2563EB',
      gray: "#c6d1d8",
      white: "#e1e1e1",
      black: "#111111",
      lightSlate: '#8D99AE',
      darkSlate: "#0f172a",
      lightRed: '#EF4444',
      darkRed: '#B91C1C',
      green: '#009900',
    },
  },
  plugins: [],
}

