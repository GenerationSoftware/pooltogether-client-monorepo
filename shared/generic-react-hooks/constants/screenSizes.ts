/**
 * Tailwind screen size breakpoints
 */
export const SCREEN_SIZES = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536
} as const

/**
 * Maximum screen width considered mobile
 */
export const MAX_MOBILE_SCREEN_SIZE = SCREEN_SIZES.md
