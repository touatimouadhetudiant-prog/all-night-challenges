/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#050816',
        neonBlue: '#30cfff',
        neonPurple: '#9b5cff',
        neonPink: '#ff4fd8',
        glass: 'rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at top, rgba(48,207,255,0.18), transparent 28%), radial-gradient(circle at 80% 20%, rgba(155,92,255,0.20), transparent 24%), linear-gradient(135deg, rgba(8,12,30,1) 0%, rgba(5,8,22,1) 50%, rgba(10,14,35,1) 100%)',
      },
      boxShadow: {
        neon: '0 0 20px rgba(48,207,255,0.35), 0 0 40px rgba(155,92,255,0.18)',
        pink: '0 0 18px rgba(255,79,216,0.32)',
        card: '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05) inset',
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
        gridMove: 'gridMove 18s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow:
              '0 0 16px rgba(48,207,255,0.35), 0 0 40px rgba(155,92,255,0.16)',
          },
          '50%': {
            boxShadow:
              '0 0 28px rgba(48,207,255,0.60), 0 0 60px rgba(155,92,255,0.28)',
          },
        },
        gridMove: {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '0 80px, 80px 0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(250%)' },
        },
      },
    },
  },
  plugins: [],
};