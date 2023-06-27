export interface SortIconProps {
  direction?: 'asc' | 'desc'
  className?: string
}

export const SortIcon = (props: SortIconProps) => {
  const { direction, className } = props

  const activeColor = '#9B6AFF'
  const inactiveColor = '#5D438B'

  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 13' fill='none' className={className}>
      <path
        d='M10.6667 4V12M10.6667 12L13.3333 9.33333M10.6667 12L8 9.33333'
        stroke={direction === 'desc' ? activeColor : inactiveColor}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3.66667 9V1M3.66667 1L1 3.66667M3.66667 1L6.33333 3.66667'
        stroke={direction === 'asc' ? activeColor : inactiveColor}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
