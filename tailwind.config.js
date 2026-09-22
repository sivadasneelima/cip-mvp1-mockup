/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b1220',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        brand: {
          700: '#0f5c52',
          600: '#127a6b',
          500: '#16977f',
          400: '#3fb69a',
          100: '#e3f5f1',
        },
        amber: {
          600: '#b45309',
          500: '#d97706',
          400: '#f59e0b',
          100: '#fef3c7',
        },
        rose: {
          600: '#be123c',
          100: '#ffe4e6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15,23,42,0.06), 0 1px 3px 0 rgba(15,23,42,0.08)',
      },
    },
  },
  plugins: [],
}
