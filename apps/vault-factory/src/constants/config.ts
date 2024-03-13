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
import { DEFAULT_CLAIMER_ADDRESSES, NETWORK } from '@shared/utilities'
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
    lp: {
      targetFirstSaleTimeFraction: number
      liquidationGasAmount: bigint
      minAuctionAmountEth: number
    }
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
  //   lp: {
  //     targetFirstSaleTimeFraction: 0.5,
  //     liquidationGasAmount: 300_000n,
  //     minAuctionAmountEth: 0.001
  //   },
  //   yieldSources: []
  // },
  [NETWORK.optimism_sepolia]: {
    description: 'Sepolia testnet for the Optimism network.',
    prizePool: '0x5e1b40e4249644a7d7589d1197AD0F1628e79FB1',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.optimism_sepolia],
    lp: {
      targetFirstSaleTimeFraction: 0.5,
      liquidationGasAmount: 300_000n,
      minAuctionAmountEth: 0.001
    },
    yieldSources: [
      {
        id: 'aave',
        name: 'Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x332b1EB2Cc4046954725EbDFB8143fB8354ea9a7', tags: ['stablecoin'] },
          { address: '0x13E37b0Ca8b48fc2818C177c24635F90C1495C5c', tags: ['stablecoin'] },
          { address: '0x602d77e900eCD48ac9b51151936Dcc5Efe2e7FaE', tags: ['stablecoin'] },
          { address: '0xA2B0321B671A83a98Ff1F5a680b700864f57c6e7', tags: ['stablecoin'] },
          { address: '0xd96702995B2bBD78a9A39eF86f4fA5f9704fdC7D', tags: ['stablecoin'] },
          { address: '0xE77Db9f8b68BC47A82D4F47E68FB57535dF0086e' },
          { address: '0x98CED5d595e8981756f063db8D3c44a6Be9A8F86' }
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
