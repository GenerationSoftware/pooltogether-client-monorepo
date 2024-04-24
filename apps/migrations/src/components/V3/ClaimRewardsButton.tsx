import { ButtonProps } from '@shared/ui'
import { Address } from 'viem'
import { TransactionButton } from '@components/TransactionButton'
import { useSendV3ClaimTransaction } from '@hooks/useSendV3ClaimTransaction'

export interface ClaimRewardsButtonProps extends Omit<ButtonProps, 'onClick'> {
  chainId: number
  ticketAddress: Lowercase<Address>
  userAddress: Address
  txOptions?: Parameters<typeof useSendV3ClaimTransaction>[3]
}

export const ClaimRewardsButton = (props: ClaimRewardsButtonProps) => {
  const { chainId, ticketAddress, userAddress, txOptions, ...rest } = props

  const { sendV3ClaimTransaction, isWaiting, isConfirming, isSuccess, txHash } =
    useSendV3ClaimTransaction(chainId, ticketAddress, userAddress, txOptions)

  return (
    <TransactionButton
      chainId={chainId}
      isTxLoading={isWaiting || isConfirming}
      isTxSuccess={isSuccess}
      write={sendV3ClaimTransaction}
      txHash={txHash}
      txDescription={`V3 Rewards Claim`}
      {...rest}
    >
      Claim Rewards
    </TransactionButton>
  )
}
