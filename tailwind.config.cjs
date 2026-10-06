/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,mdx}',
    './tina/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
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
