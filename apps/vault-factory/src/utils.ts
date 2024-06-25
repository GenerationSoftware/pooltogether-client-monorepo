import { connectorsForWallets, WalletList } from '@rainbow-me/rainbowkit'
import { formatNumberForDisplay, NETWORK, parseQueryParam } from '@shared/utilities'
import { Chain, fallback, http, Transport } from 'viem'
import { createConfig } from 'wagmi'
import { RPC_URLS, SUPPORTED_NETWORKS, WAGMI_CHAINS, WALLETS } from '@constants/config'

/**
 * Returns a Wagmi config with supported networks and RPCs
 * @returns
 */
export const createCustomWagmiConfig = () => {
  const networks = Object.values(WAGMI_CHAINS).filter(
    (chain) =>
      chain.id === NETWORK.mainnet ||
      (SUPPORTED_NETWORKS.includes(chain.id as number) && !!RPC_URLS[chain.id])
  ) as any as [Chain, ...Chain[]]

  return createConfig({
    chains: networks,
    connectors: getWalletConnectors(),
    transports: getNetworkTransports(networks.map((network) => network.id)),
    batch: { multicall: { batchSize: 1_024 * 1_024 } },
    ssr: true
  })
}

/**
 * Returns wallet connectors for Wagmi & RainbowKit
 * @returns
 */
const getWalletConnectors = () => {
  const walletGroups: WalletList = []

  const defaultWallets = ['injected', 'walletconnect', 'rainbow', 'metamask', 'coinbase']
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
      wallets: [WALLETS[highlightedWallet]]
    })
    walletGroups.push({
      groupName: 'Default',
      wallets: defaultWallets
        .filter((wallet) => wallet !== highlightedWallet)
        .map((wallet) => WALLETS[wallet])
    })
    walletGroups.push({
      groupName: 'Other',
      wallets: otherWallets
        .filter((wallet) => wallet !== highlightedWallet)
        .map((wallet) => WALLETS[wallet])
    })
  } else {
    walletGroups.push({
      groupName: 'Default',
      wallets: defaultWallets.map((wallet) => WALLETS[wallet])
    })
    walletGroups.push({
      groupName: 'Other',
      wallets: otherWallets.map((wallet) => WALLETS[wallet])
    })
  }

  return connectorsForWallets(walletGroups, {
    appName: 'Cabana Factory',
    projectId: '3eb812d6ed9689e2ced204df2b9e6c76'
  })
}

/**
 * Returns network transports for Wagmi & RainbowKit
 * @param networks the networks to get transports for
 * @returns
 */
const getNetworkTransports = (networks: (keyof typeof RPC_URLS)[]) => {
  const transports: { [chainId: number]: Transport } = {}

  networks.forEach((network) => {
    transports[network] = fallback([http(RPC_URLS[network]), http()])
  })

  return transports
}

/**
 * Returns true if the string only include valid characters, false otherwise
 *
 * This includes letters, numbers and some common symbols (".", "_", "-", "'", "/")
 * @param str the string to check
 * @param options optional settings
 * @returns
 */
export const isValidChars = (str: string, options?: { allowSpaces?: boolean }) => {
  return !!str.match(options?.allowSpaces ? /^[a-z0-9._ '\-\/]+$/i : /^[a-z0-9._'\-\/]+$/i)
}

/**
 * Returns a formatted string with a vault's fee percentage setting
 * @param feePercentage the 9-decimal value of a vault's fee percentage
 * @returns
 */
export const getFormattedFeePercentage = (feePercentage: number) => {
  return `${formatNumberForDisplay(feePercentage / 1e7, { maximumFractionDigits: 2 })}%`
}
