import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { Button, ButtonProps, Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

export interface TransactionButtonProps extends Omit<ButtonProps, 'onClick'> {
  chainId: number
  isTxLoading: boolean
  isTxSuccess: boolean
  write?: () => void
  txHash?: string
  txDescription?: string
  hideWrongNetworkState?: boolean
  innerClassName?: string
}

export const TransactionButton = (props: TransactionButtonProps) => {
  const {
    chainId,
    isTxLoading,
    isTxSuccess,
    write,
    txHash,
    txDescription,
    hideWrongNetworkState,
    innerClassName,
    disabled,
    children,
    ...rest
  } = props

  const { chain, isDisconnected } = useAccount()

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { switchChain, isLoading: isSwitchingChain } = useSwitchChain()

  const networkName = getNiceNetworkNameByChainId(chainId)

  useEffect(() => {
    if (isTxSuccess && !!txHash && !!txDescription && !!addRecentTransaction) {
      addRecentTransaction({
        hash: txHash,
        description: `${networkName}: ${txDescription}`
      })
    }
  }, [isTxSuccess, txHash, txDescription])

  if (isDisconnected) {
    return (
      <Button onClick={openConnectModal} {...rest}>
        <span className={classNames('whitespace-nowrap', innerClassName)}>Connect Wallet</span>
      </Button>
    )
  } else if (chain?.id !== chainId) {
    return (
      <Button
        onClick={() =>
          !!switchChain ? switchChain({ chainId }) : !!openChainModal ? openChainModal() : undefined
        }
        disabled={isSwitchingChain}
        {...rest}
      >
        {isSwitchingChain && (
          <span className={classNames('whitespace-nowrap', innerClassName)}>
            Switching to {networkName}...
          </span>
        )}
        {!isSwitchingChain && (
          <span className={classNames('whitespace-nowrap', innerClassName)}>
            {hideWrongNetworkState ? children : `Switch to ${networkName}`}
          </span>
        )}
      </Button>
    )
  }

  return (
    <Button onClick={write} disabled={!write || isTxLoading || disabled} {...rest}>
      <span className={classNames('whitespace-nowrap', innerClassName)}>
        {isTxLoading && <Spinner />}
        {!isTxLoading && children}
      </span>
    </Button>
  )
}
