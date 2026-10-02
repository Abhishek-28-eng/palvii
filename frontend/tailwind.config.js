/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0faf4',
          100: '#dcf5e6',
          200: '#bdeacf',
          300: '#8dd8ac',
          400: '#57bf83',
          500: '#34a363',
          600: '#258550',
          700: '#1e6940',
          800: '#1b5435',
          900: '#17452d',
          950: '#0c2a1b',
        },
        brand: {
          DEFAULT: '#2D6A4F',
          light: '#40916C',
          dark: '#1B4332',
          leaf: '#52B788',
          fresh: '#74C69D',
          earth: '#6B4C2A',
          cream: '#FAF7F2',
          warm: '#F5EFE0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.07)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.12)',
        'green': '0 4px 20px rgba(45,106,79,0.25)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
