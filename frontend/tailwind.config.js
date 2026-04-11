/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f0fe',
          100: '#d2e3fc',
          200: '#aecbfa',
          300: '#7baaf7',
          400: '#4285f4',
          500: '#1a73e8',
          600: '#1967d2',
          700: '#185abc',
          800: '#1558b0',
          900: '#0d47a1',
        },
        accent: {
          50:  '#fefde7',
          100: '#fdf6b2',
          200: '#fbe877',
          300: '#f8d43a',
          400: '#f4b400',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        success: {
          100: '#d7f0e1',
          500: '#34a853',
          700: '#1e7e3e',
        },
        danger: {
          100: '#fce8e6',
          500: '#ea4335',
          700: '#c5221f',
        },
        purple: {
          100: '#f3e5f5',
          500: '#9c27b0',
          700: '#7b1fa2',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          "'Segoe UI'",
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card:   '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.12)',
        sidebar: '2px 0 12px rgba(0,0,0,0.04)',
        header:  '0 1px 8px rgba(0,0,0,0.06)',
        auth:    '0 8px 32px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
