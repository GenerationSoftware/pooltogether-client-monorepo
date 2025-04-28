import {
  useAllGrandPrizes,
  useAllPrizeTokenPrices
} from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import Link from 'next/link'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { PrizePoolCard } from './PrizePoolCard'

export const PrizePoolCards = () => {
  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)
  const numPrizePools = prizePoolsArray.length

  const { data: allGrandPrizes } = useAllGrandPrizes(prizePoolsArray, {
    useCurrentPrizeSizes: true
  })

  const { data: allPrizeTokenPrices } = useAllPrizeTokenPrices(prizePoolsArray)

  const sortedPrizePools = useMemo(() => {
    return [...prizePoolsArray].sort((a, b) => {
      const aGP =
        parseFloat(
          formatUnits(allGrandPrizes?.[a.id]?.amount ?? 0n, allGrandPrizes?.[a.id]?.decimals ?? 18)
        ) * (allPrizeTokenPrices[a.id]?.price ?? 0)
      const bGP =
        parseFloat(
          formatUnits(allGrandPrizes?.[b.id]?.amount ?? 0n, allGrandPrizes?.[b.id]?.decimals ?? 18)
        ) * (allPrizeTokenPrices[b.id]?.price ?? 0)

      return bGP - aGP
    })
  }, [prizePoolsArray, allGrandPrizes, allPrizeTokenPrices])

  return (
    <div
      className={classNames(
        'flex flex-col w-full items-center gap-4 rounded-lg md:grid md:w-auto md:p-4',
        {
          'grid-cols-1': numPrizePools === 1,
          'grid-cols-2': numPrizePools === 2 || numPrizePools === 4,
          'grid-cols-3': numPrizePools === 3 || numPrizePools >= 5
        }
      )}
    >
      {sortedPrizePools.map((prizePool) => (
        <Link
          key={`pp-${prizePool.id}`}
          href={`/prizes?network=${prizePool.chainId}`}
          className='w-full'
        >
          <PrizePoolCard
            prizePool={prizePool}
            className='w-full hover:bg-pt-purple-50/20 md:w-auto md:min-w-[22rem]'
          />
        </Link>
      ))}
    </div>
  )
}
