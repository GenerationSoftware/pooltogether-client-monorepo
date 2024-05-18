import { CreateWalletFn } from '@rainbow-me/rainbowkit/dist/wallets/Wallet'
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
import { arbitrumSepolia, base, baseSepolia, mainnet, optimism, optimismSepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = {
  mainnets: [NETWORK.mainnet, NETWORK.optimism, NETWORK.base],
  testnets: [NETWORK.optimism_sepolia, NETWORK.arbitrum_sepolia, NETWORK.base_sepolia]
} as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.base]: base,
  [NETWORK.optimism_sepolia]: optimismSepolia,
  [NETWORK.arbitrum_sepolia]: arbitrumSepolia,
  [NETWORK.base_sepolia]: baseSepolia
} as const

/**
 * Wallets
 */
export const WALLETS: { [wallet: string]: CreateWalletFn } = {
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
}

/**
 * RPCs
 */
export const RPC_URLS = {
  [NETWORK.mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  [NETWORK.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
  [NETWORK.base]: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  [NETWORK.optimism_sepolia]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK.arbitrum_sepolia]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL,
  [NETWORK.base_sepolia]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
} as const

/**
 * Default vault lists
 */
export const DEFAULT_VAULT_LISTS = {
  default: defaultVaultList
} as const

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
    fromBlock: 118_900_000n
  },
  [NETWORK.base]: {
    tokenAddresses: [
      '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC
      '0x4200000000000000000000000000000000000006', // WETH
      '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', // DAI
      '0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3', // POOL
      '0xA88594D404727625A9437C3f886C7643872296AE' // WELL
    ],
    fromBlock: 14_506_800n
  },
  [NETWORK.optimism_sepolia]: {
    tokenAddresses: [
      USDC_TOKEN_ADDRESSES[NETWORK.optimism_sepolia],
      POOL_TOKEN_ADDRESSES[NETWORK.optimism_sepolia]
    ],
    fromBlock: 10_793_300n
  },
  [NETWORK.arbitrum_sepolia]: {
    tokenAddresses: [
      USDC_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia],
      POOL_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia]
    ],
    fromBlock: 42_351_000n
  },
  [NETWORK.base_sepolia]: {
    tokenAddresses: [
      USDC_TOKEN_ADDRESSES[NETWORK.base_sepolia],
      POOL_TOKEN_ADDRESSES[NETWORK.base_sepolia]
    ],
    fromBlock: 9_156_200n
  }
}

/**
 * Zap settings
 */
export const ZAP_SETTINGS: {
  [chainId: number]: { zapRouterAddress: Address; zapTokenManager: Address }
} = {
  [NETWORK.optimism]: {
    zapRouterAddress: '0xE82343A116d2179F197111D92f9B53611B43C01c',
    zapTokenManager: '0x5a32F67C5eD74dc1b2e031b1bc2c3E965073424F'
  }
}

/**
 * Fathom events
 */
export const FATHOM_EVENTS = {
  approvedExact: 'ApprovedExact',
  changedCurrency: 'ChangedCurrency',
  changedLanguage: 'ChangedLanguage',
  changedRPC: 'ChangedRPC',
  checkedPrizes: 'CheckedPrizes',
  delegated: 'Delegated',
  deposited: 'Deposited',
  depositedWithPermit: 'DepositedWithPermit',
  importedVaultList: 'ImportedVaultList',
  openedDelegateModal: 'OpenedDelegateModal',
  openedDepositModal: 'OpenedDepositModal',
  openedDrawModal: 'OpenedDrawModal',
  openedWithdrawModal: 'OpenedWithdrawModal',
  redeemed: 'Redeemed'
} as const

export const WALLET_STATS_API_URL = 'https://wallet-stats.api.cabana.fi'
