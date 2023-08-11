import { connectorsForWallets, Wallet } from '@rainbow-me/rainbowkit'
import { formatNumberForDisplay, parseQueryParam } from '@shared/utilities'
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
import { RPC_URLS, SUPPORTED_NETWORKS, WAGMI_CHAINS, WALLETS } from '@constants/config'

/**
 * Returns a Wagmi config with supported networks and RPCs
 * @returns
 */
export const createCustomWagmiConfig = (): Config<
  PublicClient<FallbackTransport, Chain>,
  WebSocketPublicClient
> => {
  const supportedNetworks = Object.values(WAGMI_CHAINS).filter(
    (chain) => SUPPORTED_NETWORKS.includes(chain.id as number) && !!RPC_URLS[chain.id]
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
  const appName = 'Cabana Factory'
  const projectId = '3eb812d6ed9689e2ced204df2b9e6c76'

  const walletGroups: { groupName: string; wallets: Wallet[] }[] = []

  const defaultWallets = ['metamask', 'walletconnect', 'rainbow', 'injected', 'coinbase']
  const otherWallets = ['argent', 'ledger', 'taho', 'trust', 'zerion', 'brave', 'safe', 'xdefi']

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
 * Returns true if the string only include valid characters, false otherwise
 *
 * This includes letters, numbers and some common symbols (".", "_", "-", "'")
 * @param str the string to check
 * @param options optional settings
 * @returns
 */
export const isValidChars = (str: string, options?: { allowSpaces?: boolean }) => {
  return !!str.match(options?.allowSpaces ? /^[a-z0-9._ '\-]+$/i : /^[a-z0-9._'\-]+$/i)
}

/**
 * Returns a formatted string with a vault's fee percentage setting
 * @param feePercentage the 9-decimal value of a vault's fee percentage
 * @returns
 */
export const getFormattedFeePercentage = (feePercentage: number) => {
  return `${formatNumberForDisplay(feePercentage / 1e7, { maximumFractionDigits: 2 })}%`
}
