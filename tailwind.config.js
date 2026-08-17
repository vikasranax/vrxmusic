/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:    '#e9eef3',
        sub:    '#8a97a6',
        muted:  '#4a5568',
        accent: '#34e1d6',
        canvas: '#05070a',
        panel:  '#0a0d12',
      },
      fontFamily: {
        sans:   ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif:  ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        mono:   ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 40px -5px rgba(52, 225, 214, 0.15)',
      },
      animation: {
        'breathe': 'breathe 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};