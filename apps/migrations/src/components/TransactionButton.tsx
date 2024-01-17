import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { Button, ButtonProps, Spinner } from '@shared/ui'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { useEffect } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

export interface TransactionButtonProps extends Omit<ButtonProps, 'onClick'> {
  chainId: number
  isTxLoading: boolean
  isTxSuccess: boolean
  write?: () => void
  txHash?: string
  txDescription?: string
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
    innerClassName,
    disabled,
    children,
    ...rest
  } = props

  const { isDisconnected } = useAccount()
  const { chain } = useNetwork()

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const addRecentTransaction = useAddRecentTransaction()

  const { isLoading: isSwitchingNetwork, switchNetwork } = useSwitchNetwork()

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
          !!switchNetwork ? switchNetwork(chainId) : !!openChainModal ? openChainModal() : undefined
        }
        disabled={isSwitchingNetwork}
        {...rest}
      >
        {isSwitchingNetwork && (
          <span className={classNames('whitespace-nowrap', innerClassName)}>
            Switching to {networkName}...
          </span>
        )}
        {!isSwitchingNetwork && (
          <span className={classNames('whitespace-nowrap', innerClassName)}>{children}</span>
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
