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
import {
  DEFAULT_CLAIMER_ADDRESSES,
  NETWORK,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR
} from '@shared/utilities'
import { SupportedNetwork, YieldSourceVaultTag } from 'src/types'
import { Address } from 'viem'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  gnosis,
  gnosisChiado,
  mainnet,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia
} from 'viem/chains'

/**
 * Supported networks
 */
export const SUPPORTED_NETWORKS = [
  NETWORK.mainnet,
  NETWORK.optimism,
  NETWORK.arbitrum,
  NETWORK.base,
  NETWORK.scroll,
  NETWORK.gnosis,
  NETWORK.optimism_sepolia,
  NETWORK.arbitrum_sepolia,
  NETWORK.base_sepolia,
  NETWORK.scroll_sepolia,
  NETWORK.gnosis_chiado
] as const

/**
 * Wagmi networks
 */
export const WAGMI_CHAINS = {
  [NETWORK.mainnet]: mainnet,
  [NETWORK.optimism]: optimism,
  [NETWORK.arbitrum]: arbitrum,
  [NETWORK.base]: base,
  [NETWORK.scroll]: scroll,
  [NETWORK.gnosis]: gnosis,
  [NETWORK.optimism_sepolia]: optimismSepolia,
  [NETWORK.arbitrum_sepolia]: arbitrumSepolia,
  [NETWORK.base_sepolia]: baseSepolia,
  [NETWORK.scroll_sepolia]: scrollSepolia,
  [NETWORK.gnosis_chiado]: gnosisChiado
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
  [NETWORK.scroll]: process.env.NEXT_PUBLIC_SCROLL_RPC_URL,
  [NETWORK.gnosis]: process.env.NEXT_PUBLIC_GNOSIS_RPC_URL,
  [NETWORK.optimism_sepolia]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL,
  [NETWORK.arbitrum_sepolia]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL,
  [NETWORK.base_sepolia]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  [NETWORK.scroll_sepolia]: process.env.NEXT_PUBLIC_SCROLL_SEPOLIA_RPC_URL,
  [NETWORK.gnosis_chiado]: process.env.NEXT_PUBLIC_GNOSIS_CHIADO_RPC_URL
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
    contributor?: Address
  }
> = {
  [NETWORK.mainnet]: {
    description: 'The settlement layer for the internet.',
    prizePool: '0x7865D01da4C9BA2F69B7879e6d2483aB6B354d95',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.mainnet],
    lp: { targetAuctionPeriod: SECONDS_PER_DAY, targetAuctionPriceUsd: 100 },
    yieldSources: [],
    contributor: '0x84882eb46da981d1ad2f154359061942ca1c062f'
  },
  [NETWORK.optimism]: {
    description: 'The OG optimistic rollup on Ethereum.',
    prizePool: '0xF35fE10ffd0a9672d0095c435fd8767A7fe29B55',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.optimism],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'beefy',
        name: 'Beefy',
        href: 'https://beefy.com/',
        description: 'Multichain yield optimizer',
        vaults: [
          { address: '0x1dBD083e1422c8c7AcD7091F5437e8C2854F25f4', tags: ['lp'] },
          { address: '0xCC60ebB05b1E327Ccb4F6c297B9404fdD2Ff5fC2', tags: ['lp'] },
          { address: '0x6d5e473D909d2f09DBFfA08E4F64B8d9E3748360', tags: ['stablecoin'] },
          { address: '0xEb0f1cBDac4Ff1BeE4a9806C664f517B099bFbC3', tags: ['stablecoin'] },
          { address: '0x0654BE5e04827e7B999fcE537882270798F57FE9', tags: ['lp'] },
          { address: '0x4a9Bff2f96b441b2E8f7142285B4E708BD18a721', tags: ['lp'] },
          { address: '0xA240fEd2198E2549C090b7b6b3b7748f9330E88a', tags: ['lp'] },
          { address: '0xEcbe6Eef225f143EE4Eb26368a2f6BE1E60835bC', tags: ['lp'] },
          { address: '0xAc314aa0FB72aa53A100AaF55A4CF9d9949FF9c0', tags: ['lp'] },
          { address: '0x3A23118b62d693b6F92D4dd48a8b34AedCcba7f3', tags: ['lp'] },
          { address: '0x068FA527EAa896440a78BC6a174D85dd31C4B345', tags: ['lp'] }
        ]
      }
    ],
    contributor: '0x68A100A3729Fc04ab26Fb4C0862Df22CEec2f18B'
  },
  [NETWORK.arbitrum]: {
    description: `Arbitrum's flagship optimistic rollup on Ethereum.`,
    prizePool: '0x52E7910C4C287848C8828e8b17b8371f4Ebc5D42',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.arbitrum],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [],
    contributor: '0x5f9292672e33b76b70dea44163c780376b4da397'
  },
  [NETWORK.base]: {
    description: `Coinbase's optimistic rollup on Ethereum.`,
    prizePool: '0x45b2010d8A4f08b53c9fa7544C51dFd9733732cb',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.base],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'beefy',
        name: 'Beefy',
        href: 'https://beefy.com/',
        description: 'Multichain yield optimizer',
        vaults: [{ address: '0xC5b394778A1F28735C380A15E9cC8a014F40e2B1', tags: ['lp'] }]
      }
    ],
    contributor: '0x4e30c0a8cce76940d87ae62eb12f3ac536a996f4'
  },
  [NETWORK.scroll]: {
    description: `A zkEVM rollup on Ethereum.`,
    prizePool: '0xA6ecd65C3EECdb59C2F74956DDF251Ab5D899845',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.scroll],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [],
    contributor: '0xbDf6bD9BDe192861BD8e0e0a11dAD71f178A34c8'
  },
  [NETWORK.gnosis]: {
    description: `A community-owned rollup on Ethereum.`,
    prizePool: '0x0c08c2999e1a14569554eddbcda9da5e1918120f',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.gnosis],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'dai',
        name: 'DAI Savings Rate',
        href: 'https://summer.fi/earn/dsr',
        description: 'Native DAI yield',
        vaults: [{ address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701', tags: ['stablecoin'] }]
      }
    ],
    contributor: '0xbDf6bD9BDe192861BD8e0e0a11dAD71f178A34c8'
  },
  [NETWORK.optimism_sepolia]: {
    description: 'Sepolia testnet for the Optimism network.',
    prizePool: '0x122FecA66c2b1Ba8Fa9C39E88152592A5496Bc99',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.optimism_sepolia],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'aave',
        name: 'Faux Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x6cDfb8288F5445255F9dfF6782471DE7556fD481', tags: ['stablecoin'] },
          { address: '0x19f8F337C72C430cFDe9EC07D5C51639ad143bd5', tags: ['stablecoin'] },
          { address: '0x14A1EDBB4723AA163A11742Df934C53C43feEC23', tags: ['stablecoin'] },
          { address: '0xaF9Ad81aB225Fe2d24dD2067a38A4CE69Ec07784' },
          { address: '0xDD41e571f0f7614Ae37935538f92589363843266' }
        ]
      }
    ]
  },
  [NETWORK.arbitrum_sepolia]: {
    description: 'Sepolia testnet for the Arbitrum network.',
    prizePool: '0x51211a6b7aa15b3f1063f151ec3343898cd7bd75',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.arbitrum_sepolia],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'aave',
        name: 'Faux Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x6Cfe985a336bCA7356b73dE6a83d2dA1B1ddC234', tags: ['stablecoin'] },
          { address: '0x3d7A9ab3744259C20019972b09c661fb9F9aEdfd', tags: ['stablecoin'] },
          { address: '0xE96dA2357f5A6fD3ECd7E3436ea10726394CB99d' }
        ]
      }
    ]
  },
  [NETWORK.base_sepolia]: {
    description: 'Sepolia testnet for the Base network.',
    prizePool: '0xcb514c0847a9eb30aaa05fc290ddb40afdd44bdb',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.base_sepolia],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'aave',
        name: 'Faux Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x1E72B8abA9ef584a6E68e0128F7e05b453e96d43', tags: ['stablecoin'] },
          { address: '0xBF8D45B7b07cD0AEAE37ba4369Be1768aaC23569', tags: ['stablecoin'] },
          { address: '0xbbbEDC3689aA47D5410e247135fa817AB9754106' }
        ]
      }
    ]
  },
  [NETWORK.scroll_sepolia]: {
    description: 'Sepolia testnet for the Scroll network.',
    prizePool: '0xfe2402c48cea2a8a115a1555129046c48a59f835',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.scroll_sepolia],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'aave',
        name: 'Faux Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x64dc7544c0da701cdf74abf4937bed7f6abb9386', tags: ['stablecoin'] },
          { address: '0x89db94bdf64edad2b04f1e031b8354f7917ce58f', tags: ['stablecoin'] },
          { address: '0xfc2ba55cfd10c872d0adb5e6ed3018ad999e6295' }
        ]
      }
    ]
  },
  [NETWORK.gnosis_chiado]: {
    description: 'Chiado testnet for the Gnosis network.',
    prizePool: '0x678b5a8b958e1582b2677dc21f7fdef4476d9bd7',
    claimer: DEFAULT_CLAIMER_ADDRESSES[NETWORK.gnosis_chiado],
    lp: { targetAuctionPeriod: SECONDS_PER_HOUR * 6, targetAuctionPriceUsd: 10 },
    yieldSources: [
      {
        id: 'aave',
        name: 'Faux Aave',
        href: 'https://aave.com/',
        description: 'Lending and borrowing protocol',
        vaults: [
          { address: '0x49651e4eda17bbf33631ac2076e83f008d18329c', tags: ['stablecoin'] },
          { address: '0xd24aa5dee5d9d132ce3af9d2f410be9aa147b3bb', tags: ['stablecoin'] },
          { address: '0x1e9a05e410c81dd4fedb41b8a724f68c916e9de5' }
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

/**
 * Contributor ABI
 */
export const contributorABI = [
  {
    inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
    name: 'AddressEmptyCode',
    type: 'error'
  },
  { inputs: [], name: 'FailedCall', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'needed', type: 'uint256' }
    ],
    name: 'InsufficientBalance',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'SafeERC20FailedOperation',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'contract IPrizePool', name: 'prizePool', type: 'address' },
      { internalType: 'address', name: 'vault', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'contribute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const
