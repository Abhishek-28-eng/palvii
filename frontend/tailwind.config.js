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
          50:  '#f0faf4',
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
          light:   '#40916C',
          dark:    '#1B4332',
          darker:  '#0d1c12',
          leaf:    '#52B788',
          fresh:   '#74C69D',
          earth:   '#6B4C2A',
          cream:   '#FAF7F2',
          warm:    '#F5EFE0',
          muted:   '#EBF5EF',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':         '0 1px 8px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
        'card-hover':   '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
        'card-xl':      '0 20px 60px rgba(0,0,0,0.14)',
        'green':        '0 4px 20px rgba(45,106,79,0.3)',
        'green-lg':     '0 8px 32px rgba(45,106,79,0.4)',
        'inner-light':  'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      borderRadius: {
        'xl':  '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(155deg, #0d1c12 0%, #1B4332 45%, #2D6A4F 100%)',
        'card-gradient': 'linear-gradient(135deg, #ffffff 0%, #f0faf4 100%)',
        'section-gradient': 'linear-gradient(180deg, #F7FAF8 0%, #ffffff 100%)',
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-in-out both',
        'slide-up':  'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':  'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
