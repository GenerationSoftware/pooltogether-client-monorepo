import { connectorsForWallets, WalletList } from '@rainbow-me/rainbowkit'
import { NETWORK, parseQueryParam } from '@shared/utilities'
import { Chain, encodePacked, fallback, http, Transport } from 'viem'
import { createConfig } from 'wagmi'
import { RPC_URLS, SUPPORTED_NETWORKS, WAGMI_CHAINS, WALLETS } from '@constants/config'
import { SwapPath } from './types'

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
    appName: 'Cabana Flash Liquidator',
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
