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
import { DEFAULT_CLAIMER_ADDRESSES, NETWORK, SECONDS_PER_HOUR } from '@shared/utilities'
import { SupportedNetwork, YieldSourceVaultTag } from 'src/types'
import { Address } from 'viem'
import { mainnet, optimism, optimismSepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [NETWORK.optimism_sepolia] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.optimism_sepolia]: optimismSepolia
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
  [NETWORK.optimism_sepolia]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL
} as const

/**
 * Network config
 */
export const NETWORK_CONFIG: Record<
  SupportedNetwork,
  {
    description: string
    prizePool: Address
    claimer: Address
    lp: { targetAuctionPeriod: number; targetAuctionPriceUsd: number }
    yieldSources: {
      id: string
      name: string
      href: string
      description: string
      vaults: { address: Address; tags?: YieldSourceVaultTag[] }[]
    }[]
  }
> = {
  // [NETWORK.optimism]: {
  //   description: 'The OG optimistic rollup on Ethereum.',
  //   prizePool: '',
  //   claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.optimism],
  //   lp: { targetAuctionPeriod: SECONDS_PER_HOUR, targetAuctionPriceUsd: 10 },
  //   yieldSources: []
  // },
  [NETWORK.optimism_sepolia]: {
    description: 'Sepolia testnet for the Optimism network.',
    prizePool: '0x23Fc16532B025d2EBF73614b730793715aF56ec7',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.optimism_sepolia],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'aave',
        name: 'Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x4Db21A0C80e8f2DB86a3A3991386dB432fE9f01b', tags: ['stablecoin'] },
          { address: '0x94Af72970ca8a2F6f5F39135DB53A9e0e2463f90', tags: ['stablecoin'] },
          { address: '0xE22824a901d726eC8A2b05878F9fE1a0eFeb3CdC', tags: ['stablecoin'] },
          { address: '0xD03331c959d81228cFb317Fe02C33183d40F6C19' },
          { address: '0xD18cbfB9f71B50410C2494F57576722C194f94Ac' }
        ]
      }
    ]
  }
}

/**
 * Vault tag display names
 */
export const VAULT_TAGS: Record<YieldSourceVaultTag, string> = {
  stablecoin: 'Stablecoin',
  lp: 'LP Token',
  lst: 'Liquid Staking'
}

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  vaultIds: 'vaultIds'
} as const
