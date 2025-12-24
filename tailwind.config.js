// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mabry: ['"Mabry Pro"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        dosis: ['"Dosis"', 'sans-serif'],
        anton: ['"Anton"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
