/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    fontFamily: {
      sans: ['"PT Sans"', 'sans-serif']
    },
    extend: {
      colors: {
        primary: {
          '50': 'var(--primary-50)',
          '100': 'var(--primary-100)',
          '200': 'var(--primary-200)',
          '300': 'var(--primary-300)',
          '400': 'var(--primary-400)',
          '500': 'var(--primary-500)',
          '600': 'var(--primary-600)',
          '700': 'var(--primary-700)',
          '800': 'var(--primary-800)',
          '900': 'var(--primary-900)',
          '950': 'var(--primary-950)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
