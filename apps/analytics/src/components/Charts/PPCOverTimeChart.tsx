import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner, Toggle } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { usePPCsOverTime } from '@hooks/usePPCsOverTime'
import { BarChart, BarChartProps } from './BarChart'

interface PPCOverTimeChartProps {
  prizePool: PrizePool
  hideFirstDraws?: number
  className?: string
}

export const PPCOverTimeChart = (props: PPCOverTimeChartProps) => {
  const { prizePool, hideFirstDraws, className } = props

  const { data: ppcs } = usePPCsOverTime(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const [isHidingFirstDraws, setIsHidingFirstDraws] = useState<boolean>(true)

  const chartData = useMemo(() => {
    const data: BarChartProps['data'] = []

    if (!!ppcs) {
      Object.entries(ppcs).forEach((entry, i) => {
        if (
          !hideFirstDraws ||
          !isHidingFirstDraws ||
          Object.keys(ppcs).length <= hideFirstDraws ||
          i >= hideFirstDraws
        ) {
          data.push({ name: `#${parseInt(entry[0])}`, ppc: entry[1] })
        }
      })
    }

    return data
  }, [ppcs, hideFirstDraws, isHidingFirstDraws])

  const isReady = !!chartData?.length && !!prizeToken

  return (
    <div
      className={classNames('w-full flex flex-col gap-2 font-medium text-pt-purple-800', className)}
    >
      <span className='ml-2 text-pt-purple-100 font-bold'>PPCs Over Time</span>
      {isReady ? (
        <BarChart
          data={chartData}
          bars={[{ id: 'ppc', animate: true }]}
          tooltip={{
            show: true,
            formatter: (value) => [
              `${formatNumberForDisplay(value, { maximumFractionDigits: 4 })} ${prizeToken.symbol}`,
              'PPC'
            ],
            labelFormatter: (label) => `Draw ${label}`
          }}
          xAxis={{ minTickGap: 50 }}
        />
      ) : (
        <div className='w-full aspect-[2.8] flex items-center justify-center'>
          <Spinner />
        </div>
      )}
      {isReady && !!hideFirstDraws && (
        <Toggle
          checked={!isHidingFirstDraws}
          onChange={() => setIsHidingFirstDraws(!isHidingFirstDraws)}
          size='sm'
          label={`${isHidingFirstDraws ? 'Show' : 'Hide'} first ${hideFirstDraws} draws`}
          className='ml-8'
          labelClassName='text-pt-purple-200/60'
        />
      )}
    </div>
  )
}
