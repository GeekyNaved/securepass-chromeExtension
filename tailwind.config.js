/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'customYellow': '#F8EF00',
        'customAqua': '#00F0FF',
        'customRed': '#FF003C',
      },
    },
  },
  plugins: [],
}

