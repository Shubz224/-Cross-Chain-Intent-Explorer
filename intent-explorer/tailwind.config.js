/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Avail's exact color palette from screenshot
        avail: {
          dark: '#0B0D17',      // Main background
          card: '#1A1D2E',      // Card background  
          border: '#2D3748',    // Subtle borders
          accent: '#4299E1',    // Blue accents
          success: '#48BB78',   // Green indicators
          error: '#F56565',     // Red/failed states
          warning: '#ED8936',   // Orange warnings
          text: {
            primary: '#FFFFFF',   // Main text
            secondary: '#A0AEC0', // Muted text
            muted: '#718096',     // Very muted
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
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
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
