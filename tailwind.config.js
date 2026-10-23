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
        brand: {
          red: '#ED1C24',
          'red-dark': '#C81017',
          'red-light': '#FEE2E2',
          navy: '#0B2545',
          'navy-dark': '#061629',
          'navy-light': '#134074',
          blue: '#0267B1',
          'blue-light': '#EEF6FC',
          gold: '#F59E0B',
          'gold-light': '#FEF3C7',
          pitch: '#15803D',
          'pitch-dark': '#166534',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
