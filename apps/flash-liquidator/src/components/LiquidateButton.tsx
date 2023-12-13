import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { CurrencyValue } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { LiquidationPair } from 'src/types'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { useBestLiquidationProfit } from '@hooks/useBestLiquidationProfit'

interface LiquidateButtonProps {
  liquidationPair: LiquidationPair
  className?: string
}

export const LiquidateButton = (props: LiquidateButtonProps) => {
  const { liquidationPair, className } = props

  const { isDisconnected } = useAccount()
  const { chain } = useNetwork()

  const { openConnectModal } = useConnectModal()
  const { openChainModal } = useChainModal()
  const { switchNetworkAsync } = useSwitchNetwork()

  const { data: liquidationProfit, isFetched } = useBestLiquidationProfit(liquidationPair)

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

    if (isWalletReady) {
      // TODO: re-simulate every step and if feasible prompt tx
    }
  }

  const isNotProfitable = isFetched && !!liquidationProfit && liquidationProfit < 0

  return (
    <Button
      onClick={onClick}
      disabled={!liquidationProfit || isNotProfitable}
      className={className}
    >
      {liquidationProfit !== undefined ? (
        <>
          Flash Liq. for{' '}
          <CurrencyValue baseValue={isNotProfitable ? -liquidationProfit : liquidationProfit} />{' '}
          {isNotProfitable ? <>Loss</> : <>Profit</>}
        </>
      ) : (
        <Spinner />
      )}
    </Button>
  )
}
