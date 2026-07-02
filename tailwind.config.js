/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark premium design palette
        slate: {
          950: '#070a13',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
      },
    },
  },
  plugins: [],
}
