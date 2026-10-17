/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6258E8',
        'primary-light': '#8B83F0',
        'primary-dark': '#4A3FD0',
        'app-text': '#20233A',
        'app-bg': '#F9FAFB',
      },
    },
  },
  plugins: [],
};
