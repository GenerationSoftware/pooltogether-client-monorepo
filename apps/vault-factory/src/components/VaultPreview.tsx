import { useToken } from '@pooltogether/hyperstructure-react-hooks'
import { ExternalLink } from '@shared/ui'
import { getBlockExplorerUrl, getNiceNetworkNameByChainId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { SupportedNetwork } from 'src/types'
import { getFormattedFeePercentage } from 'src/utils'
import { Address } from 'viem'
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

  if (!chainId || !token) {
    return <></>
  }

  return (
    <div
      className={classNames(
        'flex flex-col gap-3 items-center px-8 py-5 border border-pt-purple-100 rounded-2xl',
        className
      )}
    >
      <span className='text-xl text-pt-purple-100'>Prize Vault Preview</span>
      <VaultPreviewItem label='Network' value={getNiceNetworkNameByChainId(chainId)} />
      {!!tokenData && (
        <VaultPreviewItem
          label='Deposit Token'
          value={tokenData.symbol ?? '???'}
          href={getBlockExplorerUrl(tokenData.chainId, tokenData.address, 'token')}
        />
      )}
      {!!yieldSourceName && !!yieldSourceAddress && (
        <VaultPreviewItem
          label='Yield Source'
          value={yieldSourceName}
          href={getBlockExplorerUrl(chainId, yieldSourceAddress, 'address')}
        />
      )}
      {!!formattedFeePercentage && (
        <VaultPreviewItem label='Yield Fee %' value={formattedFeePercentage} />
      )}
      {!!feeRecipient && (
        <VaultPreviewItem
          label='Fee Recipient'
          value={`${shorten(feeRecipient)}`}
          href={getBlockExplorerUrl(chainId, feeRecipient, 'address')}
        />
      )}
      {!!owner && (
        <VaultPreviewItem
          label='Vault Owner'
          value={`${shorten(owner)}`}
          href={getBlockExplorerUrl(chainId, owner, 'address')}
        />
      )}
      {!!name && <VaultPreviewItem label='Vault Name' value={name} />}
      {!!symbol && <VaultPreviewItem label='Vault Symbol' value={symbol} />}
      {!!claimer && (
        <VaultPreviewItem
          label='Claimer'
          value={`${shorten(claimer)}`}
          href={getBlockExplorerUrl(chainId, claimer, 'address')}
        />
      )}
    </div>
  )
}

interface VaultPreviewItemProps {
  label: string
  value: string
  href?: string
}

const VaultPreviewItem = (props: VaultPreviewItemProps) => {
  const { label, value, href } = props

  return (
    <div className='w-full inline-flex justify-between text-sm leading-tight'>
      <span>{label}</span>
      {!!href ? (
        <ExternalLink href={href} text={value} size='sm' className='text-pt-teal-dark' />
      ) : (
        <span className='text-pt-teal-dark'>{value}</span>
      )}
    </div>
  )
}
