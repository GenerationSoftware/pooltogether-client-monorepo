import { ConnectButton } from '@rainbow-me/rainbowkit'
import classNames from 'classnames'

export interface IntroProps {
  className?: string
}

export const Intro = (props: IntroProps) => {
  const { className } = props

  return (
    <div className={classNames('flex flex-col', className)}>
      {/* TODO: add proper description */}
      <span>connect wallet to see stuff</span>
      <ConnectButton />
    </div>
  )
}
