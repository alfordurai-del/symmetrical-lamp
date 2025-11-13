// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        dosis: ['"Dosis"', 'sans-serif'],
        abel: ['"Abel"', 'sans-serif'],
        anton: ['"Anton"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
