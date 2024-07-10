import { connectorsForWallets, WalletList } from '@rainbow-me/rainbowkit'
import { getInitialCustomRPCs } from '@shared/generic-react-hooks'
import { formatNumberForDisplay, NETWORK, parseQueryParam } from '@shared/utilities'
import deepmerge from 'deepmerge'
import { Chain, formatUnits, http, Transport } from 'viem'
import { createConfig, fallback } from 'wagmi'
import { RPC_URLS, WAGMI_CHAINS, WALLET_STATS_API_URL, WALLETS } from '@constants/config'

/**
 * Returns a Wagmi config with the given networks and RPCs
 * @param networks the networks to support throughout the app
 * @param options optional settings
 * @returns
 */
export const createCustomWagmiConfig = (
  networks: NETWORK[],
  options?: { useCustomRPCs?: boolean }
) => {
  const supportedNetworks = Object.values(WAGMI_CHAINS).filter(
    (chain) => networks.includes(chain.id) && !!RPC_URLS[chain.id]
  ) as any as [Chain, ...Chain[]]

  return createConfig({
    chains: supportedNetworks,
    connectors: getWalletConnectors(),
    transports: getNetworkTransports(
      supportedNetworks.map((network) => network.id),
      { useCustomRPCs: options?.useCustomRPCs }
    ),
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
    appName: 'Cabana',
    projectId: '3eb812d6ed9689e2ced204df2b9e6c76'
  })
}

/**
 * Returns network transports for Wagmi & RainbowKit
 * @param networks the networks to get transports for
 * @param options optional settings
 * @returns
 */
const getNetworkTransports = (
  networks: (keyof typeof RPC_URLS)[],
  options?: { useCustomRPCs?: boolean }
) => {
  const transports: { [chainId: number]: Transport } = {}

  const customRPCs = !!options?.useCustomRPCs ? getInitialCustomRPCs() : {}

  networks.forEach((network) => {
    const defaultRpcUrl = RPC_URLS[network] as string
    const customRpcUrl = customRPCs[network]

    transports[network] = !!customRpcUrl
      ? fallback([http(customRpcUrl), http(defaultRpcUrl), http()])
      : fallback([http(defaultRpcUrl), http()])
  })

  return transports
}

/**
 * Returns messages for localization through next-intl
 * @param locale the locale to fetch messages for
 * @returns
 */
export const getMessages = async (locale?: string) => {
  const defaultMessages: IntlMessages = (await import(`../messages/en.json`)).default

  if (!locale) return defaultMessages

  const localeMessages: IntlMessages = (await import(`../messages/${locale}.json`)).default
  const messages = deepmerge<IntlMessages>(defaultMessages, localeMessages)

  return messages
}

/**
 * Tracks deposit and its respective wallet ID on the wallet stats API
 * @param chainId the chain ID the deposit was made in
 * @param txHash the transaction hash of the deposit
 * @param walletId the ID of the wallet used to perform the deposit
 */
export const trackDeposit = async (chainId: number, txHash: `0x${string}`, walletId: string) => {
  try {
    await fetch(`${WALLET_STATS_API_URL}/addDeposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chainId, txHash, walletId })
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * Returns whether or not the current wallet connector supports ERC-2612 permits
 * @param connectorId the current wallet connector ID
 * @returns
 */
export const walletSupportsPermit = (connectorId?: string) => {
  return !connectorId?.toLowerCase().includes('coinbase')
}

/**
 * Returns a clean, concise URI for display purposes
 * @param uri a URI to clean up
 * @returns
 */
export const getCleanURI = (URI: string) => {
  if (URI.startsWith('http')) {
    return /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/i.exec(URI)?.[1] ?? ''
  } else if (URI.startsWith('ipfs://') || URI.startsWith('ipns://')) {
    return `${URI.slice(0, 15)}...`
  } else {
    return URI
  }
}

/**
 * Returns a formatted token amount rounded down to an appropriate number of fractional digits
 * @param amount a token amount to format
 * @param decimals the token's decimals
 * @returns
 */
export const getRoundedDownFormattedTokenAmount = (amount: bigint, decimals: number) => {
  const shiftedAmount = formatUnits(amount, decimals)

  const fractionDigits = shiftedAmount.split('.')[1] ?? ''
  const numFractionLeadingZeroes = (fractionDigits.match(/^0+/) || [''])[0].length
  const maximumFractionDigits = Math.max(Math.min(numFractionLeadingZeroes + 1, 4), 3)

  const roundingMultiplier = 10 ** maximumFractionDigits
  const roundedAmount =
    Math.floor(parseFloat(shiftedAmount) * roundingMultiplier) / roundingMultiplier

  return formatNumberForDisplay(roundedAmount, { maximumFractionDigits })
}
