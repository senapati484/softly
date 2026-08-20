/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FDFCF8',
          50: '#FFFFFF',
          100: '#FDFCF8',
          200: '#F5F3EB',
          300: '#ECE8DD'
        },
        sage: {
          DEFAULT: '#E8EFE8',
          light: '#F2F6F2',
          dark: '#B7C9B7',
          deep: '#4A6B4A'
        },
        coral: {
          DEFAULT: '#FFB7B2',
          light: '#FFE4E1',
          dark: '#E07A74',
          deep: '#A34842'
        },
        lavender: {
          DEFAULT: '#EFEDF4',
          light: '#F7F6FA',
          dark: '#C8C2D8',
          deep: '#6C628A'
        },
        stone: {
          ink: '#292524',
          body: '#78716C',
          muted: '#A8A29E',
          card: '#F8F6F0',
          line: '#E7E5E4'
        }
      },
      fontFamily: {
        sans: ["System"],
      }
    },
  },
  plugins: [],
};
