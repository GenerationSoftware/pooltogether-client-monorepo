import { getNetworkNameByChainId, Vault } from '@generationsoftware/hyperstructure-client-js'
import { RichIntl } from '@shared/types'
import { ExternalLink, LINKS } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { AlertIcon } from '../Icons/AlertIcon'

interface AaveCollateralizationErrorProps {
  vault: Vault
  intl?: {
    warning?: string
    error?: RichIntl<
      | 'aaveCollateralizationError.issue'
      | 'aaveCollateralizationError.recommendation'
      | 'aaveCollateralizationError.moreInfo'
    >
  }
  className?: string
}

export const AaveCollateralizationError = (props: AaveCollateralizationErrorProps) => {
  const { vault, intl, className } = props

  const govPostLink = 'https://gov.pooltogether.com/t/v5-vault-collateralization-issue/3170'

  const getLearnMoreLink = (chunks: ReactNode) => (
    <ExternalLink href={govPostLink} size='sm' className='text-pt-teal'>
      {chunks}
    </ExternalLink>
  )

  const networkName = getNetworkNameByChainId(vault.chainId)
  const uniswapHref = `https://app.uniswap.org/tokens/${networkName}/${vault.address}`

  const getUniswapLink = (chunks: ReactNode) => (
    <ExternalLink href={uniswapHref} size='sm' className='text-pt-teal'>
      {chunks}
    </ExternalLink>
  )

  const getDiscordLink = (chunks: ReactNode) => (
    <ExternalLink href={LINKS.discord} size='sm' className='text-pt-teal'>
      {chunks}
    </ExternalLink>
  )

  return (
    <div
      className={classNames(
        'flex flex-col gap-4 p-6 text-sm',
        'text-pt-purple-100 bg-pt-transparent rounded-lg',
        className
      )}
    >
      <span className='flex gap-2 items-center mx-auto font-semibold text-pt-warning-light'>
        <AlertIcon className='w-5 h-5' />
        {intl?.warning ?? 'Warning'}
      </span>
      <span>
        {intl?.error?.rich('aaveCollateralizationError.issue', { link: getLearnMoreLink }) ?? (
          <>
            This vault is experiencing issues due to using a high percentage of Aave's supply.{' '}
            {getLearnMoreLink('Learn more')}
          </>
        )}
      </span>
      <span className='font-semibold text-pt-warning-light'>
        {intl?.error?.('aaveCollateralizationError.recommendation') ??
          'It is not recommended to withdraw at this time'}
      </span>
      <span>
        {intl?.error?.rich('aaveCollateralizationError.moreInfo', {
          uniLink: getUniswapLink,
          discordLink: getDiscordLink
        }) ?? (
          <>
            You may be able to swap out via {getUniswapLink('Uniswap')}, or wait for the vault to
            normalize. For further updates, visit PoolTogether's {getDiscordLink(`Discord`)}
          </>
        )}
      </span>
    </div>
  )
}
