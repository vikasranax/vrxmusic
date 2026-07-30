/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#e9eef3', dim: '#8a97a6', faint: '#56626f',
        accent: { DEFAULT: '#34e1d6', deep: '#16b3ab', ink: '#04181a' },
        azure: '#4f8cff',
        panel: 'rgba(8,11,16,0.78)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: { pulse: { '0%,100%': { opacity: 1 }, '50%': { opacity: .35 } } },
      animation: { pulse: 'pulse 2s infinite' },
    },
  },
  plugins: [],
};