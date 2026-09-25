/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#081c15',    // Base profunda / Contraste fuerte / Header
          secondary: '#184322',  // Estructuras / Tarjetas / Navbars / Bordes oscuros
          accent: '#036666',     // Acciones, botones primarios, focus rings, badges activos
          surface: '#EBF2FA',    // Fondos claros, textos de alto contraste, badges neutros
          success: '#2ECC71',    // Verde Esmeralda / Éxito / Notificaciones y estados aprobados
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
};
