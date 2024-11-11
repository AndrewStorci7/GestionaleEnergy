/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primaryON: '#fd4e01',
        secondaryON: '#154c63',
        primary: '#3d5a80',
        secondary: '#98c1d9',
        thirdary: '#e0fbfc',
      },
    },
  },
  plugins: [],
};
