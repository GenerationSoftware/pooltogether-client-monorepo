import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawWinners,
  useWalletAddresses
} from '@generationsoftware/hyperstructure-react-hooks'
import { getNiceNetworkNameByChainId, lower } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { CategoryHeader } from './CategoryHeader'
import { StatCards } from './StatCards'

interface UserStatsProps {
  prizePool: PrizePool
  className?: string
}

export const UserStats = (props: UserStatsProps) => {
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

  return (
    <div className={classNames('w-full flex flex-col items-center gap-4', className)}>
      <CategoryHeader name={`${getNiceNetworkNameByChainId(prizePool.chainId)} Users`} />
      <StatCards
        cards={[
          {
            id: 'allTimeUniqueWallets',
            title: 'Unique Wallets',
            subtitle: '(all time)',
            value: allWalletAddresses?.length.toLocaleString()
          },
          {
            id: 'depositedUniqueWallets',
            title: 'Unique Wallets',
            subtitle: '(currently deposited)',
            value: activeWalletAddresses?.length.toLocaleString()
          },
          {
            id: 'winnerUniqueWallets',
            title: 'Unique Wallets',
            subtitle: '(prizes won)',
            value: winnerWalletAddresses?.length.toLocaleString()
          }
        ]}
        className='sm:grid-cols-2 md:grid-cols-3'
      />
    </div>
  )
}
