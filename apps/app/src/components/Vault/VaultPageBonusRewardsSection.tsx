import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { useDrawPeriod, useVaultPromotions } from '@generationsoftware/hyperstructure-react-hooks'
import {
  formatDailyCountToFrequency,
  getCountdownTextFromTimestamp,
  getPrizeTextFromFrequency,
  getSecondsSinceEpoch,
  SECONDS_PER_DAY
} from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'
import { VaultBonusRewards } from './VaultBonusRewards'
import { VaultPageCard } from './VaultPageCard'

interface VaultPageBonusRewardsSectionProps {
  vault: Vault
  prizePool: PrizePool
  maxNumDraws?: number
  className?: string
}

export const VaultPageBonusRewardsSection = (props: VaultPageBonusRewardsSectionProps) => {
  const { vault, prizePool, maxNumDraws, className } = props

  const t_common = useTranslations('Common')
  const t_vault = useTranslations('Vault')
  const t_freq = useTranslations('Frequency')

  const tokenAddresses = TWAB_REWARDS_SETTINGS[vault.chainId]?.tokenAddresses
  const fromBlock = TWAB_REWARDS_SETTINGS[vault.chainId]?.fromBlock
  const { data: vaultPromotions } = useVaultPromotions(vault, { tokenAddresses, fromBlock })

  const { data: drawPeriod } = useDrawPeriod(prizePool)

  const currentTimestamp = useMemo(() => getSecondsSinceEpoch(), [])

  const validPromotions = useMemo(() => {
    if (!!vaultPromotions && !!drawPeriod) {
      const maxTimestamp = currentTimestamp + (maxNumDraws ?? 7) * drawPeriod

      return Object.values(vaultPromotions).filter(
        (p) =>
          !!p.numberOfEpochs &&
          Number(p.startTimestamp) < maxTimestamp &&
          Number(p.startTimestamp) + p.numberOfEpochs * p.epochDuration > currentTimestamp
      )
    } else {
      return []
    }
  }, [vaultPromotions, drawPeriod, currentTimestamp])

  const formattedFrequency = useMemo(() => {
    const minDuration = Math.min(...validPromotions.map((p) => p.epochDuration))
    const frequency = formatDailyCountToFrequency(SECONDS_PER_DAY / minDuration)
    return getPrizeTextFromFrequency(frequency, 'everyXdays', t_freq)
  }, [validPromotions])

  const formattedNextClaim = useMemo(() => {
    const firstClaimTimestamps = validPromotions
      .map((promotion) => {
        const startTimestamp = Number(promotion.startTimestamp)
        const epochIds = [...Array(promotion.numberOfEpochs! + 1).keys()].slice(1)
        const claimTimestamps = epochIds.map((i) => startTimestamp + i * promotion.epochDuration)
        return claimTimestamps.find((t) => t > currentTimestamp) ?? 0
      })
      .filter((t) => !!t)

    const nextClaimTimestamp = Math.min(...firstClaimTimestamps)
    return getCountdownTextFromTimestamp(nextClaimTimestamp, t_freq)
  }, [validPromotions, currentTimestamp])

  return (
    <VaultPageCard
      title={t_vault('headers.bonusRewards')}
      className='!p-0'
      wrapperClassName={classNames('bg-transparent shadow-none', className)}
    >
      <VaultBonusRewards
        vault={vault}
        append={<span className='text-pt-purple-300'>{t_common('apr')}</span>}
        showTokens={true}
        className='flex-col text-sm md:text-base'
        valueClassName='text-2xl text-pt-purple-100 font-semibold md:text-3xl'
        tokensClassName='text-pt-purple-300'
      />
      <div className='flex items-center gap-2 text-sm md:text-base'>
        <span className='text-pt-purple-300'>{t_common('distribution')}:</span>
        <span className='text-pt-purple-100'>{formattedFrequency}</span>
      </div>
      <div className='flex items-center gap-2 text-sm md:text-base'>
        <span className='text-pt-purple-300'>{t_common('nextClaim')}:</span>
        <span className='text-pt-purple-100'>{formattedNextClaim}</span>
      </div>
    </VaultPageCard>
  )
}
