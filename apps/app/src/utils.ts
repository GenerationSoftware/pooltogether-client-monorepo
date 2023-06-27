import { NETWORK, parseQueryParam } from '@pooltogether/hyperstructure-client-js'
import { connectorsForWallets, Wallet } from '@rainbow-me/rainbowkit'
import { FallbackTransport, PublicClient } from 'viem'
import {
  Chain,
  Config,
  configureChains,
  Connector,
  createConfig,
  WebSocketPublicClient
} from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import { RPC_URLS, WAGMI_CHAINS, WALLETS } from '@constants/config'

/**
 * Returns a Wagmi config with the given networks and RPCs
 * @param networks the networks to support throughout the app
 * @returns
 */
export const createCustomWagmiConfig = (
  networks: NETWORK[]
): Config<PublicClient<FallbackTransport, Chain>, WebSocketPublicClient> => {
  const supportedNetworks = Object.values(WAGMI_CHAINS).filter(
    (chain) => networks.includes(chain.id) && !!RPC_URLS[chain.id]
  )

  const { chains, publicClient } = configureChains(supportedNetworks, [
    jsonRpcProvider({
      rpc: (chain) => ({ http: RPC_URLS[chain.id as keyof typeof WAGMI_CHAINS] as string })
    }),
    publicProvider()
  ])

  const connectors = getWalletConnectors(chains)

  return createConfig({ autoConnect: true, connectors, publicClient })
}

/**
 * Returns a function to get wallet connectors for Wagmi & RainbowKit
 * @param chains array of `Chain` objects
 * @returns
 */
const getWalletConnectors = (chains: Chain[]): (() => Connector[]) => {
  const appName = 'PoolTogether'
  const projectId = '358b98f0af3cd936fe09dc21064de51d'

  const walletGroups: { groupName: string; wallets: Wallet[] }[] = []

  const defaultWallets = ['metamask', 'walletconnect', 'rainbow', 'injected', 'coinbase']
  const otherWallets = ['argent', 'ledger', 'taho', 'trust', 'zerion', 'brave', 'safe']

  const highlightedWallet = parseQueryParam('wallet', { validValues: Object.keys(WALLETS) })

  // NOTE: Don't highlight solely the injected wallet since it might be something sketchy.
  if (!!highlightedWallet && highlightedWallet !== 'injected') {
    walletGroups.push({
      groupName: 'Recommended',
      wallets: [WALLETS[highlightedWallet]({ appName, chains, projectId })]
    })
    walletGroups.push({
      groupName: 'Default',
      wallets: defaultWallets
        .filter((wallet) => wallet !== highlightedWallet)
        .map((wallet) => WALLETS[wallet]({ appName, chains, projectId }))
    })
    walletGroups.push({
      groupName: 'Other',
      wallets: otherWallets
        .filter((wallet) => wallet !== highlightedWallet)
        .map((wallet) => WALLETS[wallet]({ appName, chains, projectId }))
    })
  } else {
    walletGroups.push({
      groupName: 'Recommended',
      wallets: defaultWallets.map((wallet) => WALLETS[wallet]({ appName, chains, projectId }))
    })
    walletGroups.push({
      groupName: 'Other',
      wallets: otherWallets.map((wallet) => WALLETS[wallet]({ appName, chains, projectId }))
    })
  }

  return connectorsForWallets(walletGroups)
}
