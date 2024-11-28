/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gradientColorStops: {
        'rose-100': '#ffe4e4',
        'purple-100': '#f3e8ff',
        'blue-100': '#e0f2fe',
      },
    },
  },
  plugins: [],
};
