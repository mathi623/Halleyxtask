/** @type {import('tailwindcss').Config} */
export default {
  // Only generate CSS for files that actually use Tailwind classes
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // Custom font families matching the original design
      fontFamily: {
        sans  : ['"Plus Jakarta Sans"', 'sans-serif'],
        serif : ['Lora', 'serif'],
      },
      // Custom colours that match the original platform design tokens
      colors: {
        indigo : {
          50  : '#eef2ff',
          100 : '#e0e7ff',
          500 : '#6366f1',
          600 : '#4f46e5',
          700 : '#4338ca',
        },
        emerald: {
          50  : '#ecfdf5',
          500 : '#10b981',
          600 : '#059669',
        },
        amber: {
          50  : '#fffbeb',
          500 : '#f59e0b',
        },
        rose: {
          50  : '#fff1f2',
          500 : '#f43f5e',
          600 : '#e11d48',
        },
        sky: {
          50  : '#f0f9ff',
          500 : '#0ea5e9',
          600 : '#0284c7',
        },
        violet: {
          500 : '#8b5cf6',
        },
      },
      // Box shadows matching the original layered shadow system
      boxShadow: {
        'card'   : '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'card-lg': '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
