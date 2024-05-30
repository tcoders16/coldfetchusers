/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'poppins-regular': ['Poppins-Regular', 'sans-serif'],
        'poppins-bold': ['Poppins-Bold', 'sans-serif'],
        'poppins-italic': ['Poppins-Italic', 'sans-serif'],
        'poppins-light': ['Poppins-Light', 'sans-serif'],
        'poppins-exlight': ['Poppins-ExLight', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
