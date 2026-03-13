/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors - Main brand color (Blue)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
          foreground: '#ffffff',
        },
        // Secondary colors - Supporting brand color (Purple)
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          foreground: '#ffffff',
        },
        // Destructive colors - Danger/Delete actions (Red)
        destructive: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          foreground: '#ffffff',
        },
        // Success colors - Green
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
          foreground: '#ffffff',
        },
        // Warning colors - Amber/Orange
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          foreground: '#ffffff',
        },
        // Info colors - Cyan
        info: {
          50: '#ecf9ff',
          100: '#d9f2ff',
          200: '#b3e5fc',
          300: '#81d4fa',
          400: '#4dd0e1',
          500: '#26c6da',
          600: '#00bcd4',
          700: '#00acc1',
          800: '#0097a7',
          900: '#006064',
          foreground: '#ffffff',
        },
        // Neutral/Grayscale
        foreground: '#1f2937',
        background: '#ffffff',
        muted: {
          DEFAULT: '#f3f4f6',
          foreground: '#6b7280',
        },
        accent: {
          DEFAULT: '#0ea5e9',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
        input: '#e5e7eb',
        ring: '#0ea5e9',
        border: '#e5e7eb',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}
