import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { formatNumberForDisplay, getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { PPCOverTimeChart } from '@components/Charts/PPCOverTimeChart'
import { usePPCsOverTime } from '@hooks/usePPCsOverTime'
import { CategoryHeader } from './CategoryHeader'
import { StatCards } from './StatCards'

interface YieldStatsProps {
  prizePool: PrizePool
  className?: string
}

export const YieldStats = (props: YieldStatsProps) => {
  const { prizePool, className } = props

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const { data: ppcs, isFetched: isFetchedPPCs } = usePPCsOverTime(prizePool)

  const ppcsArray = useMemo(() => {
    const array = Object.entries(ppcs ?? {}).map((entry) => ({
      drawId: parseInt(entry[0]),
      ppc: entry[1]
    }))
    return array.sort((a, b) => b.drawId - a.drawId)
  }, [ppcs])

  return (
    <div className={classNames('w-full flex flex-col items-center gap-4', className)}>
      <CategoryHeader name={`${getNiceNetworkNameByChainId(prizePool.chainId)} Yield`} />
      <div className='w-full px-4 py-6 bg-pt-transparent rounded-2xl'>
        <PPCOverTimeChart prizePool={prizePool} hideFirstDraws={3} />
      </div>
      <StatCards
        cards={[
          {
            id: 'totalPPC',
            title: 'PPCs',
            subtitle: '(all time)',
            value: isFetchedPPCs
              ? formatNumberForDisplay(
                  ppcsArray.reduce((a, b) => a + b.ppc, 0),
                  { maximumFractionDigits: 4 }
                )
              : undefined,
            unit: prizeToken?.symbol
          },
          {
            id: 'monthlyPPC',
            title: 'PPCs',
            subtitle: '(last 30 draws)',
            value: isFetchedPPCs
              ? formatNumberForDisplay(
                  ppcsArray.slice(0, 30).reduce((a, b) => a + b.ppc, 0),
                  { maximumFractionDigits: 4 }
                )
              : undefined,
            unit: prizeToken?.symbol
          },
          {
            id: 'weeklyPPC',
            title: 'PPCs',
            subtitle: '(last 7 draws)',
            value: isFetchedPPCs
              ? formatNumberForDisplay(
                  ppcsArray.slice(0, 7).reduce((a, b) => a + b.ppc, 0),
                  { maximumFractionDigits: 4 }
                )
              : undefined,
            unit: prizeToken?.symbol
          }
        ]}
        className='sm:grid-cols-2 md:grid-cols-3'
      />
    </div>
  )
}
