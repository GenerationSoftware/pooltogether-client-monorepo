import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLastAwardedDrawId,
  useLastAwardedDrawTimestamps,
  usePrizeDrawWinners,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { TokenValue } from '@shared/react-components'
import { SubgraphDraw } from '@shared/types'
import { getSecondsSinceEpoch, getSimpleDate, SECONDS_PER_DAY } from '@shared/utilities'
import * as fathom from 'fathom-client'
import { atom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Address } from 'viem'
import { FATHOM_EVENTS } from '@constants/config'
import { useSelectedPrizePool } from '@hooks/useSelectedPrizePool'

export const drawIdAtom = atom<number>(0)

export const PrizePoolWinners = () => {
  const t_common = useTranslations('Common')
  const t_prizes = useTranslations('Prizes')

  const { selectedPrizePool } = useSelectedPrizePool()

  const { data: draws } = usePrizeDrawWinners(selectedPrizePool as PrizePool)

  const { data: lastDrawId } = useLastAwardedDrawId(selectedPrizePool as PrizePool)
  const { data: lastDrawTimestamps } = useLastAwardedDrawTimestamps(selectedPrizePool as PrizePool)

  const baseNumDraws = 6
  const [numDraws, setNumDraws] = useState<number>(baseNumDraws)

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

  if (!!selectedPrizePool && !!draws && draws.length > 0) {
    return (
      <div className='flex flex-col w-full max-w-2xl gap-4 items-center px-6 py-8 bg-pt-transparent rounded-lg md:px-11'>
        <span className='font-semibold md:text-xl'>{t_prizes('recentWinners')}</span>
        <ul className='flex flex-col w-full max-w-2xl pl-2 md:pl-1'>
          {[...draws]
            .filter((draw) => draw.prizeClaims.length > 0)
            .reverse()
            .slice(0, numDraws)
            .map((draw) => {
              return (
                <DrawRow
                  key={`dr-${draw.id}`}
                  prizePool={selectedPrizePool}
                  draw={draw}
                  isOngoing={draw.id === lastDrawId ? isLastDrawOngoing : false}
                />
              )
            })}
        </ul>
        {draws.length > numDraws && (
          <span
            className='text-pt-purple-200 cursor-pointer md:font-semibold'
            onClick={() => setNumDraws(numDraws + baseNumDraws)}
          >
            {t_common('showMore')}
          </span>
        )}
        {isLastDrawOngoing && (
          <span className='inline-flex gap-1 items-center text-xs text-pt-pink-dark'>
            <ClockIcon className='h-5 w-5' /> {t_prizes('drawWinners.drawIsOngoing')}
          </span>
        )}
      </div>
    )
  }

  return <></>
}

interface DrawRowProps {
  prizePool: PrizePool
  draw: SubgraphDraw
  isOngoing?: boolean
}

// TODO: highlight draws with grand prizes awarded
const DrawRow = (props: DrawRowProps) => {
  const { prizePool, draw, isOngoing } = props

  const t_common = useTranslations('Common')
  const t_prizes = useTranslations('Prizes')

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
      className='inline-flex gap-4 justify-between pl-3 pr-1 py-2 font-semibold text-pt-purple-100 rounded-lg cursor-pointer whitespace-nowrap hover:bg-pt-transparent'
    >
      <div className='inline-flex gap-1 items-center'>
        <span>{t_common('drawId', { id: draw.id })}</span>
        {isOngoing && <ClockIcon className='h-5 w-5 text-pt-pink-dark' />}
      </div>
      {!!tokenData && (
        <div className='inline-flex gap-1 items-center'>
          <span className='hidden md:block'>
            {t_prizes('drawWinners.beforeValue', { numWallets: uniqueWallets.size })}{' '}
          </span>
          <span className='text-pt-purple-50'>
            <TokenValue token={{ ...tokenData, amount: totalPrizeAmount }} />
          </span>{' '}
          {timeTextType === 'today'
            ? t_prizes('drawWinners.afterValue.today')
            : timeTextType === 'yesterday'
            ? t_prizes('drawWinners.afterValue.yesterday')
            : t_prizes('drawWinners.afterValue.onXDate', {
                date: getSimpleDate(firstPrizeTimestamp)
              })}{' '}
          <ChevronRightIcon className='h-5 w-5' />
        </div>
      )}
      {!tokenData && <>-</>}
    </div>
  )
}
