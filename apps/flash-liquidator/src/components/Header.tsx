import classNames from 'classnames'

interface HeaderProps {
  className?: string
}

export const Header = (props: HeaderProps) => {
  const { className } = props

  return (
    <div className={classNames('flex flex-col gap-2 items-center text-center px-6', className)}>
      <h1 className='text-lg md:text-3xl'>Earn while flash liquidating PoolTogether yield</h1>
      <p className='text-xs text-pt-purple-300 md:text-sm md:font-semibold'>
        By liquidating yield from prize vaults into POOL, you are helping to turn the gears of the
        PoolTogether protocol, enabling prize creation and distribution to depositors in those prize
        vaults. Through arbitrage, you can also make some profit yourself!
      </p>
    </div>
  )
}
