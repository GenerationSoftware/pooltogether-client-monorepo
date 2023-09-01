import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawPeriod,
  usePrizeOdds,
  useVaultShareData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Spinner } from '@shared/ui'
import {
  calculateUnionProbability,
  formatNumberForDisplay,
  SECONDS_PER_WEEK
} from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { parseUnits } from 'viem'
import { depositFormShareAmountAtom, depositFormTokenAmountAtom } from '../Form/DepositForm'

interface OddsProps {
  vault: Vault
  prizePool: PrizePool
  intl?: Intl<'weeklyChances' | 'oneInXChance'>
}

export const Odds = (props: OddsProps) => {
  const { vault, prizePool, intl } = props

  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)
  const formShareAmount = useAtomValue(depositFormShareAmountAtom)

  const { data: shareData } = useVaultShareData(vault)

  const { data: prizeOdds } = usePrizeOdds(
    prizePool,
    vault,
    !!shareData && !!formShareAmount ? parseUnits(formShareAmount, shareData.decimals) : 0n,
    { isCumulative: true }
  )

  const { data: drawPeriod } = useDrawPeriod(prizePool)

  const weeklyChance = useMemo(() => {
    if (!!prizeOdds && !!drawPeriod) {
      const drawsPerWeek = SECONDS_PER_WEEK / drawPeriod
      const events = Array<number>(drawsPerWeek).fill(prizeOdds.percent)
      const value = 1 / calculateUnionProbability(events)
      const formattedValue = formatNumberForDisplay(value, { maximumSignificantDigits: 3 })
      return intl?.('oneInXChance', { number: formattedValue }) ?? `1 in ${formattedValue}`
    }
  }, [prizeOdds, drawPeriod])

  return (
    <div className='flex flex-col items-center gap-2 font-semibold'>
      <span className='text-xs text-pt-purple-100 md:text-sm'>
        {intl?.('weeklyChances') ?? 'Weekly Chance of Winning'}
      </span>
      <span className='text-pt-purple-50 md:text-xl'>
        {weeklyChance !== undefined ? formTokenAmount !== '0' ? weeklyChance : '-' : <Spinner />}
      </span>
    </div>
  )
}
