import {
  useAllVaultPromotionsApr,
  usePrizePool,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { useIsDismissed, useScreenSize } from '@shared/generic-react-hooks'
import { Token } from '@shared/types'
import { Button, Modal } from '@shared/ui'
import { formatNumberForDisplay, LINKS, NETWORK, PRIZE_POOLS } from '@shared/utilities'
import defaultVaultList from '@vaultLists/default'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'

export const MigrationPopup = () => {
  const t = useTranslations('Common.greatMigration')

  const { isMobile } = useScreenSize()

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

  return (
    <Modal
      bodyContent={
        <div className='relative aspect-[768/500] flex flex-col items-center justify-between gap-4 p-4 rounded-3xl isolate overflow-hidden md:px-10 md:py-12'>
          <object
            type='image/svg+xml'
            data='/greatMigration.svg'
            className='absolute top-0 -z-10'
          />
          <div className='flex flex-col gap-2 text-center md:gap-4'>
            <span className='text-2xl text-pt-purple-200 sm:text-4xl md:text-5xl'>
              {t.rich('joinTitle', {
                highlight: (chunks) => <span className='text-pt-purple-50'>{chunks}</span>
              })}
            </span>
            {highestRewardsApr > 0 && (
              <span className='sm:text-lg md:text-2xl'>
                {t.rich('earnUpTo', {
                  apr: formatNumberForDisplay(highestRewardsApr, { maximumFractionDigits: 1 }),
                  highlight: (chunks) => <span className='text-pt-teal'>{chunks}</span>
                })}
              </span>
            )}
          </div>
          <Button
            href={LINKS.migrations}
            target='_blank'
            size={isMobile ? 'md' : 'lg'}
            className='md:min-w-[16rem]'
          >
            {t('joinButton')}
          </Button>
        </div>
      }
      className='p-12 rounded-t-3xl md:!w-auto md:max-w-none md:!rounded-3xl'
      onClose={dismiss}
      label='great-migration-popup'
      hideHeader={true}
      mobileStyle='tab'
    />
  )
}
