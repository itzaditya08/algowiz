/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-blue': '#3b82f6',       // Modernized vibrant blue
        'primary-blue-hover': '#2563eb', // Darker blue for hover states
        'dark-background': '#0f172a',    // Slate-900 (Sleeker than plain gray)
        'dark-card': '#1e293b',          // Slate-800
        'dark-border': '#334155',        // Slate-700
        'light-background': '#f8fafc',   // Slate-50
        'light-card': '#ffffff',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}