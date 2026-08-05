/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A56DB",
        success: "#065F46",
        emergency: "#DC2626",
        warning: "#D97706",
        background: "#F8FAFC",
        card: "#FFFFFF",
        textDark: "#0F172A",
        textMuted: "#64748B",
        border: "#E2E8F0",
      }
    },
  },
  plugins: [],
}
