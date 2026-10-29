/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#167D8D',
          dark: '#105D69',
          light: '#E8F5F6',
          50: '#F0F9FA',
          100: '#E8F5F6',
          500: '#167D8D',
          600: '#126774',
          700: '#105D69',
          800: '#0C444D',
          900: '#082D33'
        },
        slate: {
          850: '#151F30',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
