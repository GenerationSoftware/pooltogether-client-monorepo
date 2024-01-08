import { connectorsForWallets, Wallet } from '@rainbow-me/rainbowkit'
import { NETWORK, parseQueryParam } from '@shared/utilities'
import { encodePacked, FallbackTransport, PublicClient } from 'viem'
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
import { RPC_URLS, SUPPORTED_NETWORKS, WAGMI_CHAINS, WALLETS } from '@constants/config'
import { SwapPath } from './types'

/**
 * Returns a Wagmi config with supported networks and RPCs
 * @returns
 */
export const createCustomWagmiConfig = (): Config<
  PublicClient<FallbackTransport, Chain>,
  WebSocketPublicClient
> => {
  const networks = Object.values(WAGMI_CHAINS).filter(
    (chain) =>
      chain.id === NETWORK.mainnet ||
      (SUPPORTED_NETWORKS.includes(chain.id as number) && !!RPC_URLS[chain.id])
  )

  const { chains, publicClient } = configureChains(networks, [
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
  const appName = 'Cabana Flash Liquidator'
  const projectId = '3eb812d6ed9689e2ced204df2b9e6c76'

  const walletGroups: { groupName: string; wallets: Wallet[] }[] = []

  const defaultWallets = ['metamask', 'walletconnect', 'rainbow', 'injected', 'coinbase']
  const otherWallets = [
    'argent',
    'brave',
    'coin98',
    'imtoken',
    'ledger',
    'safe',
    'taho',
    'trust',
    'uniswap',
    'xdefi',
    'zerion'
  ]

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

/**
 * Returns an encoded swap path based on the path's length
 * @param swapPath a swap path to encode
 * @returns
 */
export const getEncodedSwapPath = (swapPath: SwapPath) => {
  if (swapPath.length === 3) {
    const abiParams = ['address', 'uint24', 'address']
    return encodePacked(abiParams, swapPath)
  } else if (swapPath.length === 5) {
    const abiParams = ['address', 'uint24', 'address', 'uint24', 'address']
    return encodePacked(abiParams, swapPath)
  } else if (swapPath.length === 7) {
    const abiParams = ['address', 'uint24', 'address', 'uint24', 'address', 'uint24', 'address']
    return encodePacked(abiParams, swapPath)
  }
}

/**
 * Returns an estimated gas amount for a flash liquidation transaction
 * @param swapPath a swap path to estimate gas for
 * @returns
 */
export const getFallbackGasAmount = (swapPath: SwapPath) => {
  return 550_000n + BigInt(((swapPath.length - 1) / 2) * 150_000)
}
