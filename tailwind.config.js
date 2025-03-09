/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./electron-frontend/**/*.{html,js}"],
    theme: {
      extend: {
        colors: {
          'primary': '#0A4D9F',
          'secondary': '#DBDDDA',
          'accent': '#B59268',
        },
        fontFamily: {
          outfit: ['Outfit'],
          michroma: ['Michroma'],
          poppins: ['Poppins'],
          monstserrat: ['Montserrat'],
        },
      },
    },
    plugins: [],
}