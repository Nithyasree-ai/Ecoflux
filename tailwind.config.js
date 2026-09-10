/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ecoflux: {
          darkest: '#050a08',
          dark: '#08120e',
          card: '#0e1d17',
          surface: '#152921',
          border: 'rgba(16, 185, 129, 0.15)',
          borderGlow: 'rgba(52, 211, 153, 0.35)',
          emerald: '#10b981',
          emeraldLight: '#34d399',
          lime: '#22c55e',
          limeBright: '#4ade80',
          cyan: '#06b6d4',
          cyanBright: '#22d3ee',
          amber: '#f59e0b',
          rose: '#f43f5e',
          muted: '#94a3b8',
          textMuted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
        'glow-md': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-lg': '0 0 35px -5px rgba(52, 211, 153, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'bento': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 12s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(52, 211, 153, 0.7))' },
        }
      }
    },
  },
  plugins: [],
}
