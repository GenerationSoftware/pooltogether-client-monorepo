import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawPeriod,
  usePrizeOdds,
  useVaultShareData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import {
  calculateUnionProbability,
  formatNumberForDisplay,
  SECONDS_PER_WEEK
} from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { parseUnits } from 'viem'
import { depositFormShareAmountAtom, depositFormTokenAmountAtom } from './DepositModal/DepositForm'

interface OddsProps {
  vault: Vault
  prizePool: PrizePool
}

export const Odds = (props: OddsProps) => {
  const { vault, prizePool } = props

  const t = useTranslations('TxModals')

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
      return t('oneInXChance', { number: formattedValue })
    }
  }, [prizeOdds, drawPeriod])

  return (
    <div className='flex flex-col items-center gap-2 font-semibold'>
      <span className='text-xs text-pt-purple-100 md:text-sm'>{t('weeklyChances')}</span>
      <span className='text-pt-purple-50 md:text-xl'>
        {weeklyChance !== undefined ? formTokenAmount !== '0' ? weeklyChance : '-' : <Spinner />}
      </span>
    </div>
  )
}
