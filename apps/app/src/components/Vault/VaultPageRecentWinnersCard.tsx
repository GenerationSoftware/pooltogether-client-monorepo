import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { SortIcon } from '@shared/react-components'
import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import {
  formatBigIntForDisplay,
  getSimpleDate,
  lower,
  shorten,
  sortByBigIntDesc
} from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ReactNode, useMemo, useState } from 'react'
import { Address } from 'viem'
import { WALLET_NAMES } from '@constants/config'
import { useRecentWins } from '@hooks/useRecentWins'
import { VaultPageCard } from './VaultPageCard'

type SortId = 'timestamp' | 'amount'

interface VaultPageRecentWinnersCardProps {
  vault: Vault
  prizePool: PrizePool
  className?: string
}

export const VaultPageRecentWinnersCard = (props: VaultPageRecentWinnersCardProps) => {
  const { vault, prizePool, className } = props

  const t_common = useTranslations('Common')
  const t_vault = useTranslations('Vault')
  const t_prizes = useTranslations('Prizes')

  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(prizePool)

  const { data: recentWins, isFetched: isFetchedRecentWins } = useRecentWins(prizePool, {
    vaultAddress: vault.address
  })

  const baseNumWinners = 6
  const [isExpanded, setIsExpanded] = useState(false)

  const [sortBy, setSortBy] = useState<SortId>('timestamp')
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')

  const handleHeaderClick = (id: SortId) => {
    if (sortBy === id) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortDirection('desc')
      setSortBy(id)
    }
  }

  const getDirection = (id: SortId) => {
    if (sortBy === id) {
      return sortDirection
    }
  }

  const sortedWins = useMemo(() => {
    if (recentWins === undefined) return []

    if (sortBy === 'timestamp') {
      const sortedByTimestamp = [...recentWins].sort((a, b) => b.timestamp - a.timestamp)
      return sortDirection === 'desc' ? sortedByTimestamp : sortedByTimestamp.reverse()
    } else if (sortBy === 'amount') {
      const sortedByAmount = [...recentWins].sort((a, b) => sortByBigIntDesc(a.payout, b.payout))
      return sortDirection === 'desc' ? sortedByAmount : sortedByAmount.reverse()
    } else {
      return recentWins
    }
  }, [recentWins, sortBy, sortDirection])

  const winsToDisplay = sortedWins.slice(0, isExpanded ? sortedWins.length : baseNumWinners)

  const isFetched = !!isFetchedPrizeToken && !!prizeToken && !!isFetchedRecentWins && !!recentWins

  return (
    <VaultPageCard
      title={t_prizes('recentWinners')}
      className='grow'
      wrapperClassName={classNames('w-full h-auto min-h-[20rem] md:px-16', className)}
    >
      <div className='w-full grow flex flex-col gap-2 items-center justify-center'>
        {isFetched ? (
          !!sortedWins.length ? (
            <>
              <div
                className={classNames('w-full grid grid-cols-3 font-semibold text-pt-purple-300', {
                  'md:pr-8': isExpanded
                })}
              >
                <span className='text-left'>{t_prizes('drawModal.winner')}</span>
                <SortableHeader
                  onClick={() => handleHeaderClick('timestamp')}
                  direction={getDirection('timestamp')}
                  className='justify-center'
                >
                  {t_common('date')}
                </SortableHeader>
                <SortableHeader
                  onClick={() => handleHeaderClick('amount')}
                  direction={getDirection('amount')}
                  className='justify-end text-right'
                >
                  {t_prizes('prize')}
                </SortableHeader>
              </div>
              <div
                className={classNames('w-full flex flex-col gap-2', {
                  'max-h-80 overflow-auto md:pr-4': isExpanded
                })}
              >
                {winsToDisplay.map((win) => (
                  <WinnerRow key={`win-${win.id}`} {...win} prizeToken={prizeToken} />
                ))}
              </div>
              {!isExpanded && sortedWins.length > baseNumWinners && (
                <span
                  className='w-full flex justify-center text-pt-purple-300 cursor-pointer'
                  onClick={() => setIsExpanded(true)}
                >
                  {t_common('showMore')}
                </span>
              )}
            </>
          ) : (
            <span className='text-sm text-pt-purple-100 md:text-base'>
              {t_vault('noWinnersYet')}
            </span>
          )
        ) : (
          <Spinner />
        )}
      </div>
    </VaultPageCard>
  )
}

interface SortableHeaderProps {
  onClick: () => void
  direction?: 'desc' | 'asc'
  children: ReactNode
  className?: string
}

const SortableHeader = (props: SortableHeaderProps) => {
  const { onClick, direction, children, className } = props

  return (
    <div
      onClick={onClick}
      className={classNames('flex gap-1 items-center cursor-pointer select-none', className)}
    >
      <SortIcon direction={direction} className='w-4 h-auto shrink-0' />
      {children}
    </div>
  )
}

interface WinnerRowProps {
  winner: Address
  timestamp: number
  payout: bigint
  prizeToken: Token
}

const WinnerRow = (props: WinnerRowProps) => {
  const { winner, timestamp, payout, prizeToken } = props

  const formattedWinner = WALLET_NAMES[lower(winner)]?.name ?? shorten(winner)
  const formattedPrize = formatBigIntForDisplay(payout, prizeToken.decimals, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  })

  return (
    <div className='w-full grid grid-cols-3 text-sm md:text-base'>
      <span className='text-left'>
        <Link href={`/account/${winner}`}>
          <button className='font-[monospace] hover:text-pt-purple-100'>{formattedWinner}</button>
        </Link>
      </span>
      <span>{getSimpleDate(timestamp)}</span>
      <span className='text-right'>
        {formattedPrize === '0.0000' ? '< 0.0001' : formattedPrize} {prizeToken.symbol}
      </span>
    </div>
  )
}
