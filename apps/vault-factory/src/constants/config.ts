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
import { mainnet, optimism, sepolia } from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [NETWORK.sepolia] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.sepolia]: sepolia
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
  [NETWORK.sepolia]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
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
  [NETWORK.sepolia]: {
    description: 'Sepolia testnet for the Ethereum network.',
    prizePool: '0x934F03f3132d3B818d7c07F25818ea3961eF18aD',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.sepolia],
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
          { address: '0x541D2a84928b7cFFe8455315c63b7F48f2f89cf8', tags: ['stablecoin'] },
          { address: '0x26542531d946E365f23e940aE0977Fd8efD9EFd7', tags: ['stablecoin'] },
          { address: '0x96A4624E73Ff5A305eD04c4895295Fe4E432E2b9', tags: ['stablecoin'] },
          { address: '0xe54D68f333826D334c08194Fa018519bB4Cec4F2', tags: ['stablecoin'] },
          { address: '0xC253890b75D75168202333F83302f9e76c5A1904', tags: ['stablecoin'] },
          { address: '0x7590DECC35A6C43E906721d44Ebc7D4B4662D583' },
          { address: '0xf86811C10b6f596684EE42cB6421a811e7B0527F' }
        ]
      }
    ]
  }
}

/**
 * Local storage keys
 */
export const LOCAL_STORAGE_KEYS = {
  vaultIds: 'vaultIds'
} as const
