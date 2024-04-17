import {
  useAllVaultPromotionsApr,
  usePrizePool,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { useIsDismissed } from '@shared/generic-react-hooks'
import { Token } from '@shared/types'
import { Button, Modal } from '@shared/ui'
import { formatNumberForDisplay, LINKS, NETWORK, PRIZE_POOLS } from '@shared/utilities'
import defaultVaultList from '@vaultLists/default'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'

export const MigrationPopup = () => {
  const t = useTranslations('Common.greatMigration')

  const { isDismissed, dismiss } = useIsDismissed('greatMigrationPopup')

  const token: Token = {
    chainId: NETWORK.optimism_sepolia,
    address: '0x4200000000000000000000000000000000000042',
    symbol: 'OP',
    name: 'Optimism',
    decimals: 18
  }

  const vaultInfo = useMemo(() => {
    return defaultVaultList.tokens.filter((t) => t.chainId === token.chainId)
  }, [])

  const vaults = useVaults(vaultInfo)

  const prizePoolInfo = useMemo(() => {
    return PRIZE_POOLS.find(
      (pool) => pool.chainId === token.chainId
    ) as (typeof PRIZE_POOLS)[number]
  }, [])

  const prizePool = usePrizePool(
    prizePoolInfo.chainId,
    prizePoolInfo.address,
    prizePoolInfo.options
  )

  const { data: allVaultPromotionsApr } = useAllVaultPromotionsApr(
    vaults,
    prizePool,
    [token.address],
    { fromBlock: TWAB_REWARDS_SETTINGS[token.chainId]?.fromBlock }
  )

  const highestRewardsApr = useMemo(() => {
    return Math.max(...Object.values(allVaultPromotionsApr))
  }, [allVaultPromotionsApr])

  if (isDismissed) {
    return <></>
  }

  // TODO: style on mobile so it doesn't break :3
  return (
    <Modal
      bodyContent={
        <div className='relative w-[768px] h-[500px] flex flex-col items-center justify-between gap-4 py-12 rounded-3xl isolate overflow-hidden'>
          <object
            type='image/svg+xml'
            data='/greatMigration.svg'
            className='absolute top-0 -z-10'
          />
          <div className='flex flex-col gap-4 text-center'>
            <span className='text-5xl text-pt-purple-200'>
              {t.rich('joinTitle', {
                highlight: (chunks) => <span className='text-pt-purple-50'>{chunks}</span>
              })}
            </span>
            {highestRewardsApr > 0 && (
              <span className='text-2xl'>
                {t.rich('earnUpTo', {
                  apr: formatNumberForDisplay(highestRewardsApr, { maximumFractionDigits: 1 }),
                  highlight: (chunks) => <span className='text-pt-teal'>{chunks}</span>
                })}
              </span>
            )}
          </div>
          <Button href={LINKS.migrations} target='_blank' size='lg' className='min-w-[16rem]'>
            {t('joinButton')}
          </Button>
        </div>
      }
      className='p-12 !rounded-3xl md:!w-auto md:max-w-none'
      onClose={dismiss}
      label='great-migration-popup'
      hideHeader={true}
      mobileStyle='tab'
    />
  )
}
