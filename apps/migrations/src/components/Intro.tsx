import { ConnectButton } from '@rainbow-me/rainbowkit'
import classNames from 'classnames'
import Image from 'next/image'

export interface IntroProps {
  className?: string
}

export const Intro = (props: IntroProps) => {
  const { className } = props

  return (
    <div className={classNames('w-full flex flex-col items-center', className)}>
      <Image src='/pooly.svg' alt='Pooly' height={64} width={72} className='h-16 w-auto' />
      <ConnectButton />
    </div>
  )
}
