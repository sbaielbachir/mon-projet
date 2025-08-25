import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#010313',
        primary: '#3c55f2',
        secondary: '#913cff',
        accent: '#f23c93',
        text: '#ffffff',
        "text-muted": '#a1a1b4',
        card: 'rgba(255, 255, 255, 0.05)',
        border: 'rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'scroll-left': 'scroll-left 60s linear infinite',
        'scroll-right': 'scroll-right 60s linear infinite',
        'gradient-text': 'gradient-text 5s ease infinite',
        'hero-fade-in-up': 'hero-fade-in-up 1s ease-in-out forwards',
        'hero-fade-in-right': 'hero-fade-in-right 1s ease-in-out forwards',
        'bubble-pop-in': 'bubble-pop-in 0.8s ease-in-out forwards',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'gradient-text': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'hero-fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'bubble-pop-in': {
            '0%': { opacity: '0', transform: 'scale(0.8)' },
            '80%': { opacity: '1', transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;