import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useTokens } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { lower } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAllVaultTVLsByToken } from '@hooks/useAllVaultTVLsByToken'
import { PieChart, PieChartProps } from './PieChart'

interface TVLByTokenChartProps {
  prizePool: PrizePool
  className?: string
}

export const TVLByTokenChart = (props: TVLByTokenChartProps) => {
  const { prizePool, className } = props

  const { data: tvls } = useAllVaultTVLsByToken(prizePool)

  const { data: tokens } = useTokens(
    prizePool.chainId,
    Object.keys(tvls ?? {}) as Lowercase<Address>[]
  )

  const chartData = useMemo(() => {
    const data: PieChartProps['data'] = []

    Object.entries(tvls ?? {}).forEach(([tokenAddress, tvl]) => {
      data.push({ name: tokenAddress, tvl })
    })

    return data.sort((a, b) => b.tvl - a.tvl)
  }, [tvls])

  const isReady = !!chartData?.length && !!tokens

  return (
    <div className={classNames('w-full flex flex-col font-medium text-pt-purple-800', className)}>
      <span className='ml-2 text-pt-purple-100 font-bold'>TVL By Token</span>
      {isReady ? (
        <PieChart
          data={chartData}
          radius={{ inner: '60%' }}
          label={{
            show: true,
            nameFormatter: (name) => tokens[lower(name)]?.symbol ?? '?',
            center: true
          }}
          animate={true}
        />
      ) : (
        <div className='w-full aspect-square flex items-center justify-center'>
          <Spinner />
        </div>
      )}
    </div>
  )
}
