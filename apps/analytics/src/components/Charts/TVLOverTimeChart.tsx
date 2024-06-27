import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { useMemo } from 'react'
import { useAllVaultTVLsOverTime } from '@hooks/useAllVaultTVLsOverTime'
import { AreaChart } from './AreaChart'

interface TVLOverTimeChartProps {
  prizePool: PrizePool
  className?: string
}

export const TVLOverTimeChart = (props: TVLOverTimeChartProps) => {
  const { prizePool, className } = props

  const { data: vaultTVLs, isFetched } = useAllVaultTVLsOverTime(prizePool)

  const chartData = useMemo(() => {
    // TODO
    return []
  }, [])

  const chartAreas = useMemo(() => {
    // TODO
    return []
  }, [])

  if (!chartData?.length) {
    return <></>
  }

  return (
    <div
      className={classNames('w-full flex flex-col gap-2 font-medium text-pt-purple-200', className)}
    >
      <span className='ml-2'>TVL Over Time</span>
      <AreaChart data={chartData} areas={chartAreas} />
    </div>
  )
}
