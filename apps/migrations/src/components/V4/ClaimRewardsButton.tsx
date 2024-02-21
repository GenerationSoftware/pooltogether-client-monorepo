import { ButtonProps } from '@shared/ui'
import { Address } from 'viem'
import { TransactionButton } from '@components/TransactionButton'
import { V4_PROMOTIONS } from '@constants/config'
import { useSendV4ClaimRewardsTransaction } from '@hooks/useSendV4ClaimRewardsTransaction'

export interface ClaimRewardsButtonProps extends Omit<ButtonProps, 'onClick'> {
  chainId: number
  userAddress: Address
  txOptions?: Parameters<typeof useSendV4ClaimRewardsTransaction>[2]
}

export const ClaimRewardsButton = (props: ClaimRewardsButtonProps) => {
  const { chainId, userAddress, txOptions, ...rest } = props

  const { sendV4ClaimRewardsTransaction, isWaiting, isConfirming, isSuccess, txHash } =
    useSendV4ClaimRewardsTransaction(chainId, userAddress, txOptions)

  const tokenSymbol = V4_PROMOTIONS[chainId]?.token.symbol

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaiting || isConfirming}
      isTxSuccess={isSuccess}
      write={sendV4ClaimRewardsTransaction}
      txHash={txHash}
      txDescription={`V4 ${tokenSymbol} Rewards Claim`}
      {...rest}
    >
      Claim {tokenSymbol}
    </TransactionButton>
  )
}
