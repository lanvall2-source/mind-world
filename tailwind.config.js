/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        island: {
          bg: '#F7F5EE',
          'bg-card': '#FFFDF9',
          moss: '#5B7B4B',
          'moss-light': '#8CA374',
          'moss-subtle': '#EAF0E6',
          pond: '#568784',
          'pond-light': '#7AA8A4',
          'pond-subtle': '#E8F2F1',
          sand: '#D8C6A5',
          'sand-subtle': '#F4EFE6',
          tree: '#3A5632',
          text: '#2B332A',
          'text-secondary': '#546352',
          'text-muted': '#889885',
          border: '#E3DDD0',
          peach: '#E89882',
          'peach-subtle': '#FDF1EE',
          lavender: '#8D89B5',
          'lavender-subtle': '#F2F1F8',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      animation: {
        'gentle-pulse': 'gentlePulse 2.5s ease-in-out infinite',
        'soft-float': 'softFloat 3s ease-in-out infinite',
        'ripple-out': 'rippleOut 1.5s ease-out infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        gentlePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
        softFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        rippleOut: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
