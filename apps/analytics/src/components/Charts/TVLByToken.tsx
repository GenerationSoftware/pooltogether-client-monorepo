import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { useMemo } from 'react'
import { useAllVaultTVLsByToken } from '@hooks/useAllVaultTVLsByToken'
import { PieChart, PieChartProps } from './PieChart'

interface TVLByTokenChartProps {
  prizePool: PrizePool
  className?: string
}

export const TVLByTokenChart = (props: TVLByTokenChartProps) => {
  const { prizePool, className } = props

  const { data: tvls } = useAllVaultTVLsByToken(prizePool)

  const chartData = useMemo(() => {
    const data: PieChartProps['data'] = []

    Object.entries(tvls ?? {}).forEach(([tokenAddress, tvl]) => {
      data.push({ name: tokenAddress, tvl })
    })

    return data
  }, [tvls])

  if (!chartData?.length) {
    return <></>
  }

  return (
    <div className={classNames('w-full flex flex-col font-medium text-pt-purple-200', className)}>
      <span className='ml-2'>TVL By Token</span>
      <PieChart data={chartData} radius={{ inner: '60%' }} />
    </div>
  )
}
