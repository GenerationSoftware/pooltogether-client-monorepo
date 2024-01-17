import { Web3Provider } from '@ethersproject/providers'
import { WidgetConfig } from '@lifi/widget'
import { Spinner } from '@shared/ui'
import { getNetwork, getWalletClient, switchNetwork, WalletClient } from '@wagmi/core'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useConnect, useDisconnect, useWalletClient } from 'wagmi'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useV4Tokens } from '@hooks/useV4Tokens'
import { useV5Tokens } from '@hooks/useV5Tokens'

const LiFiWidget = dynamic(() => import('@lifi/widget').then((module) => module.LiFiWidget), {
  ssr: false,
  loading: () => <Spinner />
})

export interface SwapWidgetProps {
  config?: Omit<
    WidgetConfig,
    'integrator' | 'chains' | 'tokens' | 'walletManagement' | 'variant' | 'subvariant'
  >
  className?: string
}

export const SwapWidget = (props: SwapWidgetProps) => {
  const { config, className } = props

  const v4Tokens = useV4Tokens()
  const { data: v5Tokens } = useV5Tokens()

  const walletManagement = useWalletManagement()

  const widgetConfig: WidgetConfig = useMemo(
    () => ({
      integrator: 'PoolTogether',
      chains: { allow: [...SUPPORTED_NETWORKS] },
      tokens: { featured: [...v5Tokens, ...v4Tokens] },
      walletManagement,
      variant: 'expandable',
      subvariant: 'default',
      ...config
    }),
    [config, v4Tokens, v5Tokens, walletManagement]
  )

  return (
    <div className={className}>
      <LiFiWidget integrator='PoolTogether' config={widgetConfig} />
    </div>
  )
}

const useWalletManagement = () => {
  const { connectAsync, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const signer = useEthersSigner()

  const walletManagement: WidgetConfig['walletManagement'] = useMemo(
    () => ({
      signer: signer,
      connect: async () => {
        const result = await connectAsync({ connector: connectors[0] })
        const walletClient = await result.connector?.getWalletClient()

        if (!!walletClient) {
          return walletClientToSigner(walletClient)
        } else {
          throw new Error('WalletClient not found')
        }
      },
      disconnect: async () => {
        disconnect()
      },
      switchChain
    }),
    [signer, connectAsync, connectors, disconnect]
  )

  return walletManagement
}

// The following functions were adapted from `https://github.com/lifinance/widget/tree/main/examples/vite`
const switchChain = async (chainId: number) => {
  const network = getNetwork()
  if (network.chain?.id !== chainId) {
    try {
      const chain = await switchNetwork({ chainId })
      return await walletClientToSignerAsync(chain?.id)
    } catch {
      throw new Error("Couldn't switch chain")
    }
  }
  return await walletClientToSignerAsync(network.chain?.id)
}
const walletClientToSigner = (walletClient?: WalletClient | null) => {
  if (!!walletClient) {
    const provider = new Web3Provider(walletClient.transport, 'any')
    const signer = provider.getSigner()
    return signer
  } else {
    throw Error('WalletClient not found')
  }
}
const walletClientToSignerAsync = async (chainId?: number) => {
  const walletClient = await getWalletClient({ chainId })
  return walletClientToSigner(walletClient)
}
const useEthersSigner = ({ chainId }: { chainId?: number } = {}) => {
  const { data: walletClient } = useWalletClient({ chainId })

  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  )
}
