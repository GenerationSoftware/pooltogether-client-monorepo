import classNames from 'classnames'
import Image from 'next/image'

interface PoweredByPTProps {
  className?: string
}

export const PoweredByPT = (props: PoweredByPTProps) => {
  const { className } = props

  return (
    <div className={classNames('flex flex-col gap-2 items-center', className)}>
      <span className='text-sm text-pt-teal-dark'>Powered By</span>
      <Image
        src='/ptLogo.svg'
        alt='PoolTogether Logo'
        width={183}
        height={72}
        priority={true}
        className='w-28 h-auto'
      />
    </div>
  )
}
