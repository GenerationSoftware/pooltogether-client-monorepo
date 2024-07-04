import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawWinners,
  useWalletAddresses
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay, lower } from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { Address } from 'viem'
import { useDeposits } from '@hooks/useDeposits'

interface WalletsCardProps {
  prizePool: PrizePool
  className?: string
}

export const WalletsCard = (props: WalletsCardProps) => {
  const { prizePool, className } = props

  const { data: allWalletAddresses } = useWalletAddresses(prizePool)
  const { data: activeWalletAddresses } = useWalletAddresses(prizePool, { activeWalletsOnly: true })

  const { data: draws } = usePrizeDrawWinners(prizePool)

  const winnerWalletAddresses = useMemo(() => {
    if (!!draws) {
      const walletAddresses = new Set<Lowercase<Address>>()

      draws.forEach((draw) => {
        draw.prizeClaims.forEach((claim) => {
          walletAddresses.add(lower(claim.winner))
        })
      })

      return [...walletAddresses]
    }
  }, [draws])

  const { data: deposits } = useDeposits(prizePool)

  return (
    <div className={classNames('flex flex-col p-4 bg-pt-transparent rounded-2xl', className)}>
      <span className='text-pt-purple-400'>Users</span>
      <DataRow
        name='Unique Wallets (All Time)'
        value={allWalletAddresses?.length.toLocaleString()}
      />
      <DataRow
        name='Unique Wallets (Currently Deposited)'
        value={activeWalletAddresses?.length.toLocaleString()}
      />
      <DataRow
        name='Unique Wallets (Prizes Won)'
        value={winnerWalletAddresses?.length.toLocaleString()}
      />
      <hr className='my-2 border-pt-purple-200/50' />
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
