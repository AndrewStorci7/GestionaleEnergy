/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      componets: {
        'on-fix-index': {
          '@apply relative': {},
        },
        'on-header': {
          '@apply w-full bg-white text-thirdary font-bold text-2xl rounded-[5px]': {},
        },
      },
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
        thirdary_1:'#0047AB',
        thirdary_2:'#A7C7E7',
        thirdary: '#998fa0',
        checked: '#7EE285',
        error: '#E74545',
        waiting: '#FF9D0B',
        info: '#2E86AB',
      },
    },
  },
  plugins: [],
};
