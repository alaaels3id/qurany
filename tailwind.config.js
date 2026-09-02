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
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        dark: {
          bg: '#0a0f18',
          card: '#111827',
          cardHover: '#172236',
          sidebar: '#070b12',
          player: '#0d131f',
          border: '#1e293b',
          text: '#f8fafc',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        amiri: ['"Amiri"', 'serif'],
        cairo: ['"Cairo"', 'sans-serif'],
        tajawal: ['"Tajawal"', 'sans-serif'],
        sans: ['"Tajawal"', '"Cairo"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '22px' },
        }
      }
    },
  },
  plugins: [],
}
