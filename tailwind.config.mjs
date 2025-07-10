/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        Tertiary: 'var(--Tertiary-color)',
        pending: 'var(--pending-color)',
        success: 'var(--success-color)',
        links: 'var(--links-color)',
        warning: 'var(--warning-color)',
      },
      fontFamily: {
        serif: ['var(--font-serif)'],
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
};