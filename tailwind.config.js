/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with a 'dark' class on the HTML element
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-blue': '#4a72ff',
        'dark-background': '#1a202c',
        'dark-card': '#2d3748',
        'light-card': '#ffffff',
      }
    },
  },
  plugins: [],
}