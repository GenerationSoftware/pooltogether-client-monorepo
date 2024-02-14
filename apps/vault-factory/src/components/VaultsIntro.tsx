import classNames from 'classnames'

interface VaultsIntroProps {
  className?: string
}

export const VaultsIntro = (props: VaultsIntroProps) => {
  const { className } = props

  return (
    <div className={classNames('flex flex-col gap-3 items-center text-center', className)}>
      <span className='text-3xl text-pt-purple-50'>Deploy PoolTogether Prize Vaults</span>
      <span className='text-md text-pt-purple-200'>
        All that is required to have a prize vault of your own is an ERC-4626 compatible yield
        source.
      </span>
    </div>
  )
}
