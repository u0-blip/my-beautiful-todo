/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/api/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@premieroctet/next-admin/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Admin-specific color palette
        admin: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Dark mode colors for admin
        'admin-dark': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'admin': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'admin-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'admin-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'admin': '0.75rem',
        'admin-lg': '1rem',
      },
    },
  },
  plugins: [
    // Custom plugin for admin-specific utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.admin-card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.admin'),
          boxShadow: theme('boxShadow.admin'),
          padding: theme('spacing.6'),
          border: `1px solid ${theme('colors.gray.200')}`,
        },
        '.admin-card-dark': {
          backgroundColor: theme('colors.gray.800'),
          borderRadius: theme('borderRadius.admin'),
          boxShadow: theme('boxShadow.admin'),
          padding: theme('spacing.6'),
          border: `1px solid ${theme('colors.gray.700')}`,
        },
        '.admin-button': {
          backgroundColor: theme('colors.admin.600'),
          color: theme('colors.white'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.admin.700'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.admin'),
          },
        },
        '.admin-button-secondary': {
          backgroundColor: theme('colors.gray.100'),
          color: theme('colors.gray.900'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.gray.200'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.admin'),
          },
        },
        '.admin-input': {
          border: `1px solid ${theme('colors.gray.300')}`,
          borderRadius: theme('borderRadius.md'),
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.sm'),
          transition: 'border-color 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.admin.500'),
            boxShadow: `0 0 0 3px ${theme('colors.admin.100')}`,
          },
        },
        '.admin-input-dark': {
          border: `1px solid ${theme('colors.gray.600')}`,
          backgroundColor: theme('colors.gray.700'),
          color: theme('colors.white'),
          borderRadius: theme('borderRadius.md'),
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.sm'),
          transition: 'border-color 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.admin.400'),
            boxShadow: `0 0 0 3px ${theme('colors.admin.900')}`,
          },
        },
        '.admin-table': {
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.admin'),
          overflow: 'hidden',
          boxShadow: theme('boxShadow.admin'),
        },
        '.admin-table-dark': {
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: theme('colors.gray.800'),
          borderRadius: theme('borderRadius.admin'),
          overflow: 'hidden',
          boxShadow: theme('boxShadow.admin'),
        },
        '.admin-table-header': {
          backgroundColor: theme('colors.gray.50'),
          borderBottom: `1px solid ${theme('colors.gray.200')}`,
          padding: theme('spacing.3'),
          textAlign: 'left',
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.gray.900'),
        },
        '.admin-table-header-dark': {
          backgroundColor: theme('colors.gray.700'),
          borderBottom: `1px solid ${theme('colors.gray.600')}`,
          padding: theme('spacing.3'),
          textAlign: 'left',
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.gray.100'),
        },
        '.admin-table-cell': {
          padding: theme('spacing.3'),
          borderBottom: `1px solid ${theme('colors.gray.100')}`,
          color: theme('colors.gray.900'),
        },
        '.admin-table-cell-dark': {
          padding: theme('spacing.3'),
          borderBottom: `1px solid ${theme('colors.gray.700')}`,
          color: theme('colors.gray.100'),
        },
      }
      addUtilities(newUtilities)
    }
  ],
  darkMode: 'class', // Enable class-based dark mode
} 