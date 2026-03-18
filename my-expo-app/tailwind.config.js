/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Background Colors
        background: {
          DEFAULT: 'var(--color-background)',
          light: '#F8FAFC',
          dark: '#0B0B0C',
        },

        // Surface / Card Colors
        surface: {
          DEFAULT: 'var(--color-surface)',
          light: '#FFFFFF',
          dark: '#121214',
        },
        'surface-hover': {
          DEFAULT: 'var(--color-surface-hover)',
          light: '#F1F5F9',
          dark: '#1A1A1D',
        },
        'surface-nested': {
          DEFAULT: 'var(--color-surface-nested)',
          light: '#F1F5F9',
          dark: '#1A1A1D',
        },

        // Border & Divider
        border: {
          DEFAULT: 'var(--color-border)',
          light: '#E5E7EB',
          dark: '#1F1F23',
        },
        divider: {
          DEFAULT: 'var(--color-divider)',
          light: '#EEF2F7',
          dark: '#2A2A2F',
        },

        // Text Colors
        'text-primary': {
          DEFAULT: 'var(--color-text-primary)',
          light: '#0F172A',
          dark: '#F8FAFC',
        },
        'text-secondary': {
          DEFAULT: 'var(--color-text-secondary)',
          light: '#475569',
          dark: '#A1A1AA',
        },
        'text-muted': {
          DEFAULT: 'var(--color-text-muted)',
          light: '#94A3B8',
          dark: '#71717A',
        },

        // Primary Scale (Actions, Focus, Links)
        primary: {
          50: '#E6F4FB',
          100: '#CDE9F7',
          200: '#9BD3EF',
          300: '#69BDE7',
          400: '#37A7DF',
          500: '#0084D1',
          600: '#0069A7',
          700: '#004F7D',
          800: '#003453',
          900: '#001A29',
          DEFAULT: '#0084D1',
        },

        // Secondary Scale (Success, Positive, Gains)
        secondary: {
          50: '#E6FDF1',
          100: '#CCFBE3',
          200: '#99F7C7',
          300: '#66F3AB',
          400: '#33EF8F',
          500: '#05DF72',
          600: '#04B85C',
          700: '#039146',
          800: '#026A30',
          900: '#01431A',
          DEFAULT: '#05DF72',
        },

        // Tertiary Scale (Warning, Alerts, Attention)
        tertiary: {
          50: '#FFF7E6',
          100: '#FFEFCC',
          200: '#FFDF99',
          300: '#FFCF66',
          400: '#FFBF33',
          500: '#FFBA00',
          600: '#CC9500',
          700: '#997000',
          800: '#664A00',
          900: '#332500',
          DEFAULT: '#FFBA00',
        },
      },

      // Bento UI specific border radius
      borderRadius: {
        bento: '1rem',
        'bento-sm': '0.75rem',
        'bento-lg': '1.25rem',
      },
    },
  },
  plugins: [],
};
