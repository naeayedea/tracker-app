/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary)",
        "secondary": "var(--secondary)",
        "background": "var(--background)",
        "foreground": "var(--foreground)",
        "primary-foreground": "var(--foreground-text)",
        "accent": "var(--accent)",
        "input": "var(--input)",
        "input-hover": "var(--input-hover)",
      }
    }
  },
}