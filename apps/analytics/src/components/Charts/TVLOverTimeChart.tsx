import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData, useTokens } from '@generationsoftware/hyperstructure-react-hooks'
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
        const drawData: AreaChartProps['data'][number] = { name: i + 1 }

        Object.entries(vaultTVLs).forEach(([vaultId, tvls]) => {
          drawData[vaultId] = tvls[i]?.tvl ?? 0
        })

        data.push(drawData)
      }
    }

    return data
  }, [vaultTVLs])

  if (!chartData?.length || !tokens || !prizeToken) {
    return <></>
  }

  const lastDrawData = chartData[chartData.length - 1]
  const areas = Object.keys(vaultTVLs ?? {}).map((vaultId) => ({ id: vaultId, stackId: 1 }))
  const sortedAreas = areas.sort((a, b) => lastDrawData[b.id] - lastDrawData[a.id])

  return (
    <div
      className={classNames('w-full flex flex-col gap-2 font-medium text-pt-purple-800', className)}
    >
      <span className='ml-2 text-pt-purple-200'>TVL Over Time</span>
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
            const formattedName = tokens[getAddressFromVaultId(String(name))]?.name ?? '?'

            return [formattedValue, formattedName]
          },
          labelFormatter: (label) => `Draw #${label}`,
          sort: 'desc',
          labelClassName: 'pb-1',
          itemStyle: { padding: 0 }
        }}
        aspect={2}
      />
    </div>
  )
}

const getAddressFromVaultId = (vaultId: string) => {
  return vaultId.split('-')[0] as Lowercase<Address>
}
