/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFD700',
          500: '#F4A460',
          600: '#D4883D',
          700: '#B56D2E',
          800: '#8B5424',
          900: '#6B3F1A',
        },
        rose: {
          50: '#FFF5F7',
          100: '#FFE4E8',
          200: '#FFC9D1',
          300: '#FFAEBA',
          400: '#FF69B4',
          500: '#FF1493',
          600: '#DB0A7A',
          700: '#B70661',
          800: '#8B004B',
          900: '#660038',
        },
        maroon: {
          50: '#F5E6E8',
          100: '#EBCDD1',
          200: '#D79BA3',
          300: '#C36975',
          400: '#AF3747',
          500: '#800020',
          600: '#66001A',
          700: '#4D0013',
          800: '#33000D',
          900: '#1A0006',
        },
        cream: {
          50: '#FFFEFA',
          100: '#FFFDF5',
          200: '#FFFBEB',
          300: '#FFF9E1',
          400: '#FFF7D7',
          500: '#FFF5CD',
          600: '#F5E5B8',
          700: '#EBD5A3',
          800: '#D4BE8C',
          900: '#BDA775',
        },
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
