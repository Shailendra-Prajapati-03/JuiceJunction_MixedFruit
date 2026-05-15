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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        juice: {
          orange: '#ffa500',
          mango: '#ffcc00',
          strawberry: '#ff4d4d',
          apple: '#ff0800',
          kiwi: '#8ee53f',
          blueberry: '#4f86f7',
          pomegranate: '#c0392b',
          watermelon: '#fc6c85',
          lemon: '#fff44f',
          ginger: '#f2d1a0',
          pineapple: '#ffff00',
          banana: '#ffe135',
        }
      },
      animation: {
        'pour': 'pour 2s ease-in-out forwards',
        'wave': 'wave 3s ease-in-out infinite',
      },
      keyframes: {
        pour: {
          '0%': { height: '0%' },
          '100%': { height: '100%' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-5px) scaleY(1.05)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
