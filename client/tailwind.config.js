/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#F8F9FA',      // Soft, off-white background
        'surface': '#FFFFFF',         // Pure white for cards, modals to make them pop
        'primary': '#2E7D32',         // A deep, professional green
        'primary-hover': '#388E3C',   // A slightly lighter green for hover
        'on-surface': '#212529',      // Dark gray for primary text (not pure black)
        'on-surface-muted': '#6C757D',// Lighter gray for secondary text
        'border': '#E9ECEF',         // Subtle border color for separation
        'destructive': '#DC3545',     // A clear red for delete actions
      },
    },
  },
  plugins: [],
}