/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cozy: {
          50: '#FAF8F5',
          100: '#F5EFEB',
          200: '#ECE2D8',
          300: '#DFCDBE',
          400: '#C7B19C',
          500: '#A78B71',
          600: '#8A6D53',
          700: '#6E543E',
          800: '#533D2D',
          900: '#3D2B1F',
          950: '#231811',
        },
        momo: {
          cream: '#FFF9F2',
          peach: '#FFB89E',
          blush: '#FFAAA6',
          lavender: '#E2DBF2',
          mint: '#D8EEDF',
          butter: '#FFECA1',
          earPink: '#FFAFA8',
          shadow: '#3E342F',
        },
        darkbg: {
          DEFAULT: '#141416',
          card: '#1C1C20',
          hover: '#26262B',
          border: '#2E2E35',
          subtle: '#3B3B44'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(100, 80, 60, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(100, 80, 60, 0.08)',
        'cozy': '0 12px 35px -8px rgba(160, 120, 80, 0.12)',
        'glow': '0 0 25px -3px rgba(255, 184, 158, 0.4)',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2.5s ease-in-out infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'sleeping-zzz': 'zzz 2.5s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        zzz: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(0.6)' },
          '50%': { opacity: '1', transform: 'translateY(-12px) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-24px) scale(1.2)' },
        }
      }
    },
  },
  plugins: [],
};
