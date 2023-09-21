import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { SubgraphPrize } from '@shared/types'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { AccountWinCard } from './AccountWinCard'

interface AccountWinCardsProps {
  wins: (SubgraphPrize & { chainId: number })[]
  prizePools: PrizePool[]
  className?: string
}

export const AccountWinCards = (props: AccountWinCardsProps) => {
  const { wins, prizePools, className } = props

  const t = useTranslations('Common')

  const baseNumWins = 10
  const [numWins, setNumWins] = useState<number>(baseNumWins)

  return (
    <div className={classNames('w-full flex flex-col gap-4', className)}>
      {wins.slice(0, numWins).map((win) => {
        const prizePool = prizePools.find((prizePool) => prizePool.chainId === win.chainId)
        if (!!prizePool) {
          return <AccountWinCard key={win.id} win={win} prizePool={prizePool} />
        }
      })}
      {wins.length > numWins && (
        <span
          className='w-full flex justify-center text-pt-purple-300 cursor-pointer'
          onClick={() => setNumWins(numWins + baseNumWins)}
        >
          {t('showMore')}
        </span>
      )}
    </div>
  )
}
