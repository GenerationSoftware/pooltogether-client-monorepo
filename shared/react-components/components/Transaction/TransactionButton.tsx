import { getNiceNetworkNameByChainId } from '@pooltogether/hyperstructure-client-js'
import { Intl } from '@shared/types'
import { Button, ButtonProps, Spinner } from '@shared/ui'
import { useEffect } from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

export interface TransactionButtonProps extends Omit<ButtonProps, 'onClick'> {
  chainId: number
  isTxLoading: boolean
  isTxSuccess: boolean
  write?: () => void
  txHash?: string
  txDescription?: string
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  intl?: { base?: Intl<'switchNetwork' | 'switchingNetwork'>; common?: Intl<'connectWallet'> }
}

export const TransactionButton = (props: TransactionButtonProps) => {
  const {
    chainId,
    isTxLoading,
    isTxSuccess,
    write,
    txHash,
    txDescription,
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    intl,
    disabled,
    children,
    ...rest
  } = props

  const { isDisconnected } = useAccount()
  const { chain } = useNetwork()

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
        {intl?.common?.('connectWallet') ?? 'Connect Wallet'}
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
          <span>
            {intl?.base?.('switchingNetwork', { network: networkName }) ??
              `Switching to ${networkName}...`}
          </span>
        )}
        {!isSwitchingNetwork && (
          <span>
            {intl?.base?.('switchNetwork', { network: networkName }) ?? `Switch to ${networkName}`}
          </span>
        )}
      </Button>
    )
  }

  return (
    <Button onClick={write} disabled={!write || isTxLoading || disabled} {...rest}>
      {isTxLoading && <Spinner />}
      {!isTxLoading && children}
    </Button>
  )
}
