/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.8125rem', { lineHeight: '1.25rem' }],
        'base': ['0.9375rem', { lineHeight: '1.5rem' }],
      },
      borderRadius: {
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.04)',
        'modal': '0 0 0 1px rgba(0,0,0,0.04), 0 16px 48px -12px rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.08)',
        'dropdown': '0 0 0 1px rgba(0,0,0,0.04), 0 4px 16px -8px rgba(0,0,0,0.12), 0 2px 8px -4px rgba(0,0,0,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 120ms ease-out',
        'slide-up': 'slideUp 180ms ease-out',
        'scale-in': 'scaleIn 120ms ease-out',
        'slide-in-right': 'slideInRight 180ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
};
