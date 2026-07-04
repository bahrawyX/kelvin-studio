/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        bone: 'var(--bone)',
        'bone-dim': 'var(--bone-dim)',
        hairline: 'var(--hairline)',
        kelvin: 'var(--kelvin)',
      },
    },
  },
  plugins: [],
}
