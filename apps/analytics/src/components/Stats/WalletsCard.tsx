import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useWalletAddresses } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { useDeposits } from '@hooks/useDeposits'

interface WalletsCardProps {
  prizePool: PrizePool
  className?: string
}

export const WalletsCard = (props: WalletsCardProps) => {
  const { prizePool, className } = props

  const { data: allWalletAddresses } = useWalletAddresses(prizePool)
  const { data: activeWalletAddresses } = useWalletAddresses(prizePool, { activeWalletsOnly: true })

  const { data: deposits } = useDeposits(prizePool)

  return (
    <div className={classNames('flex flex-col p-4 bg-pt-transparent rounded-2xl', className)}>
      <span className='text-pt-purple-400'>Users</span>
      <DataRow
        name='Unique Wallets (Currently Deposited)'
        value={activeWalletAddresses?.length.toLocaleString()}
      />
      <DataRow
        name='Unique Wallets (All Time)'
        value={allWalletAddresses?.length.toLocaleString()}
      />
      {/* TODO: add wallets that have won prizes */}
      <DataRow
        name='Median Deposit Transaction'
        value={
          !!deposits ? (
            <>
              <span>
                {formatNumberForDisplay(deposits.medianValue, { maximumFractionDigits: 4 })}
              </span>{' '}
              <span className='text-sm text-pt-purple-100'>ETH</span>
            </>
          ) : undefined
        }
      />
      <DataRow
        name='Average Deposit Transaction'
        value={
          !!deposits ? (
            <>
              <span>{formatNumberForDisplay(deposits.avgValue, { maximumFractionDigits: 4 })}</span>{' '}
              <span className='text-sm text-pt-purple-100'>ETH</span>
            </>
          ) : undefined
        }
      />
    </div>
  )
}

interface DataRowProps {
  name: string
  value: ReactNode | undefined
  className?: string
}

const DataRow = (props: DataRowProps) => {
  const { name, value, className } = props

  return (
    <div className={classNames('flex justify-between items-center gap-4', className)}>
      <span>{name}</span>
      <span>{value ?? <Spinner />}</span>
    </div>
  )
}
