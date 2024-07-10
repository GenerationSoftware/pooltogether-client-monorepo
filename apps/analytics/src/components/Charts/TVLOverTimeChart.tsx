import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData, useTokens } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAllVaultTVLsOverTime } from '@hooks/useAllVaultTVLsOverTime'
import { AreaChart, AreaChartProps } from './AreaChart'

interface TVLOverTimeChartProps {
  prizePool: PrizePool
  className?: string
}

export const TVLOverTimeChart = (props: TVLOverTimeChartProps) => {
  const { prizePool, className } = props

  const { data: vaultTVLs } = useAllVaultTVLsOverTime(prizePool)

  const vaultAddresses = Object.keys(vaultTVLs ?? {}).map(getAddressFromVaultId)
  const { data: tokens } = useTokens(prizePool.chainId, vaultAddresses)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const chartData = useMemo(() => {
    const data: AreaChartProps['data'] = []

    if (!!vaultTVLs && !!Object.keys(vaultTVLs).length) {
      const numDrawIds = Object.values(vaultTVLs)[0].length

      for (let i = 0; i < numDrawIds; i++) {
        const drawData: AreaChartProps['data'][number] = { name: `#${i + 1}` }
        let totalTvl = 0

        Object.entries(vaultTVLs).forEach(([vaultId, tvls]) => {
          const tvl = tvls[i]?.tvl ?? 0

          drawData[vaultId] = tvl
          totalTvl += tvl
        })

        drawData['total'] = totalTvl

        data.push(drawData)
      }
    }

    return data
  }, [vaultTVLs])

  const isReady = !!chartData?.length && !!tokens && !!prizeToken

  const lastDrawData = chartData[chartData.length - 1]
  const vaultIds = Object.keys(vaultTVLs ?? {})
  const areas: AreaChartProps['areas'] = vaultIds.map((vaultId) => ({
    id: vaultId,
    stackId: 1,
    animate: true
  }))
  const sortedAreas: AreaChartProps['areas'] = [
    ...areas.sort((a, b) => lastDrawData[b.id] - lastDrawData[a.id]),
    { id: 'total', stroke: '#36147d', opacity: 0 }
  ]

  return (
    <div
      className={classNames('w-full flex flex-col gap-2 font-medium text-pt-purple-800', className)}
    >
      <span className='ml-2 text-pt-purple-100 font-bold'>TVL Over Time</span>
      {isReady ? (
        <AreaChart
          data={chartData}
          areas={sortedAreas}
          tooltip={{
            show: true,
            formatter: (value, name) => {
              if (value < 0.001) return []

              const formattedValue = `${formatNumberForDisplay(value, {
                maximumFractionDigits: 3
              })} ${prizeToken.symbol}`
              const formattedName =
                name === 'total'
                  ? 'Total TVL'
                  : tokens[getAddressFromVaultId(String(name))]?.name ?? '?'

              return [formattedValue, formattedName]
            },
            labelFormatter: (label) => `Draw ${label}`,
            sort: 'desc',
            labelClassName: 'pb-1',
            itemStyle: { padding: 0 }
          }}
          xAxis={{ minTickGap: 25 }}
          aspect={2}
        />
      ) : (
        <div className='w-full aspect-[2] flex items-center justify-center'>
          <Spinner />
        </div>
      )}
    </div>
  )
}

const getAddressFromVaultId = (vaultId: string) => {
  return vaultId.split('-')[0] as Lowercase<Address>
}
