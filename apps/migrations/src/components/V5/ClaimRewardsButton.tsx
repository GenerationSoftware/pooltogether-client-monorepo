import { useSendClaimRewardsTransaction } from '@generationsoftware/hyperstructure-react-hooks'
import { ButtonProps } from '@shared/ui'
import { useMemo } from 'react'
import { Address } from 'viem'
import { TransactionButton } from '@components/TransactionButton'
import { useUserV5ClaimablePromotions } from '@hooks/useUserV5ClaimablePromotions'

export interface ClaimRewardsButtonProps extends Omit<ButtonProps, 'onClick'> {
  chainId: number
  vaultAddress: Address
  userAddress: Address
  txOptions?: Parameters<typeof useSendClaimRewardsTransaction>[3]
  buttonText?: string
}

export const ClaimRewardsButton = (props: ClaimRewardsButtonProps) => {
  const { chainId, vaultAddress, userAddress, txOptions, buttonText, ...rest } = props

  const { data: claimable, isFetched: isFetchedClaimable } = useUserV5ClaimablePromotions(
    chainId,
    vaultAddress,
    userAddress
  )

  const twabRewardsAddress = useMemo(() => {
    return txOptions?.twabRewardsAddress ?? claimable?.[0]?.twabRewardsAddress
  }, [claimable])

  const epochsToClaim = useMemo(() => {
    const epochs: { [id: string]: number[] } = {}

    if (isFetchedClaimable && claimable.length > 0) {
      claimable
        .filter((e) => e.twabRewardsAddress === twabRewardsAddress)
        .forEach((promotion) => {
          const epochIds = Object.keys(promotion.rewards).map((k) => parseInt(k))

          if (!!epochIds.length) {
            epochs[promotion.promotionId.toString()] = epochIds
          }
        })
    }

    return epochs
  }, [claimable, isFetchedClaimable, twabRewardsAddress])

  const { isWaiting, isConfirming, isSuccess, txHash, sendClaimRewardsTransaction } =
    useSendClaimRewardsTransaction(chainId, userAddress, epochsToClaim, {
      ...txOptions,
      twabRewardsAddress
    })

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaiting || isConfirming}
      isTxSuccess={isSuccess}
      write={sendClaimRewardsTransaction}
      txHash={txHash}
      txDescription={`V5 Rewards Claim`}
      {...rest}
    >
      {buttonText ?? 'Claim Rewards'}
    </TransactionButton>
  )
}
