import { useToken } from '@pooltogether/hyperstructure-react-hooks'
import { ExternalLink } from '@shared/ui'
import { formatNumberForDisplay, getNiceNetworkNameByChainId, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import {
  vaultChainIdAtom,
  vaultClaimerAddressAtom,
  vaultFeePercentageAtom,
  vaultFeeRecipientAddressAtom,
  vaultNameAtom,
  vaultOwnerAddressAtom,
  vaultSymbolAtom,
  vaultTokenAddressAtom,
  vaultYieldSourceNameAtom
} from 'src/atoms'
import { Address } from 'viem'

interface VaultPreviewProps {
  className?: string
}

export const VaultPreview = (props: VaultPreviewProps) => {
  const { className } = props

  const vaultChainId = useAtomValue(vaultChainIdAtom)
  const vaultTokenAddress = useAtomValue(vaultTokenAddressAtom)
  const vaultYieldSourceName = useAtomValue(vaultYieldSourceNameAtom)
  const vaultFeePercentage = useAtomValue(vaultFeePercentageAtom)
  const vaultFeeRecipientAddress = useAtomValue(vaultFeeRecipientAddressAtom)
  const vaultOwnerAddress = useAtomValue(vaultOwnerAddressAtom)
  const vaultName = useAtomValue(vaultNameAtom)
  const vaultSymbol = useAtomValue(vaultSymbolAtom)
  const vaultClaimerAddress = useAtomValue(vaultClaimerAddressAtom)

  const { data: tokenData } = useToken(vaultChainId as NETWORK, vaultTokenAddress as Address)

  if (!vaultChainId || !vaultTokenAddress) {
    return <></>
  }

  const formattedFeePercentage =
    vaultFeePercentage !== undefined
      ? `${formatNumberForDisplay(vaultFeePercentage / 10_000_000, {
          maximumFractionDigits: 2
        })}%`
      : undefined

  // TODO: add hrefs where appropriate
  return (
    <div className={classNames('flex flex-col gap-3 items-center', className)}>
      <span className='text-xl text-pt-purple-100'>Prize Vault Preview</span>
      <VaultPreviewItem label='Network' value={getNiceNetworkNameByChainId(vaultChainId)} />
      <VaultPreviewItem label='Deposit Token Address' value={vaultTokenAddress} />
      {!!tokenData && <VaultPreviewItem label='Deposit Token Symbol' value={tokenData.symbol} />}
      {!!vaultYieldSourceName && (
        <VaultPreviewItem label='Yield Source' value={vaultYieldSourceName} />
      )}
      {!!formattedFeePercentage && (
        <VaultPreviewItem label='Yield Fee %' value={formattedFeePercentage} />
      )}
      {!!vaultFeeRecipientAddress && (
        <VaultPreviewItem label='Fee Recipient' value={vaultFeeRecipientAddress} />
      )}
      {!!vaultOwnerAddress && <VaultPreviewItem label='Vault Owner' value={vaultOwnerAddress} />}
      {!!vaultName && <VaultPreviewItem label='Vault Name' value={vaultName} />}
      {!!vaultSymbol && <VaultPreviewItem label='Vault Symbol' value={vaultSymbol} />}
      {!!vaultClaimerAddress && (
        <VaultPreviewItem label='Claimer Address' value={vaultClaimerAddress} />
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
