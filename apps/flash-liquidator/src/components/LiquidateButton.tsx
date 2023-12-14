import { useAddRecentTransaction, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { CurrencyValue, TransactionButton } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { LiquidationPair } from 'src/types'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { useBestLiquidation } from '@hooks/useBestLiquidation'
import { useBestLiquidationProfit } from '@hooks/useBestLiquidationProfit'
import { useSendFlashLiquidateTransaction } from '@hooks/useSendFlashLiquidateTransaction'

interface LiquidateButtonProps {
  liquidationPair: LiquidationPair
  className?: string
}

export const LiquidateButton = (props: LiquidateButtonProps) => {
  const { liquidationPair, className } = props

  const { chain } = useNetwork()
  const { isDisconnected } = useAccount()

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const { switchNetworkAsync } = useSwitchNetwork()
  const addRecentTransaction = useAddRecentTransaction()

  const {
    data: bestLiquidation,
    isFetched: isFetchedBestLiquidation,
    refetch: refetchBestLiquidation
  } = useBestLiquidation(liquidationPair)

  const { isWaiting, isConfirming, isSuccess, txHash, sendFlashLiquidateTransaction } =
    useSendFlashLiquidateTransaction(liquidationPair, {
      onSuccess: () => {
        refetchBestLiquidation()
      },
      onError: () => {
        refetchBestLiquidation()
      }
    })

  // NOTE: This is necessary due to hydration errors otherwise.
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => setIsBrowser(true), [])

  const validateWalletConnection = async () => {
    if (isDisconnected) {
      openConnectModal?.()
      return false
    } else if (chain?.id !== liquidationPair.chainId) {
      if (!!switchNetworkAsync) {
        try {
          const result = await switchNetworkAsync(liquidationPair.chainId)
          return result.id === liquidationPair.chainId
        } catch {
          console.warn(`Could not switch wallet to chain ID ${liquidationPair.chainId}`)
          return false
        }
      } else {
        openChainModal?.()
        return false
      }
    } else {
      return true
    }
  }

  const onClick = async () => {
    const isWalletReady = await validateWalletConnection()

    if (isWalletReady && !!sendFlashLiquidateTransaction) {
      sendFlashLiquidateTransaction()
    }
  }

  const isEnabled =
    !!liquidationPair && isFetchedBestLiquidation && !!bestLiquidation && bestLiquidation.success

  if (!isBrowser || isDisconnected || chain?.id !== liquidationPair.chainId) {
    return (
      <Button onClick={onClick} disabled={!isEnabled} color='transparent' className={className}>
        <span className='whitespace-nowrap'>
          <ButtonContent lp={liquidationPair} />
        </span>
      </Button>
    )
  }

  return (
    <TransactionButton
      chainId={liquidationPair.chainId}
      isTxLoading={isWaiting || isConfirming}
      isTxSuccess={isSuccess}
      write={sendFlashLiquidateTransaction}
      txHash={txHash}
      txDescription={`Liquidated ${shorten(liquidationPair.address, { short: true })}`}
      disabled={!isEnabled}
      openConnectModal={openConnectModal}
      openChainModal={openChainModal}
      addRecentTransaction={addRecentTransaction}
      color='transparent'
      className={className}
    >
      <ButtonContent lp={liquidationPair} />
    </TransactionButton>
  )
}

const ButtonContent = (props: { lp: LiquidationPair }) => {
  const { lp } = props

  const { data: liquidation } = useBestLiquidation(lp)
  const { data: liquidationProfit, isFetched: isFetchedLiquidationProfit } =
    useBestLiquidationProfit(lp)

  if (!liquidation || !isFetchedLiquidationProfit || liquidationProfit === undefined) {
    return <Spinner />
  }

  // TODO: give better description of why the button isn't active
  if (!liquidation.success) {
    return <>-</>
  }

  return (
    <>
      Flash Liq. for{' '}
      <span
        className={classNames({
          'text-pt-teal-dark': liquidationProfit > 0,
          'text-pt-warning-light': liquidationProfit < 0
        })}
      >
        <CurrencyValue baseValue={liquidationProfit < 0 ? -liquidationProfit : liquidationProfit} />
      </span>{' '}
      {liquidationProfit < 0 ? <>Loss</> : <>Profit</>}
    </>
  )
}
