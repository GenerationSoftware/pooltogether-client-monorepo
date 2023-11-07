import {
  getNetworkNameByChainId,
  RichIntl,
  Vault
} from '@generationsoftware/hyperstructure-client-js'
import { ExternalLink } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode } from 'react'

interface ExchangeRateErrorProps {
  vault: Vault
  intl?: RichIntl<'exchangeRateError'>
  className?: string
}

export const ExchangeRateError = (props: ExchangeRateErrorProps) => {
  const { vault, intl, className } = props

  const networkName = getNetworkNameByChainId(vault.chainId)
  const uniswapHref = `https://app.uniswap.org/tokens/${networkName}/${vault.address}`

  const getUniswapLink = (chunks: ReactNode) => (
    <ExternalLink href={uniswapHref} size='sm' className='text-pt-teal'>
      {chunks}
    </ExternalLink>
  )

  return (
    <span className={classNames('text-center text-sm text-pt-purple-200', className)}>
      {intl?.rich('exchangeRateError', {
        link: getUniswapLink
      }) ?? (
        <>
          Something went wrong while calculating exchange rates for this vault. You can still swap
          in or out of this vault through an exchange or exchange aggregator (
          {getUniswapLink('Uniswap')} for example).
        </>
      )}
    </span>
  )
}
