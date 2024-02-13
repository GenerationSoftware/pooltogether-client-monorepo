import { Intl } from '@shared/types'
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
  openConnectModal?: () => void
  openChainModal?: () => void
  addRecentTransaction?: (tx: { hash: string; description: string; confirmations?: number }) => void
  intl?: { base?: Intl<'switchNetwork' | 'switchingNetwork'>; common?: Intl<'connectWallet'> }
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
    openConnectModal,
    openChainModal,
    addRecentTransaction,
    intl,
    innerClassName,
    disabled,
    children,
    ...rest
  } = props

  const { chain, isDisconnected } = useAccount()

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
        <span className={classNames('whitespace-nowrap', innerClassName)}>
          {intl?.common?.('connectWallet') ?? 'Connect Wallet'}
        </span>
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
            {intl?.base?.('switchingNetwork', { network: networkName }) ??
              `Switching to ${networkName}...`}
          </span>
        )}
        {!isSwitchingChain && (
          <span className={classNames('whitespace-nowrap', innerClassName)}>
            {intl?.base?.('switchNetwork', { network: networkName }) ?? `Switch to ${networkName}`}
          </span>
        )}
      </Button>
    )
  }

  return (
    <Button onClick={write} disabled={!write || isTxLoading || disabled} {...rest}>
      <span
        className={classNames('whitespace-nowrap', innerClassName, {
          'leading-none': isTxLoading
        })}
      >
        {isTxLoading && <Spinner />}
        {!isTxLoading && children}
      </span>
    </Button>
  )
}
