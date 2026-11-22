import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#090C12',
          elevated: '#0E131D',
        },
        surface: {
          card: '#121825',
          'card-alt': '#161E2E',
          hover: '#1C263A',
          inset: '#0A0E16',
        },
        ink: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        accent: {
          primary: '#10B981',
          'primary-hover': '#14C98E',
          soft: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.32)',
        },
        status: {
          warning: '#F59E0B',
          'warning-soft': 'rgba(245, 158, 11, 0.12)',
          'warning-border': 'rgba(245, 158, 11, 0.30)',
          deferred: '#38BDF8',
          'deferred-soft': 'rgba(56, 189, 248, 0.11)',
          'deferred-border': 'rgba(56, 189, 248, 0.28)',
          danger: '#F43F5E',
          'danger-soft': 'rgba(244, 63, 94, 0.12)',
          'danger-border': 'rgba(244, 63, 94, 0.30)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.16)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 32px rgba(0, 0, 0, 0.28)',
        elevated: '0 4px 12px rgba(0, 0, 0, 0.45), 0 24px 64px rgba(0, 0, 0, 0.55)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
      },
    },
  },
  plugins: [],
};

export default config;
