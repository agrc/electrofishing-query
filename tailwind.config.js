import ugrcPreset from '@ugrc/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./node_modules/@ugrc/**/*.{tsx,jsx,js}', './index.html', './src/**/*.{tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FCEEE9',
          100: '#F8DDD3',
          200: '#F1BBA7',
          300: '#EA987B',
          400: '#E4764E',
          500: '#DD5623',
          600: '#B1431B',
          700: '#843215',
          800: '#58220E',
          900: '#2C1107',
          950: '#160803',
        },
        secondary: {
          50: '#F3F5F6',
          100: '#E8EBED',
          200: '#D1D6DC',
          300: '#BAC2CA',
          400: '#A0AAB6',
          500: '#8996A4',
          600: '#728292',
          700: '#5F6D7C',
          800: '#4D5864',
          900: '#262B31',
          950: '#14171A',
        },
        accent: {
          50: '#EBF6FA',
          100: '#DAEEF6',
          200: '#B1DBEC',
          300: '#8CCAE3',
          400: '#63B8D9',
          500: '#3FA7D0',
          600: '#2C8EB4',
          700: '#226D8B',
          800: '#195066',
          900: '#0C2731',
          950: '#061319',
        },
      },
      fontFamily: {
        utah: ['"Source Sans 3"', '"Source Sans Pro"', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['SourceSansPro-Black', 'Source Sans Pro', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
  presets: [ugrcPreset],
};
