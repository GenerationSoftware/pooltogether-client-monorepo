import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useScreenSize } from '@shared/generic-react-hooks'
import { ExternalLink } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { getCleanURI } from 'src/utils'
import { VaultPageCard } from './VaultPageCard'
import { VaultPrizeYield } from './VaultPrizeYield'
import { VaultTotalDeposits } from './VaultTotalDeposits'
import { VaultWinChance } from './VaultWinChance'

interface VaultPageCardsProps {
  vault: Vault
  className?: string
}

export const VaultPageCards = (props: VaultPageCardsProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_vault = useTranslations('Vault')

  const { isDesktop } = useScreenSize()

  return (
    <div
      className={classNames(
        'w-full grid grid-cols-1 gap-3 md:grid-cols-2',
        { 'md:grid-cols-3': !!vault.yieldSourceName },
        className
      )}
    >
      <VaultPageCard title={t_vault('headers.totalDeposited')}>
        <VaultTotalDeposits
          vault={vault}
          className='gap-2'
          valueClassName='!text-2xl text-pt-purple-100 font-semibold md:!text-3xl'
          amountClassName='!text-sm text-pt-purple-300 md:!text-base'
        />
      </VaultPageCard>
      <VaultPageCard title={t_vault('headers.winChance')}>
        <VaultWinChance vault={vault} className='h-10 w-auto' />
        <div className='flex items-center gap-2 text-sm text-pt-purple-300 md:text-base'>
          <span>{t_vault('headers.prizeYield')}:</span>
          <VaultPrizeYield vault={vault} label={t_common('apr')} />
        </div>
      </VaultPageCard>
      {!!vault.yieldSourceName && (
        <VaultPageCard title={t_vault('headers.yieldSource')}>
          <span className='text-2xl text-pt-purple-100 font-semibold md:text-3xl'>
            {vault.yieldSourceName}
          </span>
          {!!vault.yieldSourceURI && (
            <ExternalLink
              href={vault.yieldSourceURI}
              size={isDesktop ? 'md' : 'sm'}
              className='text-pt-purple-300 hover:text-pt-purple-400'
            >
              {getCleanURI(vault.yieldSourceURI)}
            </ExternalLink>
          )}
        </VaultPageCard>
      )}
    </div>
  )
}
