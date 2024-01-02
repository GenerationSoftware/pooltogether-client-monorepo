import { Wallet } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  braveWallet,
  coin98Wallet,
  coinbaseWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
  xdefiWallet,
  zerionWallet
} from '@rainbow-me/rainbowkit/wallets'
import { NETWORK, POOL_TOKEN_ADDRESSES, USDC_TOKEN_ADDRESSES } from '@shared/utilities'
import defaultVaultList from '@vaultLists/default'
import { Address } from 'viem'
import { arbitrum, arbitrumSepolia, Chain, mainnet, optimism, optimismSepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = Object.freeze({
  mainnets: [NETWORK.mainnet, NETWORK.optimism, NETWORK.arbitrum],
  testnets: [NETWORK['optimism-sepolia'], NETWORK['arbitrum-sepolia']]
})

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = Object.freeze({
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK['optimism-sepolia']]: optimismSepolia,
  [NETWORK['arbitrum-sepolia']]: arbitrumSepolia
})

/**
 * Wallets
 */
export const WALLETS: {
  [wallet: string]: (data: { appName: string; chains: Chain[]; projectId: string }) => Wallet
} = Object.freeze({
  metamask: metaMaskWallet,
  walletconnect: walletConnectWallet,
  rainbow: rainbowWallet,
  injected: injectedWallet,
  argent: argentWallet,
  coinbase: coinbaseWallet,
  ledger: ledgerWallet,
  taho: tahoWallet,
  trust: trustWallet,
  zerion: zerionWallet,
  brave: braveWallet,
  safe: safeWallet,
  xdefi: xdefiWallet,
  uniswap: uniswapWallet,
  coin98: coin98Wallet,
  imtoken: imTokenWallet
})

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
  [NETWORK['optimism-sepolia']]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK['arbitrum-sepolia']]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL
}

/**
 * Default vault lists
 */
export const DEFAULT_VAULT_LISTS = Object.freeze({
  default: defaultVaultList
})

/**
 * TWAB rewards settings
 */
export const TWAB_REWARDS_SETTINGS: {
  [chainId: number]: { tokenAddresses: Address[]; fromBlock: bigint }
} = {
  [NETWORK.mainnet]: { tokenAddresses: [], fromBlock: 1n },
  [NETWORK.optimism]: {
    tokenAddresses: [
      '0x4200000000000000000000000000000000000042', // OP
      '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC
      '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', // USDC.e
      '0x4200000000000000000000000000000000000006', // WETH
      '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
      '0x395Ae52bB17aef68C2888d941736A71dC6d4e125' // POOL
    ],
    fromBlock: 112_933_000n
  },
  [NETWORK.arbitrum]: { tokenAddresses: [], fromBlock: 1n },
  [NETWORK['optimism-sepolia']]: {
    tokenAddresses: [
      USDC_TOKEN_ADDRESSES[NETWORK['optimism-sepolia']],
      POOL_TOKEN_ADDRESSES[NETWORK['optimism-sepolia']]
    ],
    fromBlock: 4_400_000n
  },
  [NETWORK['arbitrum-sepolia']]: {
    tokenAddresses: [
      USDC_TOKEN_ADDRESSES[NETWORK['arbitrum-sepolia']],
      POOL_TOKEN_ADDRESSES[NETWORK['arbitrum-sepolia']]
    ],
    fromBlock: 1_490_000n
  }
}

/**
 * Fathom events
 */
export const FATHOM_EVENTS = {
  approvedExact: 'ApprovedExact',
  approvedInfinite: 'ApprovedInfinite',
  deposited: 'Deposited',
  depositedWithPermit: 'DepositedWithPermit',
  redeemed: 'Redeemed',
  checkedPrizes: 'CheckedPrizes',
  changedCurrency: 'ChangedCurrency',
  changedLanguage: 'ChangedLanguage',
  importedVaultList: 'ImportedVaultList'
}
