/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#05070a',
          surface: '#0a0d14',
          elevated: '#101522',
          card: 'rgba(13, 17, 26, 0.72)',
          'card-hover': 'rgba(18, 24, 38, 0.85)',
        },
        brand: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
          violet: '#8b5cf6',
          purple: '#a855f7',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          light: '#38bdf8',
          dark: '#0891b2',
        },
        emerald: {
          DEFAULT: '#10b981',
          light: '#34d399',
        },
        amber: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'equalizer-1': 'eq1 0.8s ease-in-out infinite',
        'equalizer-2': 'eq2 0.6s ease-in-out infinite 0.2s',
        'equalizer-3': 'eq3 1s ease-in-out infinite 0.4s',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.4)' },
        },
        eq1: { '0%, 100%': { height: '4px' }, '50%': { height: '14px' } },
        eq2: { '0%, 100%': { height: '6px' }, '50%': { height: '16px' } },
        eq3: { '0%, 100%': { height: '3px' }, '50%': { height: '12px' } },
      },
      boxShadow: {
        'glow-brand': '0 0 35px -5px rgba(99, 102, 241, 0.35)',
        'glow-cyan': '0 0 35px -5px rgba(6, 182, 212, 0.35)',
        'glass-card': '0 24px 48px -12px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
};
