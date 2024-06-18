import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawWinners,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { formatBigIntForDisplay, getSimpleDate, lower, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { Address } from 'viem'
import { WALLET_NAMES } from '@constants/config'
import { VaultPageCard } from './VaultPageCard'

interface VaultPageRecentWinnersCardProps {
  vault: Vault
  prizePool: PrizePool
  className?: string
}

// TODO: make date and prize columns sortable
export const VaultPageRecentWinnersCard = (props: VaultPageRecentWinnersCardProps) => {
  const { vault, prizePool, className } = props

  // TODO: move translations to better/neutral locations
  const t_prizes = useTranslations('Prizes')
  const t_account = useTranslations('Account')

  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(prizePool)

  const { data: draws, isFetched: isFetchedDraws } = usePrizeDrawWinners(prizePool)

  const wins = useMemo(() => {
    const groupedWins: { winner: Lowercase<Address>; timestamp: number; amount: bigint }[] = []

    draws?.forEach((draw) => {
      const validPrizeClaims = draw.prizeClaims.filter(
        (claim) => !!claim.payout && lower(claim.vaultAddress) === lower(vault.address)
      )

      validPrizeClaims.forEach((win) => {
        const existingWinIndex = groupedWins.findIndex(
          (w) => w.winner === lower(win.winner) && w.timestamp === win.timestamp
        )

        if (existingWinIndex !== -1) {
          groupedWins[existingWinIndex].amount += win.payout
        } else {
          groupedWins.push({
            winner: lower(win.winner),
            timestamp: win.timestamp,
            amount: win.payout
          })
        }
      })
    })

    return groupedWins
  }, [vault, draws])

  const sortedWins = useMemo(() => {
    return wins.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6)
  }, [wins])

  if (!isFetchedPrizeToken || !prizeToken || !isFetchedDraws || !draws || !sortedWins.length) {
    return <></>
  }

  return (
    <VaultPageCard
      title={t_prizes('recentWinners')}
      wrapperClassName={classNames('w-full md:px-16', className)}
    >
      <div className='w-full grid grid-cols-3 font-semibold text-pt-purple-300'>
        <span className='text-left'>{t_prizes('drawModal.winner')}</span>
        <span>{t_account('winHeaders.date')}</span>
        <span className='text-right'>{t_prizes('prize')}</span>
      </div>
      {sortedWins.map(({ winner, timestamp, amount }) => {
        const formattedWinner = WALLET_NAMES[lower(winner)]?.name ?? shorten(winner)
        const formattedPrize = formatBigIntForDisplay(amount, prizeToken.decimals, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4
        })

        return (
          <div
            key={`prize-${winner}-${timestamp}`}
            className='w-full grid grid-cols-3 text-sm md:text-base'
          >
            <span className='text-left'>
              <Link href={`/account/${winner}`}>
                <button className='hover:text-pt-purple-100'>{formattedWinner}</button>
              </Link>
            </span>
            <span>{getSimpleDate(timestamp)}</span>
            <span className='text-right'>
              {formattedPrize === '0.0000' ? '< 0.0001' : formattedPrize} {prizeToken.symbol}
            </span>
          </div>
        )
      })}
    </VaultPageCard>
  )
}
