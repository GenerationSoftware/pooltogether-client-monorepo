import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawPeriod,
  useFirstDrawOpenedAt,
  usePrizeTokenData,
  useVaultContributionEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { Card, Spinner } from '@shared/ui'
import { lower } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { formatUnits } from 'viem'
import { QUERY_START_BLOCK } from '@constants/config'

interface VaultPageContributionsCardProps {
  vault: Vault
  prizePool: PrizePool
  className?: string
}

export const VaultPageContributionsCard = (props: VaultPageContributionsCardProps) => {
  const { vault, prizePool, className } = props

  const t_vault = useTranslations('Vault')
  const t_abbr = useTranslations('Abbreviations')

  const numDaysOptions: number[] = [7, 30]

  const [numDays, setNumDays] = useState<number>(numDaysOptions[0])

  const CardHeader = () => (
    <div className='flex items-center gap-2 text-pt-purple-300 font-semibold'>
      {/* TODO: add tooltip */}
      <span className='grow text-xl md:text-2xl'>{t_vault('headers.contributions')}</span>
      {numDaysOptions.map((option) => (
        <button
          key={`numDaysOption-${option}`}
          onClick={() => setNumDays(option)}
          className={classNames(
            'p-2 text-lg rounded-lg border hover:bg-pt-transparent md:text-xl',
            {
              'text-pt-purple-50 bg-pt-transparent border-pt-transparent': numDays === option,
              'border-transparent': numDays !== option
            }
          )}
        >
          {option} {t_abbr('days')}
        </button>
      ))}
    </div>
  )

  return (
    <Card wrapperClassName={classNames('w-full', className)}>
      <CardHeader />
      <ContributionsChart vault={vault} prizePool={prizePool} numDays={numDays} />
    </Card>
  )
}

interface ContributionsChartProps {
  vault: Vault
  prizePool: PrizePool
  numDays: number
  className?: string
}

const ContributionsChart = (props: ContributionsChartProps) => {
  const { vault, prizePool, numDays, className } = props

  const { data: contributionEvents } = useVaultContributionEvents(prizePool, {
    vaultAddress: lower(vault.address),
    fromBlock: QUERY_START_BLOCK[vault.chainId as keyof typeof QUERY_START_BLOCK]
  })

  const { data: firstDrawOpenTimestamp } = useFirstDrawOpenedAt(prizePool)
  const { data: drawPeriod } = useDrawPeriod(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const chartData = useMemo(() => {
    if (!!contributionEvents && !!firstDrawOpenTimestamp && !!drawPeriod && !!prizeToken) {
      const data: { name: string; amount: number }[] = []

      const drawContributions: { [drawId: number]: bigint } = {}
      contributionEvents.forEach(({ args: { drawId, amount } }) => {
        if (drawContributions[drawId] === undefined) {
          drawContributions[drawId] = amount
        } else {
          drawContributions[drawId] += amount
        }
      })

      Object.entries(drawContributions).forEach(([strDrawId, rawAmount]) => {
        const drawOpenTimestamp = firstDrawOpenTimestamp + (Number(strDrawId) - 1) * drawPeriod
        const date = new Date(drawOpenTimestamp * 1e3)
        const name = `${date.getDate()}/${date.getMonth() + 1}`
        const amount = parseFloat(formatUnits(rawAmount, prizeToken.decimals))

        data.push({ name, amount })
      })

      return data.slice(Math.max(0, data.length - numDays))
    }
  }, [contributionEvents, firstDrawOpenTimestamp, drawPeriod, prizeToken, numDays])

  // TODO: add empty state (all data fetched but no contributions in the last numDays)
  return (
    <div
      className={classNames('w-full aspect-[16/11] flex items-center justify-center', className)}
    >
      {!!chartData && !!prizeToken ? (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis dataKey='name' stroke='#9CA3AF' />
            {/* TODO: improve y axis domain */}
            <YAxis stroke='#9CA3AF' tickFormatter={(tick) => `${tick} ${prizeToken.symbol}`} />
            <Bar dataKey='amount' fill='#6538C1' isAnimationActive={false} />
            {/* TODO: add tooltip without annoying bg (set in Bar component) */}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
