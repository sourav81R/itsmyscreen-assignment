/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand-primary)',
        accent: 'var(--color-brand-accent)',
        base: 'var(--color-bg-base)',
        surface: 'var(--color-bg-surface)',
        elevated: 'var(--color-bg-elevated)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        textMuted: 'var(--color-text-muted)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        elevated: 'var(--shadow-elevated)',
        glow: '0 0 0 1px rgba(255,59,48,0.35), 0 12px 40px rgba(255,59,48,0.16)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.95' },
          '80%, 100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
      },
      backgroundImage: {
        shimmer:
          'linear-gradient(90deg, rgba(44,44,62,0.8) 25%, rgba(74,74,96,0.9) 50%, rgba(44,44,62,0.8) 75%)',
      },
    },
  },
  plugins: [],
};
