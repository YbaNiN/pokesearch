/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        poke: {
          yellow: '#FFCB05',
          gold: '#B3A125',
          blue: '#3B4CCA',
          darkblue: '#1B2A6B',
          red: '#FF0000',
          black: '#0A0A14',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        body: ['"Pixelify Sans"', '"Trebuchet MS"', 'sans-serif'],
      },
      boxShadow: {
        retro: '0 6px 0 0 rgba(0,0,0,0.35)',
        glow: '0 0 30px rgba(255,203,5,0.55)',
      },
      keyframes: {
        flash: { '0%,100%': { opacity: '0' }, '50%': { opacity: '1' } },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%,60%': { transform: 'translateX(-10px)' },
          '40%,80%': { transform: 'translateX(10px)' },
        },
      },
      animation: {
        flash: 'flash 0.4s ease-in-out',
        shake: 'shake 0.45s ease-in-out',
      },
    },
  },
  plugins: [],
};
