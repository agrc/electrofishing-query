import ugrcPreset from '@ugrc/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./node_modules/@ugrc/**/*.{tsx,jsx,js}', './index.html', './src/**/*.{tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FCF5F3',
          100: '#F9ECE6',
          200: '#F3D8CE',
          300: '#ECC2B1',
          400: '#E6AF99',
          500: '#E09B80',
          600: '#DA8868',
          700: '#D4754F',
          800: '#CD5F34',
          900: '#662F19',
          950: '#35180D',
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
