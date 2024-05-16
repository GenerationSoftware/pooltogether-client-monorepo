const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/**/*.{js,ts,jsx,tsx}',
    '../../shared/react-components/**/*.{js,ts,jsx,tsx}',
    '../../shared/ui/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/flowbite-react/lib/esm/theme.js'
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      grotesk: 'Grotesk',
      inter: 'Inter',
      averta: 'Averta'
    },
    extend: {
      colors: {
        pt: {
          purple: {
            50: '#E6F6FF',  // Lightest blue
            100: '#0076FF',
            200: '#0076FF',
            300: '#002C66',
            400: '#00428F',
            500: '#0076FF',  // Default blue
            600: '#002C66',
            700: '#00428F',
            800: '#002C66',
            900: '#001940',  // Darkest blue
            DEFAULT: '#0076FF'
          },
          teal: {
            light: '#FA48E8',  // Light pink
            dark: '#ec008c',   // Darker pink
            DEFAULT: '#FA48E8' // Default pink
          },
          pink: {
            light: '#FA48E8',
            dark: '#B623A7',
            DEFAULT: '#FA48E8'
          },
          bg: {
            purple: {
              light: '#002C66',
              dark: '##002C66',
              darker: '#001940',
              DEFAULT: '#002C66'
            }
          },
          warning: {
            light: '#FFB6B6',
            dark: '#8B0000',
            DEFAULT: '#8B0000'
          },
          gold: '#FFB636',
          transparent: '#F5F0FF1A'
        }
      }
    },
    screens: {
      'smSonner': '601px',
      ...defaultTheme.screens,
      '3xl': '1900px',
      '4xl': '2200px',
      '5xl': '2500px'
    }
  },
  plugins: [
    plugin(({ addUtilities }) => addUtilities({
      '.no-scrollbar::-webkit-scrollbar': {
        'display': 'none'
      },
      '.no-scrollbar': {
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
      }
    }))
  ]
}
