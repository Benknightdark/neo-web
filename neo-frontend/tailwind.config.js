/** @type {import('tailwindcss').Config} */
module.exports = {
  // 定義內容掃描範圍，確保所有相關文件被包含
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.html',
    './src/**/!(node_modules)/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};