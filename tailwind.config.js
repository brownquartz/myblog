module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx,mdx}", // Adjust this path to match your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};