/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,mdx}',
    './tina/**/*.{js,jsx,ts,tsx}',
  ],
  // `.container` is defined in src/styles/global.css alongside the rest of the layout tokens.
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        'neutral-text': 'var(--fg-primary)',
        'neutral-text-secondary': 'var(--fg-secondary)',
        'neutral-border': 'var(--blog-border)',
        'neutral-border-subtle': 'var(--blog-border)',
        'neutral-background-secondary': 'var(--blog-code-bg)',
        'background-brand-code': 'var(--blog-code-bg)',
      },
    },
  },
  plugins: [],
};
