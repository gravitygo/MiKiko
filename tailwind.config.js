/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: '#F8FAFC', dark: '#0B0B0C' },
        surface: { DEFAULT: '#FFFFFF', dark: '#121214' },
        'surface-hover': { DEFAULT: '#F1F5F9', dark: '#1A1A1D' },
        border: { DEFAULT: '#E5E7EB', dark: '#1F1F23' },
        'text-primary': { DEFAULT: '#0F172A', dark: '#F8FAFC' },
        'text-secondary': { DEFAULT: '#475569', dark: '#A1A1AA' },
        'text-muted': { DEFAULT: '#94A3B8', dark: '#71717A' },
        primary: { 500: '#0084D1', 600: '#0069A7', DEFAULT: '#0084D1' },
        secondary: { 500: '#05DF72', 600: '#04B85C', DEFAULT: '#05DF72' },
        tertiary: { 500: '#FFBA00', 600: '#CC9500', DEFAULT: '#FFBA00' },
        expense: '#FF6B6B',
        income: '#05DF72',
      },
      borderRadius: { bento: '1rem', 'bento-sm': '0.75rem' },
    },
  },
  plugins: [],
};

