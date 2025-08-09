import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d6ecff',
          200: '#add9ff',
          300: '#7ec0ff',
          400: '#4ea4ff',
          500: '#1f86ff',
          600: '#0b69db',
          700: '#084fb0',
          800: '#083f8c',
          900: '#0a356f',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
