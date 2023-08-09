import { useToken } from '@pooltogether/hyperstructure-react-hooks'
import { ExternalLink } from '@shared/ui'
import { getBlockExplorerUrl, getNiceNetworkNameByChainId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { SupportedNetwork } from 'src/types'
import { getFormattedFeePercentage } from 'src/utils'
import { Address, zeroAddress } from 'viem'
import { useVaultInfo } from '@hooks/useVaultInfo'

interface VaultPreviewProps {
  className?: string
}

export const VaultPreview = (props: VaultPreviewProps) => {
  const { className } = props

  const {
    chainId,
    token,
    yieldSourceName,
    yieldSourceAddress,
    feePercentage,
    feeRecipient,
    owner,
    name,
    symbol,
    claimer
  } = useVaultInfo()

  const { data: tokenData } = useToken(chainId as SupportedNetwork, token as Address)

  const formattedFeePercentage = useMemo(() => {
    return feePercentage !== undefined ? getFormattedFeePercentage(feePercentage) : undefined
  }, [feePercentage])

  const isInvalidYieldSource = token === zeroAddress

  return (
    <div
      className={classNames(
        'flex flex-col gap-3 items-center px-8 py-5 border border-pt-purple-100 rounded-2xl',
        className
      )}
    >
      <span className='text-xl text-pt-purple-100'>Prize Vault Preview</span>
      {!!chainId && (
        <VaultPreviewItem label='Network' value={getNiceNetworkNameByChainId(chainId)} />
      )}
      {!!tokenData && (
        <VaultPreviewItem
          label='Deposit Token'
          value={tokenData.symbol}
          href={getBlockExplorerUrl(tokenData.chainId, tokenData.address, 'token')}
        />
      )}
      {!!chainId && !!yieldSourceName && !!yieldSourceAddress && !isInvalidYieldSource && (
        <VaultPreviewItem
          label='Yield Source'
          value={yieldSourceName}
          href={getBlockExplorerUrl(chainId, yieldSourceAddress)}
        />
      )}
      {!!yieldSourceAddress && isInvalidYieldSource && (
        <VaultPreviewItem
          label='Yield Source'
          value='Invalid'
          href={!!chainId ? getBlockExplorerUrl(chainId, yieldSourceAddress) : undefined}
          valueClassName='text-pt-warning-light'
        />
      )}
      {!!formattedFeePercentage && (
        <VaultPreviewItem label='Yield Fee %' value={formattedFeePercentage} />
      )}
      {!!chainId && !!feeRecipient && (
        <VaultPreviewItem
          label='Fee Recipient'
          value={`${shorten(feeRecipient)}`}
          href={getBlockExplorerUrl(chainId, feeRecipient)}
        />
      )}
      {!!chainId && !!owner && (
        <VaultPreviewItem
          label='Vault Owner'
          value={`${shorten(owner)}`}
          href={getBlockExplorerUrl(chainId, owner)}
        />
      )}
      {!!name && <VaultPreviewItem label='Vault Name' value={name} />}
      {!!symbol && <VaultPreviewItem label='Vault Symbol' value={symbol} />}
      {!!chainId && !!claimer && (
        <VaultPreviewItem
          label='Claimer'
          value={`${shorten(claimer)}`}
          href={getBlockExplorerUrl(chainId, claimer)}
        />
      )}
    </div>
  )
}

interface VaultPreviewItemProps {
  label: string
  value: string
  href?: string
  valueClassName?: string
}

const VaultPreviewItem = (props: VaultPreviewItemProps) => {
  const { label, value, href, valueClassName } = props

  return (
    <div className='w-full inline-flex justify-between text-sm leading-tight'>
      <span>{label}</span>
      {!!href ? (
        <ExternalLink
          href={href}
          text={value}
          size='sm'
          className={classNames('text-pt-teal-dark', valueClassName)}
        />
      ) : (
        <span className={classNames('text-pt-teal-dark', valueClassName)}>{value}</span>
      )}
    </div>
  )
}
