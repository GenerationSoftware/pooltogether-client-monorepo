import {
  useVault,
  useVaultClaimer,
  useVaultFeeInfo,
  useVaultOwner,
  useVaultShareData,
  useVaultTokenData,
  useVaultYieldSource
} from '@pooltogether/hyperstructure-react-hooks'
import { ExternalLink } from '@shared/ui'
import { getBlockExplorerUrl, getNiceNetworkNameByChainId, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { vaultAddressAtom, vaultChainIdAtom } from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { getFormattedFeePercentage } from 'src/utils'
import { Address } from 'viem'

interface DeployedVaultInfoProps {
  className?: string
}

export const DeployedVaultInfo = (props: DeployedVaultInfoProps) => {
  const { className } = props

  const chainId = useAtomValue(vaultChainIdAtom) as SupportedNetwork
  const address = useAtomValue(vaultAddressAtom) as Address

  const vault = useVault({ chainId, address })

  const { data: shareData } = useVaultShareData(vault)
  const { data: tokenData } = useVaultTokenData(vault)
  const { data: yieldSource } = useVaultYieldSource(vault)
  const { data: feeInfo } = useVaultFeeInfo(vault)
  const { data: owner } = useVaultOwner(vault)
  const { data: claimer } = useVaultClaimer(vault)

  return (
    <div
      className={classNames(
        'flex flex-col gap-3 items-center px-8 py-5 border border-pt-purple-100 rounded-2xl',
        className
      )}
    >
      <span className='text-xl text-pt-purple-100'>Prize Vault</span>
      <DeployedVaultInfoItem label='Network' value={getNiceNetworkNameByChainId(chainId)} />
      {!!tokenData && (
        <DeployedVaultInfoItem
          label='Deposit Token'
          value={tokenData.symbol ?? '???'}
          href={getBlockExplorerUrl(tokenData.chainId, tokenData.address, 'token')}
        />
      )}
      {!!yieldSource && (
        <DeployedVaultInfoItem
          label='Yield Source'
          value={`${shorten(yieldSource)}`}
          href={getBlockExplorerUrl(chainId, yieldSource)}
        />
      )}
      {!!feeInfo && (
        <DeployedVaultInfoItem
          label='Yield Fee %'
          value={getFormattedFeePercentage(feeInfo.percent)}
        />
      )}
      {!!feeInfo && (
        <DeployedVaultInfoItem
          label='Fee Recipient'
          value={`${shorten(feeInfo.recipient)}`}
          href={getBlockExplorerUrl(chainId, feeInfo.recipient)}
        />
      )}
      {!!owner && (
        <DeployedVaultInfoItem
          label='Vault Owner'
          value={`${shorten(owner)}`}
          href={getBlockExplorerUrl(chainId, owner)}
        />
      )}
      {!!shareData && <DeployedVaultInfoItem label='Vault Name' value={shareData.name} />}
      {!!shareData && <DeployedVaultInfoItem label='Vault Symbol' value={shareData.symbol} />}
      {!!claimer && (
        <DeployedVaultInfoItem
          label='Claimer'
          value={`${shorten(claimer)}`}
          href={getBlockExplorerUrl(chainId, claimer)}
        />
      )}
    </div>
  )
}

interface DeployedVaultInfoItemProps {
  label: string
  value: string
  href?: string
}

const DeployedVaultInfoItem = (props: DeployedVaultInfoItemProps) => {
  const { label, value, href } = props

  return (
    <div className='w-full inline-flex justify-between text-sm leading-tight'>
      <span>{label}</span>
      {!!href ? (
        <ExternalLink href={href} size='sm' className='text-pt-teal-dark'>
          {value}
        </ExternalLink>
      ) : (
        <span className='text-pt-teal-dark'>{value}</span>
      )}
    </div>
  )
}
