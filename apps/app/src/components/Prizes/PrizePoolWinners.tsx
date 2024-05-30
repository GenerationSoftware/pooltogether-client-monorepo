import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLastAwardedDrawId,
  useLastAwardedDrawTimestamps,
  usePrizeDrawWinners,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { TokenValue } from '@shared/react-components'
import { SubgraphDraw } from '@shared/types'
import { getSecondsSinceEpoch, getSimpleDate, SECONDS_PER_DAY } from '@shared/utilities'
import classNames from 'classnames'
import * as fathom from 'fathom-client'
import { atom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address } from 'viem'
import { FATHOM_EVENTS } from '@constants/config'
import { useSelectedPrizePool } from '@hooks/useSelectedPrizePool'

export const drawIdAtom = atom<number>(0)

interface PrizePoolWinnersProps {
  className?: string
}

export const PrizePoolWinners = (props: PrizePoolWinnersProps) => {
  const { className } = props

  const t = useTranslations('Prizes')

  const { selectedPrizePool } = useSelectedPrizePool()

  const { data: draws } = usePrizeDrawWinners(selectedPrizePool as PrizePool)

  const { data: lastDrawId } = useLastAwardedDrawId(selectedPrizePool as PrizePool)
  const { data: lastDrawTimestamps } = useLastAwardedDrawTimestamps(selectedPrizePool as PrizePool)

  const isLastDrawOngoing = useMemo(() => {
    if (
      !!lastDrawId &&
      !!lastDrawTimestamps?.openedAt &&
      !!draws?.length &&
      draws[draws.length - 1].id === lastDrawId
    ) {
      const currentTime = getSecondsSinceEpoch()
      const drawPeriod = lastDrawTimestamps.closedAt - lastDrawTimestamps.openedAt
      const drawFinalizedTimestamp = lastDrawTimestamps.closedAt + drawPeriod
      return drawFinalizedTimestamp > currentTime
    }
  }, [draws, lastDrawId, lastDrawTimestamps])

  const drawsToDisplay = useMemo(() => {
    if (!!draws?.length) {
      return [...draws]
        .filter((draw) => draw.prizeClaims.length > 0)
        .reverse()
        .slice(isLastDrawOngoing ? 1 : 0, isLastDrawOngoing ? 4 : 3)
    }
  }, [draws, isLastDrawOngoing])

  if (!!selectedPrizePool && !!drawsToDisplay?.length) {
    return (
      <div
        className={classNames(
          'w-full flex flex-col items-center gap-2 text-center md:gap-4',
          className
        )}
      >
        <span className='text-2xl font-grotesk text-pt-teal-dark font-medium md:text-4xl'>
          {t('recentWinners')}
        </span>
        <ul className='w-full flex flex-col items-center gap-2 text-center md:gap-4'>
          {drawsToDisplay.map((draw) => {
            return <DrawRow key={`dr-${draw.id}`} prizePool={selectedPrizePool} draw={draw} />
          })}
        </ul>
      </div>
    )
  }

  return <></>
}

interface DrawRowProps {
  prizePool: PrizePool
  draw: SubgraphDraw
}

const DrawRow = (props: DrawRowProps) => {
  const { prizePool, draw } = props

  const t = useTranslations('Prizes.drawWinners')

  const { data: tokenData } = usePrizeTokenData(prizePool)

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.drawWinners, {
    onOpen: () => fathom.trackEvent(FATHOM_EVENTS.openedDrawModal)
  })

  const setSelectedDrawId = useSetAtom(drawIdAtom)

  const { uniqueWallets, totalPrizeAmount } = useMemo(() => {
    const validPrizeClaims = draw.prizeClaims.filter((claim) => !!claim.payout)

    return {
      uniqueWallets: new Set<Address>(validPrizeClaims.map((claim) => claim.winner)),
      totalPrizeAmount: validPrizeClaims.reduce((a, b) => a + b.payout, 0n)
    }
  }, [draw])

  const handleClick = () => {
    setSelectedDrawId(draw.id)
    setIsModalOpen(true)
  }

  const firstPrizeTimestamp = draw.prizeClaims[0].timestamp
  const currentTime = getSecondsSinceEpoch()
  const timeTextType =
    firstPrizeTimestamp > currentTime - SECONDS_PER_DAY
      ? 'today'
      : firstPrizeTimestamp > currentTime - SECONDS_PER_DAY * 2
      ? 'yesterday'
      : 'onXDate'

  return (
    <div
      onClick={handleClick}
      className='inline-flex gap-4 py-1 px-2 text-lg rounded-lg cursor-pointer whitespace-nowrap hover:bg-pt-transparent md:py-2 md:px-4 md:text-3xl'
    >
      {!!tokenData && (
        <div className='inline-flex gap-2 items-center'>
          <span>{t('beforeValue', { numPeople: uniqueWallets.size })}</span>
          <span className='text-pt-purple-200'>
            <TokenValue token={{ ...tokenData, amount: totalPrizeAmount }} hideZeroes={true} />
          </span>
          {timeTextType === 'today'
            ? t('afterValue.today')
            : timeTextType === 'yesterday'
            ? t('afterValue.yesterday')
            : t('afterValue.onXDate', {
                date: getSimpleDate(firstPrizeTimestamp)
              })}
        </div>
      )}
    </div>
  )
}
