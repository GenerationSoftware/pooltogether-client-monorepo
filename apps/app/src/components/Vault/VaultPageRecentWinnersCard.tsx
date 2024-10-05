import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeDrawWinners,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { SortIcon } from '@shared/react-components'
import { Token } from '@shared/types'
import { Button, Spinner } from '@shared/ui'
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

  const [sortBy, setSortBy] = useState<SortId>('timestamp')
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
  const [showMore, setShowMore] = useState(false)

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

  const initialSortedByTimestamp = useMemo(() => {
    const recentWins = [...wins].sort((a, b) => b.timestamp - a.timestamp)
    return recentWins
  }, [wins])

  const sortedWins = useMemo(() => {
    const sortedByTimestamp = [...initialSortedByTimestamp]
    let finalSortedWins
    if (sortBy === 'timestamp') {
      finalSortedWins = sortDirection === 'desc' ? sortedByTimestamp : sortedByTimestamp.reverse()
    } else if (sortBy === 'amount') {
      const sortedByAmount = [...sortedByTimestamp].sort((a, b) =>
        sortByBigIntDesc(a.amount, b.amount)
      )
      finalSortedWins = sortDirection === 'desc' ? sortedByAmount : sortedByAmount.reverse()
    } else {
      finalSortedWins = sortedByTimestamp
    }

    if (!showMore) finalSortedWins = finalSortedWins.slice(0, 6)
    return finalSortedWins
  }, [initialSortedByTimestamp, sortBy, sortDirection, showMore])

  const isFetched = !!isFetchedPrizeToken && !!prizeToken && !!isFetchedDraws && !!draws

  return (
    <VaultPageCard
      title={t_prizes('recentWinners')}
      wrapperClassName={classNames('w-full  h-auto min-h-[300px] md:px-16', className)}
    >
      {isFetched ? (
        sortedWins.length ? (
          <div className='w-full grow flex flex-col gap-2'>
            <div
              className={classNames(
                'w-full grid grid-cols-3 font-semibold text-pt-purple-300 transition-all duration-700 ease-in-out',
                showMore && 'pr-6'
              )}
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
                className={`justify-end text-right`}
              >
                {t_prizes('prize')}
              </SortableHeader>
            </div>

            <div
              className={classNames(
                'flex flex-col gap-2 flex-1 max overflow-y-auto transition-all duration-700 ease-in-out max-h-80',
                showMore && 'pr-2'
              )}
            >
              {sortedWins.map((win) => (
                <WinnerRow
                  key={`prize-${win.winner}-${win.timestamp}`}
                  {...win}
                  prizeToken={prizeToken}
                />
              ))}
            </div>
            <Button
              size='sm'
              onClick={() => setShowMore(!showMore)}
              className='w-fit mt-2 mx-auto flex gap-1 justify-self-end'
            >
              {showMore ? (
                <>
                  <span className='flex-1'>{t_common('showLess')}</span>
                  <ChevronUpIcon className='w-4 h-4' />
                </>
              ) : (
                <>
                  <span className='flex-1'>{t_common('showMore')}</span>
                  <ChevronDownIcon className='w-4 h-4' />
                </>
              )}
            </Button>
          </div>
        ) : (
          <span className='text-sm text-pt-purple-100 md:text-base'>{t_vault('noWinnersYet')}</span>
        )
      ) : (
        <Spinner />
      )}
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
  amount: bigint
  prizeToken: Token
}

const WinnerRow = (props: WinnerRowProps) => {
  const { winner, timestamp, amount, prizeToken } = props

  const formattedWinner = WALLET_NAMES[lower(winner)]?.name ?? shorten(winner)
  const formattedPrize = formatBigIntForDisplay(amount, prizeToken.decimals, {
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
