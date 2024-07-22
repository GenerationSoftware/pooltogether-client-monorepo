import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawPeriod,
  useFirstDrawOpenedAt,
  usePrizeTokenData,
  useVaultContributionEvents
} from '@generationsoftware/hyperstructure-react-hooks'
import { VaultContributionsTooltip } from '@shared/react-components'
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
  const t_tooltips = useTranslations('Tooltips')

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const [numDays, setNumDays] = useState<number | undefined>(7)

  return (
    <Card className='gap-4' wrapperClassName={classNames('w-full', className)}>
      <div className='flex flex-col items-center gap-2 text-pt-purple-300 font-semibold md:flex-row'>
        <span className='grow flex items-center gap-2 text-xl md:text-2xl'>
          <span>{t_vault('headers.contributions')}</span>
          <VaultContributionsTooltip tokenSymbol={prizeToken?.symbol ?? '?'} intl={t_tooltips} />
        </span>
        <div className='flex items-center gap-2'>
          <NumDaysOptionButton onClick={setNumDays} numDays={numDays} option={7} />
          <NumDaysOptionButton onClick={setNumDays} numDays={numDays} option={30} />
          <NumDaysOptionButton onClick={setNumDays} numDays={numDays} />
        </div>
      </div>
      <ContributionsChart vault={vault} prizePool={prizePool} numDays={numDays} />
    </Card>
  )
}

interface NumDaysOptionButtonProps {
  onClick: (val?: number) => void
  numDays: number | undefined
  option?: number
}

const NumDaysOptionButton = (props: NumDaysOptionButtonProps) => {
  const { onClick, numDays, option } = props

  const t_common = useTranslations('Common')
  const t_abbr = useTranslations('Abbreviations')

  return (
    <button
      onClick={() => onClick(option)}
      className={classNames('p-2 text-lg rounded-lg border hover:bg-pt-transparent md:text-xl', {
        'text-pt-purple-50 bg-pt-transparent border-pt-transparent': numDays === option,
        'border-transparent': numDays !== option
      })}
    >
      {!!option ? `${option} ${t_abbr('days')}` : t_common('allTime')}
    </button>
  )
}

interface ContributionsChartProps {
  vault: Vault
  prizePool: PrizePool
  numDays?: number
  className?: string
}

const ContributionsChart = (props: ContributionsChartProps) => {
  const { vault, prizePool, numDays, className } = props

  const t_vault = useTranslations('Vault')

  const { data: contributionEvents } = useVaultContributionEvents(prizePool, {
    vaultAddress: vault.address,
    fromBlock: QUERY_START_BLOCK[prizePool.chainId as keyof typeof QUERY_START_BLOCK]
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

      return !!numDays ? data.slice(Math.max(0, data.length - numDays)) : data
    }
  }, [contributionEvents, firstDrawOpenTimestamp, drawPeriod, prizeToken, numDays])

  return (
    <div
      className={classNames('w-full aspect-[16/11] flex items-center justify-center', className)}
    >
      {!!chartData && !!prizeToken ? (
        chartData.length ? (
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey='name' stroke='#9CA3AF' />
              <YAxis stroke='#9CA3AF' tickFormatter={(tick) => `${tick} ${prizeToken.symbol}`} />
              <Bar dataKey='amount' fill='#6538C1' isAnimationActive={false} />
              {/* TODO: add tooltip without annoying bg (set in Bar component) */}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <span className='text-sm text-pt-purple-100 md:text-base'>
            {t_vault('noContributionsYet')}
          </span>
        )
      ) : (
        <Spinner />
      )}
    </div>
  )
}
