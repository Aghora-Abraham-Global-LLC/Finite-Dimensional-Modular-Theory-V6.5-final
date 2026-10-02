/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        modular: {
          50: '#f0fdf4',
          500: '#10b981',
          900: '#064e3b',
        },
        cosmic: {
          950: '#030712',
          900: '#0b1120',
          800: '#131e36',
          700: '#1e293b',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
        serif: ['Computer Modern', 'Latin Modern Roman', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
