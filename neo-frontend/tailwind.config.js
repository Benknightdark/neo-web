/** @type {import('tailwindcss').Config} */
export default {
  // 定義內容掃描範圍，確保所有相關文件被包含
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};