/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary  : '#6366f1',
        secondary: '#8b5cf6',
        dark     : '#0f172a',
        card     : '#1e293b',
        border   : '#334155',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}