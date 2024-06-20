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
import { Address, parseUnits } from 'viem'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia
} from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = {
  mainnets: [NETWORK.mainnet, NETWORK.optimism, NETWORK.base, NETWORK.arbitrum],
  testnets: [NETWORK.optimism_sepolia, NETWORK.arbitrum_sepolia, NETWORK.base_sepolia]
} as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
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
  [NETWORK.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
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
 * Event queries' start blocks
 */
export const QUERY_START_BLOCK = {
  [NETWORK.mainnet]: 1n,
  [NETWORK.optimism]: 118_900_000n,
  [NETWORK.arbitrum]: 216_345_400n,
  [NETWORK.base]: 14_506_800n,
  [NETWORK.optimism_sepolia]: 10_793_300n,
  [NETWORK.arbitrum_sepolia]: 48_888_900n,
  [NETWORK.base_sepolia]: 10_578_500n
} as const satisfies { [chainId: number]: bigint }

/**
 * TWAB rewards settings
 */
export const TWAB_REWARDS_SETTINGS: {
  [chainId: number]: { tokenAddresses: Address[]; fromBlock: bigint }
} = {
  [NETWORK.mainnet]: { tokenAddresses: [], fromBlock: QUERY_START_BLOCK[NETWORK.mainnet] },
  [NETWORK.optimism]: {
    tokenAddresses: [
      '0x4200000000000000000000000000000000000042', // OP
      '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC
      '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', // USDC.e
      '0x4200000000000000000000000000000000000006', // WETH
      '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
      '0x395Ae52bB17aef68C2888d941736A71dC6d4e125' // POOL
    ],
    fromBlock: QUERY_START_BLOCK[NETWORK.optimism]
  },
  [NETWORK.arbitrum]: {
    tokenAddresses: [
      '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC
      '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC.e
      '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH
      '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI
      '0xCF934E2402A5e072928a39a956964eb8F2B5B79C', // POOL
      '0x912CE59144191C1204E64559FE8253a0e49E6548' // ARB
    ],
    fromBlock: QUERY_START_BLOCK[NETWORK.arbitrum]
  },
  [NETWORK.base]: {
    tokenAddresses: [
      '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC
      '0x4200000000000000000000000000000000000006', // WETH
      '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', // DAI
      '0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3', // POOL
      '0xA88594D404727625A9437C3f886C7643872296AE' // WELL
    ],
    fromBlock: QUERY_START_BLOCK[NETWORK.base]
  },
  [NETWORK.optimism_sepolia]: {
    tokenAddresses: [
      USDC_TOKEN_ADDRESSES[NETWORK.optimism_sepolia],
      POOL_TOKEN_ADDRESSES[NETWORK.optimism_sepolia]
    ],
    fromBlock: QUERY_START_BLOCK[NETWORK.optimism_sepolia]
  },
  [NETWORK.arbitrum_sepolia]: {
    tokenAddresses: [
      USDC_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia],
      POOL_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia]
    ],
    fromBlock: QUERY_START_BLOCK[NETWORK.arbitrum_sepolia]
  },
  [NETWORK.base_sepolia]: {
    tokenAddresses: [
      USDC_TOKEN_ADDRESSES[NETWORK.base_sepolia],
      POOL_TOKEN_ADDRESSES[NETWORK.base_sepolia]
    ],
    fromBlock: QUERY_START_BLOCK[NETWORK.base_sepolia]
  }
}

/**
 * Custom overwrite for wallet addresses
 */
export const WALLET_NAMES: { [address: Lowercase<Address>]: { name: string; chainId?: number } } = {
  '0x327b2ea9668a552fe5dec8e3c6e47e540a0a58c6': { name: 'GP Booster', chainId: NETWORK.base },
  '0x1dcfb8b47c2f05ce86c21580c167485de1202e12': { name: 'GP Booster', chainId: NETWORK.arbitrum }
}

/**
 * Zap settings
 */
export const ZAP_SETTINGS: {
  [chainId: number]: { zapRouter: Address; zapTokenManager: Address }
} = {
  [NETWORK.optimism]: {
    zapRouter: '0xE82343A116d2179F197111D92f9B53611B43C01c',
    zapTokenManager: '0x5a32F67C5eD74dc1b2e031b1bc2c3E965073424F'
  },
  [NETWORK.base]: {
    zapRouter: '0x6F19Da51d488926C007B9eBaa5968291a2eC6a63',
    zapTokenManager: '0x3fBD1da78369864c67d62c242d30983d6900c0f0'
  },
  [NETWORK.arbitrum]: {
    zapRouter: '0xf49F7bB6F4F50d272A0914a671895c4384696E5A',
    zapTokenManager: '0x3395BDAE49853Bc7Ab9377d2A93f42BC3A18680e'
  }
}

/**
 * Amount of native assets to suggest not spending (for gas purposes)
 */
export const NATIVE_ASSET_IGNORE_AMOUNT: { [chainId: number]: bigint } = {
  [NETWORK.optimism]: parseUnits('0.002', 18),
  [NETWORK.base]: parseUnits('0.002', 18),
  [NETWORK.arbitrum]: parseUnits('0.002', 18)
}

/**
 * Velodrome addresses
 */
export const VELODROME_ADDRESSES: {
  [chainId: number]: { router: Address; lpFactories: Lowercase<Address>[] }
} = {
  [NETWORK.optimism]: {
    router: '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858',
    lpFactories: [
      '0xf1046053aa5682b4f9a81b5481394da16be5ff5a',
      '0x25cbddb98b35ab1ff77413456b31ec81a6b6b746',
      '0x548118c7e0b865c2cfa94d15ec86b666468ac758'
    ]
  },
  [NETWORK.base]: {
    router: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
    lpFactories: [
      '0x420dd381b31aef6683db6b902084cb0ffece40da',
      '0x5e7bb104d84c7cb9b682aac2f3d509f5f406809a'
    ]
  },
  [NETWORK.arbitrum]: {
    router: '0xAAA87963EFeB6f7E0a2711F397663105Acb1805e',
    lpFactories: ['0xaaa20d08e59f6561f242b08513d36266c5a29415']
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
  depositedWithZap: 'DepositedWithZap',
  importedVaultList: 'ImportedVaultList',
  openedDelegateModal: 'OpenedDelegateModal',
  openedDepositModal: 'OpenedDepositModal',
  openedDrawModal: 'OpenedDrawModal',
  openedWithdrawModal: 'OpenedWithdrawModal',
  redeemed: 'Redeemed'
} as const

/**
 * Wallet stats API
 */
export const WALLET_STATS_API_URL = 'https://wallet-stats.api.cabana.fi'
