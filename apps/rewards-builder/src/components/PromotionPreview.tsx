import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { ExternalLink } from '@shared/ui'
import {
  calculatePercentageOfBigInt,
  formatBigIntForDisplay,
  getBlockExplorerUrl,
  getNiceNetworkNameByChainId,
  SECONDS_PER_HOUR
} from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import {
  promotionChainIdAtom,
  promotionEpochLengthAtom,
  promotionEpochsAtom,
  promotionTokenAddressAtom,
  promotionTokenAmountAtom,
  promotionVaultAddressAtom
} from 'src/atoms'
import { SupportedNetwork } from 'src/types'
import { Address } from 'viem'

interface PromotionPreviewProps {
  className?: string
}

export const PromotionPreview = (props: PromotionPreviewProps) => {
  const { className } = props

  const chainId = useAtomValue(promotionChainIdAtom)
  const vaultAddress = useAtomValue(promotionVaultAddressAtom)
  const numEpochs = useAtomValue(promotionEpochsAtom)
  const epochLength = useAtomValue(promotionEpochLengthAtom)
  const tokenAddress = useAtomValue(promotionTokenAddressAtom)
  const tokenAmount = useAtomValue(promotionTokenAmountAtom)

  const { data: vaultData, isFetched: isFetchedVaultData } = useToken(
    chainId as SupportedNetwork,
    vaultAddress as Address
  )
  const { data: tokenData, isFetched: isFetchedTokenData } = useToken(
    chainId as SupportedNetwork,
    tokenAddress as Address
  )

  const rewardTokensPerEpoch = useMemo(() => {
    if (!!numEpochs && !!tokenAmount) {
      return calculatePercentageOfBigInt(tokenAmount, 1 / numEpochs)
    }
  }, [numEpochs, tokenAmount])

  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-3 items-center px-8 py-5 border border-pt-purple-100 rounded-2xl',
        className
      )}
    >
      <span className='text-xl text-pt-purple-100'>Rewards Preview</span>
      {!!chainId && <PreviewItem label='Network' value={getNiceNetworkNameByChainId(chainId)} />}
      {!!vaultData?.symbol && (
        <PreviewItem
          label='Prize Vault'
          value={vaultData.symbol}
          href={getBlockExplorerUrl(vaultData.chainId, vaultData.address, 'token')}
        />
      )}
      {!!chainId && !!vaultAddress && isFetchedVaultData && !vaultData?.symbol && (
        <PreviewItem
          label='Prize Vault'
          value='Invalid'
          href={getBlockExplorerUrl(chainId, vaultAddress)}
          valueClassName='text-pt-warning-light'
        />
      )}
      {!!tokenData?.symbol && (
        <PreviewItem
          label='Reward Token'
          value={tokenData.symbol}
          href={getBlockExplorerUrl(tokenData.chainId, tokenData.address, 'token')}
        />
      )}
      {!!chainId && !!tokenAddress && isFetchedTokenData && !tokenData?.symbol && (
        <PreviewItem
          label='Reward Token'
          value='Invalid'
          href={getBlockExplorerUrl(chainId, tokenAddress)}
          valueClassName='text-pt-warning-light'
        />
      )}
      {!!tokenAmount && !!tokenData && (
        <PreviewItem
          label='Total Rewards'
          value={`${formatBigIntForDisplay(tokenAmount, tokenData.decimals)} ${tokenData.symbol}`}
        />
      )}
      {!!rewardTokensPerEpoch && !!tokenData && (
        <PreviewItem
          label='Rewards per Epoch'
          value={`${formatBigIntForDisplay(rewardTokensPerEpoch, tokenData.decimals)} ${
            tokenData.symbol
          }`}
        />
      )}
      {!rewardTokensPerEpoch && !!numEpochs && !!tokenAmount && (
        <PreviewItem
          label='Rewards per Epoch'
          value='Invalid'
          valueClassName='text-pt-warning-light'
        />
      )}
      {!!numEpochs && <PreviewItem label='# of Epochs' value={`${numEpochs}`} />}
      {!!epochLength && (
        <PreviewItem
          label='Epoch Length'
          value={`${epochLength / SECONDS_PER_HOUR} Hour${
            epochLength > SECONDS_PER_HOUR ? 's' : ''
          }`}
        />
      )}
    </div>
  )
}

interface PreviewItemProps {
  label: string
  value: string
  href?: string
  valueClassName?: string
}

const PreviewItem = (props: PreviewItemProps) => {
  const { label, value, href, valueClassName } = props

  return (
    <div className='w-full inline-flex justify-between text-sm leading-tight'>
      <span>{label}</span>
      {!!href ? (
        <ExternalLink
          href={href}
          size='sm'
          className={classNames('text-pt-teal-dark', valueClassName)}
        >
          {value}
        </ExternalLink>
      ) : (
        <span className={classNames('text-pt-teal-dark', valueClassName)}>{value}</span>
      )}
    </div>
  )
}
