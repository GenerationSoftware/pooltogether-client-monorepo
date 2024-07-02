import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { usePPCsOverTime } from '@hooks/usePPCsOverTime'
import { BarChart, BarChartProps } from './BarChart'

interface PPCOverTimeChartProps {
  prizePool: PrizePool
  className?: string
}

export const PPCOverTimeChart = (props: PPCOverTimeChartProps) => {
  const { prizePool, className } = props

  const { data: ppcs } = usePPCsOverTime(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const chartData = useMemo(() => {
    const data: BarChartProps['data'] = []

    if (!!ppcs) {
      Object.entries(ppcs).forEach((entry) => {
        data.push({ name: parseInt(entry[0]), ppc: entry[1] })
      })
    }

    return data
  }, [ppcs])

  if (!chartData?.length || !prizeToken) {
    return <></>
  }

  return (
    <div
      className={classNames('w-full flex flex-col gap-2 font-medium text-pt-purple-800', className)}
    >
      <span className='ml-2 text-pt-purple-200'>PPCs Over Time</span>
      <BarChart
        data={chartData}
        bars={[{ id: 'ppc' }]}
        tooltip={{
          show: true,
          formatter: (value) => [
            `${formatNumberForDisplay(value, { maximumFractionDigits: 4 })} ${prizeToken.symbol}`,
            'PPC'
          ],
          labelFormatter: (label) => `Draw #${label}`
        }}
      />
    </div>
  )
}
