import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useWalletAddresses } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'

interface WalletsCardProps {
  prizePool: PrizePool
  className?: string
}

export const WalletsCard = (props: WalletsCardProps) => {
  const { prizePool, className } = props

  const { data: allWalletAddresses } = useWalletAddresses(prizePool)
  const { data: activeWalletAddresses } = useWalletAddresses(prizePool, { activeWalletsOnly: true })

  return (
    <div className={classNames('flex flex-col p-4 bg-pt-transparent rounded-2xl', className)}>
      <span className='text-pt-purple-400'>Unique Wallet Addresses</span>
      <div className='flex justify-between items-center gap-4'>
        <span>Currently Deposited</span>
        <span>
          {!!activeWalletAddresses ? activeWalletAddresses.length.toLocaleString() : <Spinner />}
        </span>
      </div>
      <div className='flex justify-between items-center gap-4'>
        <span>All Time</span>
        <span>
          {!!allWalletAddresses ? allWalletAddresses.length.toLocaleString() : <Spinner />}
        </span>
      </div>
    </div>
  )
}
