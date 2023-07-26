import { useToken } from '@pooltogether/hyperstructure-react-hooks'
import { ExternalLink } from '@shared/ui'
import { getBlockExplorerUrl, getNiceNetworkNameByChainId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import {
  vaultChainIdAtom,
  vaultClaimerAddressAtom,
  vaultFeePercentageAtom,
  vaultFeeRecipientAddressAtom,
  vaultNameAtom,
  vaultOwnerAddressAtom,
  vaultSymbolAtom,
  vaultTokenAddressAtom,
  vaultYieldSourceAddressAtom,
  vaultYieldSourceNameAtom
} from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { getFormattedFeePercentage } from 'src/utils'
import { Address } from 'viem'

interface VaultPreviewProps {
  className?: string
}

export const VaultPreview = (props: VaultPreviewProps) => {
  const { className } = props

  const vaultChainId = useAtomValue(vaultChainIdAtom)
  const vaultTokenAddress = useAtomValue(vaultTokenAddressAtom)
  const vaultYieldSourceName = useAtomValue(vaultYieldSourceNameAtom)
  const vaultYieldSourceAddress = useAtomValue(vaultYieldSourceAddressAtom)
  const vaultFeePercentage = useAtomValue(vaultFeePercentageAtom)
  const vaultFeeRecipientAddress = useAtomValue(vaultFeeRecipientAddressAtom)
  const vaultOwnerAddress = useAtomValue(vaultOwnerAddressAtom)
  const vaultName = useAtomValue(vaultNameAtom)
  const vaultSymbol = useAtomValue(vaultSymbolAtom)
  const vaultClaimerAddress = useAtomValue(vaultClaimerAddressAtom)

  const { data: tokenData } = useToken(
    vaultChainId as SupportedNetwork,
    vaultTokenAddress as Address
  )

  const formattedFeePercentage = useMemo(() => {
    return vaultFeePercentage !== undefined
      ? getFormattedFeePercentage(vaultFeePercentage)
      : undefined
  }, [vaultFeePercentage])

  if (!vaultChainId || !vaultTokenAddress) {
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
      <VaultPreviewItem label='Network' value={getNiceNetworkNameByChainId(vaultChainId)} />
      {!!tokenData && (
        <VaultPreviewItem
          label='Deposit Token'
          value={tokenData.symbol ?? '???'}
          href={getBlockExplorerUrl(tokenData.chainId, tokenData.address, 'token')}
        />
      )}
      {!!vaultYieldSourceName && !!vaultYieldSourceAddress && (
        <VaultPreviewItem
          label='Yield Source'
          value={vaultYieldSourceName}
          href={getBlockExplorerUrl(vaultChainId, vaultYieldSourceAddress, 'address')}
        />
      )}
      {!!formattedFeePercentage && (
        <VaultPreviewItem label='Yield Fee %' value={formattedFeePercentage} />
      )}
      {!!vaultFeeRecipientAddress && (
        <VaultPreviewItem
          label='Fee Recipient'
          value={`${shorten(vaultFeeRecipientAddress)}`}
          href={getBlockExplorerUrl(vaultChainId, vaultFeeRecipientAddress, 'address')}
        />
      )}
      {!!vaultOwnerAddress && (
        <VaultPreviewItem
          label='Vault Owner'
          value={`${shorten(vaultOwnerAddress)}`}
          href={getBlockExplorerUrl(vaultChainId, vaultOwnerAddress, 'address')}
        />
      )}
      {!!vaultName && <VaultPreviewItem label='Vault Name' value={vaultName} />}
      {!!vaultSymbol && <VaultPreviewItem label='Vault Symbol' value={vaultSymbol} />}
      {!!vaultClaimerAddress && (
        <VaultPreviewItem
          label='Claimer'
          value={`${shorten(vaultClaimerAddress)}`}
          href={getBlockExplorerUrl(vaultChainId, vaultClaimerAddress, 'address')}
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
