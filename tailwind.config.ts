import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0a0f',
          50: '#f0f0ff',
          100: '#e0e0f0',
          200: '#c0c0e0',
          300: '#8888bb',
          400: '#5555aa',
          500: '#333388',
          600: '#1a1a44',
          700: '#12122e',
          800: '#0d0d1f',
          900: '#0a0a15',
          950: '#06060b',
        },
        accent: {
          DEFAULT: '#6c63ff',
          50: '#eeeaff',
          100: '#d4ccff',
          200: '#b3a5ff',
          300: '#917dff',
          400: '#7e73ff',
          500: '#6c63ff',
          600: '#5a4fe6',
          700: '#4a3fcc',
          800: '#3a2fb3',
          900: '#2a1f99',
        },
        neon: {
          cyan: '#00f5ff',
          purple: '#bf5af2',
          pink: '#ff2d78',
          green: '#30d158',
          orange: '#ff9f0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(108,99,255,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(108,99,255,0.6), 0 0 40px rgba(108,99,255,0.2)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
