import { LiFiWidget, WidgetConfig, WidgetWalletConfig } from '@lifi/widget'
import { useEffect, useMemo, useState } from 'react'
import { useConnect } from 'wagmi'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useV4Tokens } from '@hooks/useV4Tokens'
import { useV5Tokens } from '@hooks/useV5Tokens'

export interface SwapWidgetProps {
  config?: Omit<
    WidgetConfig,
    'integrator' | 'chains' | 'tokens' | 'walletConfig' | 'variant' | 'subvariant'
  >
  className?: string
}

export const SwapWidget = (props: SwapWidgetProps) => {
  const { config, className } = props

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
      ...config
    }),
    [config, v4Tokens, v5Tokens, walletConfig]
  )

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