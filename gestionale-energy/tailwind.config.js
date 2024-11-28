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
        primary: '#e01b26',
        primary_2: '#FDEDEE',
        primary_3: '#F29297',
        secondary: '#1c6a06',
        secondary_2: '#F0FEEC',
        secondary_3: '#B2F99F',
        thirdary: '#998fa0',
        checked: '#7EE285',
        error: '#E74545',
        waiting: '#FF9D0B',
      },
    },
  },
  plugins: [],
};
