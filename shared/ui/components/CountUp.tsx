import classNames from 'classnames'
import { animate, Easing, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { formatNumberForDisplay } from '../../utilities'

export interface CountUpProps extends Intl.NumberFormatOptions {
  countTo: number
  countFrom?: number
  duration?: number
  ease?: Easing
  locale?: string
  round?: boolean
  hideZeroes?: boolean
  className?: string
}

export const CountUp = (props: CountUpProps) => {
  const { countTo, countFrom, duration, ease, className, ...rest } = props

  const count = useMotionValue(countFrom ?? 0)
  const value = useTransform(count, (latest) => formatNumberForDisplay(latest, { ...rest }))

  const virtualFinalValue = formatNumberForDisplay(countTo, { ...rest })

  useEffect(() => {
    const controls = animate(count, countTo, { duration: duration ?? 1.4, ease: ease ?? 'easeOut' })
    return controls.stop
  }, [])

  return (
    <span className={classNames('relative inline-flex flex-col', className)}>
      <span className='invisible h-0' aria-hidden={true}>
        {virtualFinalValue}
      </span>
      <motion.span className='absolute'>{value}</motion.span>
    </span>
  )
}
