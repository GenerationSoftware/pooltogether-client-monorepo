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
      averta: 'Averta',
      inter: 'Inter'
    },
    extend: {
      colors: {
        pt: {
          purple: {
            50: '#F5F0FF',
            100: '#DECEFF',
            200: '#C8ADFF',
            300: '#B18CFF',
            400: '#9B6AFF',
            500: '#8050E3',
            600: '#6538C1',
            700: '#4C249F',
            800: '#36147D',
            900: '#24095B',
            DEFAULT: '#8050E3'
          },
          teal: {
            light: '#35F0D0',
            dark: '#0DC5A5',
            DEFAULT: '#35F0D0'
          },
          pink: {
            light: '#FA48E8',
            dark: '#B623A7',
            DEFAULT: '#FA48E8'
          },
          bg: {
            purple: {
              light: '#5D3A97',
              dark: '#2D0C66',
              darker: '#21064E',
              DEFAULT: '#2D0C66'
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
