/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Courier Prime"', 'monospace'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#F5F5F5',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'size': 'transform, font-size, letter-spacing',
      },
      width: {
        '128': '32rem', // 512px
        '144': '36rem', // 576px
      },
     height: {
        '128': '32rem',
        '144': '36rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
