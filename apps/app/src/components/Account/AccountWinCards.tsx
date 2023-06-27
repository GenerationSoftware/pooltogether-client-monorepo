import { PrizePool, SubgraphPrizePoolAccount } from '@pooltogether/hyperstructure-client-js'
import classNames from 'classnames'
import { AccountWinCard } from './AccountWinCard'

interface AccountWinCardsProps {
  wins: (SubgraphPrizePoolAccount['prizesReceived'][0] & { chainId: number })[]
  prizePools: PrizePool[]
  className?: string
}

export const AccountWinCards = (props: AccountWinCardsProps) => {
  const { wins, prizePools, className } = props

  return (
    <div className={classNames('w-full flex flex-col gap-4', className)}>
      {wins.map((win) => {
        const prizePool = prizePools.find((prizePool) => prizePool.chainId === win.chainId)
        if (!!prizePool) {
          return <AccountWinCard key={win.id} win={win} prizePool={prizePool} />
        }
      })}
    </div>
  )
}
