import {
  LiFiWidget,
  useWidgetEvents,
  WidgetConfig,
  WidgetEvent,
  WidgetWalletConfig
} from '@lifi/widget'
import { Token } from '@shared/types'
import { useEffect, useMemo, useState } from 'react'
import { useConnect } from 'wagmi'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useV4Tokens } from '@hooks/useV4Tokens'
import { useV5Tokens } from '@hooks/useV5Tokens'

export interface SwapWidgetProps {
  config?: Omit<
    WidgetConfig,
    | 'integrator'
    | 'chains'
    | 'tokens'
    | 'walletConfig'
    | 'variant'
    | 'subvariant'
    | 'containerStyle'
    | 'routePriority'
  >
  onSuccess?: (amount: bigint) => void
  className?: string
}

export const SwapWidget = (props: SwapWidgetProps) => {
  const { config, onSuccess, className } = props

  const v4Tokens = useV4Tokens()
  const { data: v5Tokens } = useV5Tokens()

  const walletConfig = useWidgetWalletConfig()

  const widgetConfig: WidgetConfig = useMemo(
    () => ({
      integrator: 'PoolTogether',
      chains: { allow: [...SUPPORTED_NETWORKS] },
      tokens: { featured: [...v5Tokens, ...v4Tokens] },
      walletConfig,
      variant: 'expandable',
      subvariant: 'default',
      containerStyle: {
        borderRadius: '1rem',
        boxShadow: '0 0 1rem rgba(250, 72, 232, 0.3)'
      },
      routePriority: 'CHEAPEST',
      ...config
    }),
    [config, v4Tokens, v5Tokens, walletConfig]
  )

  const widgetEvents = useWidgetEvents()

  useEffect(() => {
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      (route: { fromToken: Token; toToken: Token; toAmount: string }) => {
        if (
          (!config?.toChain || route.toToken.chainId === config.toChain) &&
          (!config?.toToken || route.toToken.address.toLowerCase() === config.toToken.toLowerCase())
        ) {
          onSuccess?.(BigInt(route.toAmount))
        }
      }
    )

    return () => widgetEvents.all.clear()
  }, [widgetEvents])

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  return (
    <div className={className}>
      {isMounted && <LiFiWidget integrator='PoolTogether' config={widgetConfig} />}
    </div>
  )
}

const useWidgetWalletConfig = () => {
  const { connect, connectors } = useConnect()

  const walletConfig: WidgetWalletConfig = useMemo(
    () => ({ onConnect: () => connect({ connector: connectors[0] }) }),
    [connect, connectors]
  )

  return walletConfig
}
