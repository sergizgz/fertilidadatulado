/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta basada en el logo — blush rosado suave
        cream: '#FEF9FA',
        'cream-dark': '#F7EAED',
        'cream-darker': '#EDD5DC',
        'rose-soft': '#F2C8D0',
        'rose-medium': '#E09AAA',
        'rose-accent': '#C9788A',   // color principal del logo
        'rose-dark': '#A55A6E',     // hover / énfasis
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
