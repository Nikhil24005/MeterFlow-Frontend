/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          850: '#15202b',
          950: '#0f172a',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        accent: {
          300: '#f472b6',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          900: '#831843',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-card': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        'gradient-accent': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      },
      boxShadow: {
        'lg-glow': '0 20px 25px -5px rgba(14, 165, 233, 0.1)',
        'accent-glow': '0 0 30px rgba(236, 72, 153, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
