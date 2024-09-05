import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawPeriod,
  useFirstDrawOpenedAt,
  useLastAwardedDrawId,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { VaultContributionsTooltip } from '@shared/react-components'
import { Card, Spinner } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { formatUnits } from 'viem'
import { useVaultContributions } from '@hooks/useVaultContributions'

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

  const [numDraws, setNumDraws] = useState<number | undefined>(7)

  return (
    <Card className='gap-4' wrapperClassName={classNames('w-full', className)}>
      <div className='flex flex-col items-center gap-2 text-pt-purple-300 font-semibold md:flex-row'>
        <span className='grow flex items-center gap-2 text-xl md:text-2xl'>
          <span>{t_vault('headers.contributions')}</span>
          <VaultContributionsTooltip tokenSymbol={prizeToken?.symbol ?? '?'} intl={t_tooltips} />
        </span>
        <div className='flex items-center gap-2'>
          <NumDrawsOptionButton onClick={setNumDraws} numDraws={numDraws} option={7} />
          <NumDrawsOptionButton onClick={setNumDraws} numDraws={numDraws} option={30} />
          <NumDrawsOptionButton onClick={setNumDraws} numDraws={numDraws} />
        </div>
      </div>
      <ContributionsChart vault={vault} prizePool={prizePool} numDraws={numDraws} />
    </Card>
  )
}

interface NumDrawsOptionButtonProps {
  onClick: (val?: number) => void
  numDraws: number | undefined
  option?: number
}

const NumDrawsOptionButton = (props: NumDrawsOptionButtonProps) => {
  const { onClick, numDraws, option } = props

  const t_common = useTranslations('Common')

  return (
    <button
      onClick={() => onClick(option)}
      className={classNames('p-2 text-lg rounded-lg border hover:bg-pt-transparent md:text-xl', {
        'text-pt-purple-50 bg-pt-transparent border-pt-transparent': numDraws === option,
        'border-transparent': numDraws !== option
      })}
    >
      {!!option ? `${option} ${t_common('draws').toLowerCase()}` : t_common('allTime')}
    </button>
  )
}

interface ContributionsChartProps {
  vault: Vault
  prizePool: PrizePool
  numDraws?: number
  className?: string
}

const ContributionsChart = (props: ContributionsChartProps) => {
  const { vault, prizePool, numDraws, className } = props

  const t_vault = useTranslations('Vault')

  const { data: contributions } = useVaultContributions(prizePool, vault.address)

  const { data: firstDrawOpenTimestamp } = useFirstDrawOpenedAt(prizePool)
  const { data: drawPeriod } = useDrawPeriod(prizePool)

  const { data: lastAwardedDrawId } = useLastAwardedDrawId(prizePool)

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const chartData = useMemo(() => {
    if (
      !!contributions &&
      !!firstDrawOpenTimestamp &&
      !!drawPeriod &&
      !!lastAwardedDrawId &&
      !!prizeToken
    ) {
      const data: { name: string; amount: number }[] = []

      const drawsWithData = Object.keys(contributions).map(Number)
      const minDrawId = Math.min(...drawsWithData)
      const maxDrawId = Math.max(...drawsWithData, lastAwardedDrawId)
      const drawIds = Array.from({ length: maxDrawId - minDrawId + 1 }, (_v, i) => minDrawId + i)

      drawIds.forEach((drawId) => {
        const drawOpenTimestamp = firstDrawOpenTimestamp + (drawId - 1) * drawPeriod
        const date = new Date(drawOpenTimestamp * 1e3)
        const name = `${date.getDate()}/${date.getMonth() + 1}`
        const amount = parseFloat(formatUnits(contributions[drawId] ?? 0n, prizeToken.decimals))

        data.push({ name, amount })
      })

      return !!numDraws ? data.slice(Math.max(0, data.length - numDraws)) : data
    }
  }, [contributions, firstDrawOpenTimestamp, drawPeriod, prizeToken, numDraws])

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
