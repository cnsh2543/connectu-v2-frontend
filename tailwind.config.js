/** @type {import('tailwindcss').Config} */

module.exports = {
  important: true,
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif']
      },
    }
  },
  plugins: [],
}

