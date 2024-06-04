import { Address } from 'viem'
import { lower } from './utils/addresses'

/**
 * Network IDs
 */
export enum NETWORK {
  mainnet = 1,
  sepolia = 11155111,
  bsc = 56,
  bsc_testnet = 97,
  xdai = 100,
  polygon = 137,
  mumbai = 80001,
  optimism = 10,
  optimism_sepolia = 11155420,
  avalanche = 43114,
  fuji = 43113,
  celo = 42220,
  celo_testnet = 44787,
  arbitrum = 42161,
  arbitrum_sepolia = 421614,
  base = 8453,
  base_sepolia = 84532
}
export type NETWORK_NAME = keyof typeof NETWORK

/**
 * POOL token addresses
 */
export const POOL_TOKEN_ADDRESSES = {
  [NETWORK.mainnet]: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
  [NETWORK.polygon]: '0x25788a1a171ec66Da6502f9975a15B609fF54CF6',
  [NETWORK.optimism]: '0x395ae52bb17aef68c2888d941736a71dc6d4e125',
  [NETWORK.arbitrum]: '0xCF934E2402A5e072928a39a956964eb8F2B5B79C',
  [NETWORK.base]: '0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3',
  [NETWORK.optimism_sepolia]: '0x24Ffb8Ca3DeA588B267A15F1d94766dCbA034aE6',
  [NETWORK.arbitrum_sepolia]: '0x02A32F041C16158bcC1CaA90e22B230958eD5c4b',
  [NETWORK.base_sepolia]: '0x50Ac98a0CA373a3935069A8755D895663d2F4A16'
} as const satisfies { [chainId: number]: Address }

/**
 * USDC token addresses
 */
export const USDC_TOKEN_ADDRESSES: { [chainId: number]: Lowercase<Address> } = {
  [NETWORK.mainnet]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  [NETWORK.polygon]: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
  [NETWORK.optimism]: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
  [NETWORK.arbitrum]: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  [NETWORK.base]: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  [NETWORK.optimism_sepolia]: '0xded96a50515f1a4620a3c5244fae15ed7d216d4a',
  [NETWORK.arbitrum_sepolia]: '0x7b2e0bd66ef04d26db132391b5600af3887e9f9f',
  [NETWORK.base_sepolia]: '0x034109d90e70b972617e96b33295e724fff5887a'
}

/**
 * Prize Pools
 */
export const PRIZE_POOLS: {
  chainId: NETWORK
  address: Address
  options: {
    prizeTokenAddress: Address
    drawManagerAddress: Address
    twabControllerAddress: Address
    drawPeriodInSeconds: number
    drawAuctionDurationInSeconds: number
    tierShares: number
    reserveShares: number
  }
}[] = [
  {
    chainId: NETWORK.optimism,
    address: '0xF35fE10ffd0a9672d0095c435fd8767A7fe29B55',
    options: {
      prizeTokenAddress: '0x4200000000000000000000000000000000000006',
      drawManagerAddress: '0x7eED7444dE862c4F79c5820ff867FA3A82641857',
      twabControllerAddress: '0xCB0672dE558Ad8F122C0E081f0D35480aB3be167',
      drawPeriodInSeconds: 86_400,
      drawAuctionDurationInSeconds: 10_800,
      tierShares: 100,
      reserveShares: 30
    }
  },
  {
    chainId: NETWORK.base,
    address: '0x45b2010d8A4f08b53c9fa7544C51dFd9733732cb',
    options: {
      prizeTokenAddress: '0x4200000000000000000000000000000000000006',
      drawManagerAddress: '0x8A2782bedC79982EBFa3b68B315a2eE40DAF6aB0',
      twabControllerAddress: '0x7e63601F7e28C758Feccf8CDF02F6598694f44C6',
      drawPeriodInSeconds: 86_400,
      drawAuctionDurationInSeconds: 10_800,
      tierShares: 100,
      reserveShares: 30
    }
  },
  {
    chainId: NETWORK.arbitrum,
    address: '0x52E7910C4C287848C8828e8b17b8371f4Ebc5D42',
    options: {
      prizeTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      drawManagerAddress: '0xc00146957Ff55FaD7d27Deb69ff95d79Fdcd37e6',
      twabControllerAddress: '0x971ECc4E75c5FcFd8fc3eADc8F0c900b5914DC75',
      drawPeriodInSeconds: 86_400,
      drawAuctionDurationInSeconds: 10_800,
      tierShares: 100,
      reserveShares: 30
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x122FecA66c2b1Ba8Fa9C39E88152592A5496Bc99',
    options: {
      prizeTokenAddress: '0x4a61B6f54157840E80e0C47f1A628C0B3744a739',
      drawManagerAddress: '0xcCF00490434D845Ec27cB8B4C05E6356318AafAb',
      twabControllerAddress: '0xE6e86a136aa9A45D11d8a5169F9fDF57704DB5cA',
      drawPeriodInSeconds: 14_400,
      drawAuctionDurationInSeconds: 3_600,
      tierShares: 100,
      reserveShares: 30
    }
  },
  {
    chainId: NETWORK.base_sepolia,
    address: '0xcb514c0847a9eb30aaa05fc290ddb40afdd44bdb',
    options: {
      prizeTokenAddress: '0x019Aa44D02715e4042b1BA3b4D2FA9bCEF33c002',
      drawManagerAddress: '0x6F9bb3558c39c45A679D514DA68CeB899209A5d4',
      twabControllerAddress: '0x3fFC739e78F84fd116072E3621e5CAFb3a80405f',
      drawPeriodInSeconds: 14_400,
      drawAuctionDurationInSeconds: 3_600,
      tierShares: 100,
      reserveShares: 30
    }
  },
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0x51211a6b7Aa15B3f1063F151Ec3343898cd7bd75',
    options: {
      prizeTokenAddress: '0x060faD1bCA90E5b1EFca0d93FEBeC96E638fD8A6',
      drawManagerAddress: '0x8DDFAE33064E525f38Ab928CF070d5dd04A9b894',
      twabControllerAddress: '0xaA465Df2AF3F5370b47c2B56219B4639182e5B16',
      drawPeriodInSeconds: 14_400,
      drawAuctionDurationInSeconds: 3_600,
      tierShares: 100,
      reserveShares: 30
    }
  }
]

/**
 * Stablecoin addresses and their corresponding fiat currency
 */
export const STABLECOINS: Record<NETWORK, { [address: Lowercase<Address>]: string }> = {
  [NETWORK.mainnet]: {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd', // USDC
    '0x6b175474e89094c44da98b954eedeac495271d0f': 'usd', // DAI
    '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': 'usd' // GUSD
  },
  [NETWORK.sepolia]: {},
  [NETWORK.bsc]: {},
  [NETWORK.bsc_testnet]: {},
  [NETWORK.xdai]: {},
  [NETWORK.polygon]: {
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 'usd' // USDC.e
  },
  [NETWORK.mumbai]: {},
  [NETWORK.optimism]: {
    '0x0b2c639c533813f4aa9d7837caf62653d097ff85': 'usd', // USDC
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': 'usd', // USDC.e
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': 'usd', // DAI
    '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819': 'usd' // LUSD
  },
  [NETWORK.optimism_sepolia]: {
    '0xded96a50515f1a4620a3c5244fae15ed7d216d4a': 'usd', // USDC
    '0xef38f21ec5477f6e3d4b7e9f0dea44a788c669b0': 'usd', // DAI
    '0x68f92539f64e486f2853bb2892933a21b54829e5': 'usd' // GUSD
  },
  [NETWORK.avalanche]: {
    '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664': 'usd' // USDC.e
  },
  [NETWORK.fuji]: {},
  [NETWORK.celo]: {},
  [NETWORK.celo_testnet]: {},
  [NETWORK.arbitrum]: {
    '0xaf88d065e77c8cc2239327c5edb3a432268e5831': 'usd', // USDC
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': 'usd', // USDC.e
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': 'usd', // DAI
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': 'usd' // USDT
  },
  [NETWORK.arbitrum_sepolia]: {
    '0x7b2e0bd66ef04d26db132391b5600af3887e9f9f': 'usd', // USDC
    '0xfe045beefda06606fc5f441ccca2fe8c903e9725': 'usd' // DAI
  },
  [NETWORK.base]: {
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 'usd', // USDC
    '0x50c5725949a6f0c72e6c4a641f24049a917db0cb': 'usd', // DAI
    '0x368181499736d0c0cc614dbb145e2ec1ac86b8c6': 'usd' // LUSD
  },
  [NETWORK.base_sepolia]: {
    '0x034109d90e70b972617e96b33295e724fff5887a': 'usd', // USDC
    '0xe4b4a71923aecb4b8924bda8c31941a8ab50ff86': 'usd' // DAI
  }
}

/**
 * Wrapped native asset addresses (example: WETH, WMATIC, etc.)
 */
export const WRAPPED_NATIVE_ASSETS: Record<NETWORK, Lowercase<Address> | null> = {
  [NETWORK.mainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [NETWORK.sepolia]: null,
  [NETWORK.bsc]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [NETWORK.bsc_testnet]: null,
  [NETWORK.xdai]: null,
  [NETWORK.polygon]: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  [NETWORK.mumbai]: null,
  [NETWORK.optimism]: '0x4200000000000000000000000000000000000006',
  [NETWORK.optimism_sepolia]: null,
  [NETWORK.avalanche]: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  [NETWORK.fuji]: null,
  [NETWORK.celo]: null,
  [NETWORK.celo_testnet]: null,
  [NETWORK.arbitrum]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [NETWORK.arbitrum_sepolia]: null,
  [NETWORK.base]: '0x4200000000000000000000000000000000000006',
  [NETWORK.base_sepolia]: null
}

/**
 * TWAB rewards addresses
 */
export const TWAB_REWARDS_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x90D383dEA4dcE52D3e5D3C93dE75eF36da3Ea9Ea',
  [NETWORK.base]: '0x86f0923d20810441efc593eb0f2825c6bff2dc09',
  [NETWORK.arbitrum]: '0xe21ac38a7e80104c4f6512ce4908a22bc09c59be',
  [NETWORK.optimism_sepolia]: '0x505E334544689C7A4BF4c6A0CF8d52A5fB6F0A4A',
  [NETWORK.arbitrum_sepolia]: '0x6f38ebc8587e2e6b2f79d9f8d045abf44a3bfd13',
  [NETWORK.base_sepolia]: '0x3af156d5eae4bb67afbe9e96e646371f7ba37d18'
}

/**
 * Vault factory addresses
 */
export const VAULT_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x0c379e9b71ba7079084ada0d1c1aeb85d24dfd39',
  [NETWORK.base]: '0xe32f6344875494ca3643198d87524519dc396ddf',
  [NETWORK.arbitrum]: '0x44be003e55e7ce8a2e0ecc3266f8a9a9de2c07bc',
  [NETWORK.optimism_sepolia]: '0x5ecc83b1a0ba255713b69154451826a937702435',
  [NETWORK.arbitrum_sepolia]: '0x8895efb4299bce2c7e4a5c434c49534bb357bdbc',
  [NETWORK.base_sepolia]: '0xf0346c7889061b29977e66034f284bfb5c761d29'
}

/**
 * Liquidation pair factory addresses
 */
export const LIQUIDATION_PAIR_FACTORY_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x80F86691632d9863E6bCaa472e5c34574F77c7D1',
  [NETWORK.base]: '0x8557a9a33b573dc4403708c5a8746a52648374ea',
  [NETWORK.arbitrum]: '0x163402522fc0c0a7863479a069a8470fb22dfd3f',
  [NETWORK.optimism_sepolia]: '0x99e05e2346885D1c1Ce714c9e794A7ca6E3634b4',
  [NETWORK.arbitrum_sepolia]: '0xe098c4340329f0b0b72eb25e193a70eadb2499f7',
  [NETWORK.base_sepolia]: '0x6e4b2dd17a0b0db73f34a5edabda9ec22c70bce8'
}

/**
 * Default claimer addresses
 */
export const DEFAULT_CLAIMER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x0b5a1dc536D5A67C66D00B337E6b189385BD8438',
  [NETWORK.base]: '0x5ffeee76d1e2d2d1d18ba0bc77d8d047b85e1e87',
  [NETWORK.arbitrum]: '0x1e68e5e92d22aefdc791a61c874c06831023e571',
  [NETWORK.optimism_sepolia]: '0xac2be4D9C0d8841c1f0Af43A564BDF2EF3Df3954',
  [NETWORK.arbitrum_sepolia]: '0x24ad9015e48951f74f33dc071af34a6db14e95d9',
  [NETWORK.base_sepolia]: '0xdc5e799a3e57f7642210feb9ebb0d1a38cf4fe84'
}

/**
 * Liquidation router addresses
 */
export const LIQUIDATION_ROUTER_ADDRESSES: { [chainId: number]: Address } = {
  [NETWORK.optimism]: '0x7766b5E6839a1a218Fc861b0810C504490876136',
  [NETWORK.base]: '0xa9c937a0d1d22ad79099aea10efa62a270dfc22c',
  [NETWORK.arbitrum]: '0x7b4a60964994422bf19ae48a90fbff806767db73',
  [NETWORK.optimism_sepolia]: '0x4694F3CD7fedD269aaF2a168e12C544f829a6b50',
  [NETWORK.arbitrum_sepolia]: '0xb420f83c5936762e6fe0ceef16440df83479d3b7',
  [NETWORK.base_sepolia]: '0x86692766da4cca2f9581729d74da36d180643f8f'
}

/**
 * Dolphin address
 */
export const DOLPHIN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

/**
 * Dead address
 */
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead'

/**
 * Optimism gas oracle address
 */
export const OP_GAS_ORACLE_ADDRESS = '0x420000000000000000000000000000000000000f'

/**
 * Subgraph API URLs
 */
export const SUBGRAPH_API_URLS = {
  [NETWORK.optimism]: 'https://api.studio.thegraph.com/query/63100/pt-v5-optimism/version/latest',
  [NETWORK.base]: 'https://api.studio.thegraph.com/query/41211/pt-v5-base/version/latest',
  [NETWORK.arbitrum]: 'https://api.studio.thegraph.com/query/63100/pt-v5-arbitrum/version/latest',
  [NETWORK.optimism_sepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-op-sepolia/version/latest',
  [NETWORK.arbitrum_sepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-arbitrum-sepolia/version/latest',
  [NETWORK.base_sepolia]:
    'https://api.studio.thegraph.com/query/63100/pt-v5-base-sepolia/version/latest'
} as const satisfies { [chainId: number]: `https://${string}` }

/**
 * Token Prices API URL
 */
export const TOKEN_PRICES_API_URL = 'https://token-prices.api.cabana.fi'

/**
 * Networks supported by the price caching API
 */
export const TOKEN_PRICE_API_SUPPORTED_NETWORKS: NETWORK[] = [
  NETWORK.mainnet,
  NETWORK.optimism,
  NETWORK.arbitrum,
  NETWORK.base,
  NETWORK.polygon
]

/**
 * Redirects for tokens without pricing data on the caching API
 */
export const TOKEN_PRICE_REDIRECTS: {
  [chainId: number]: {
    [address: Lowercase<Address>]: { chainId: number; address: Lowercase<Address> }
  }
} = {
  [NETWORK.optimism]: {
    /* POOL */
    [POOL_TOKEN_ADDRESSES[NETWORK.optimism].toLowerCase()]: {
      chainId: NETWORK.mainnet,
      address: lower(POOL_TOKEN_ADDRESSES[NETWORK.mainnet])
    },
    /* USDA */
    '0x0000206329b97db379d5e1bf586bbdb969c63274': {
      chainId: NETWORK.mainnet,
      address: '0x0000206329b97db379d5e1bf586bbdb969c63274'
    },
    /* EURA */
    '0x9485aca5bbbe1667ad97c7fe7c4531a624c8b1ed': {
      chainId: NETWORK.mainnet,
      address: '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8'
    }
  },
  [NETWORK.arbitrum]: {
    /* POOL */
    [POOL_TOKEN_ADDRESSES[NETWORK.arbitrum].toLowerCase()]: {
      chainId: NETWORK.mainnet,
      address: lower(POOL_TOKEN_ADDRESSES[NETWORK.mainnet])
    },
    /* USDA */
    '0x0000206329b97db379d5e1bf586bbdb969c63274': {
      chainId: NETWORK.mainnet,
      address: '0x0000206329b97db379d5e1bf586bbdb969c63274'
    },
    /* EURA */
    '0xfa5ed56a203466cbbc2430a43c66b9d8723528e7': {
      chainId: NETWORK.mainnet,
      address: '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8'
    }
  },
  [NETWORK.base]: {
    /* POOL */
    [POOL_TOKEN_ADDRESSES[NETWORK.base].toLowerCase()]: {
      chainId: NETWORK.mainnet,
      address: lower(POOL_TOKEN_ADDRESSES[NETWORK.mainnet])
    },
    /* wstETH */
    '0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452': {
      chainId: NETWORK.mainnet,
      address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'
    },
    /* USDA */
    '0x0000206329b97db379d5e1bf586bbdb969c63274': {
      chainId: NETWORK.mainnet,
      address: '0x0000206329b97db379d5e1bf586bbdb969c63274'
    },
    /* EURA */
    '0xa61beb4a3d02decb01039e378237032b351125b4': {
      chainId: NETWORK.mainnet,
      address: '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8'
    }
  },
  [NETWORK.polygon]: {
    /* MATIC */
    [DOLPHIN_ADDRESS]: {
      chainId: NETWORK.polygon,
      address: '0x0000000000000000000000000000000000001010'
    },
    /* USDA */
    '0x0000206329b97db379d5e1bf586bbdb969c63274': {
      chainId: NETWORK.mainnet,
      address: '0x0000206329b97db379d5e1bf586bbdb969c63274'
    },
    /* EURA */
    '0xe0b52e49357fd4daf2c15e02058dce6bc0057db4': {
      chainId: NETWORK.mainnet,
      address: '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8'
    }
  },
  [NETWORK.optimism_sepolia]: {
    /* ETH */
    [DOLPHIN_ADDRESS]: {
      chainId: NETWORK.mainnet,
      address: DOLPHIN_ADDRESS
    },
    /* DAI */
    '0xef38f21ec5477f6e3d4b7e9f0dea44a788c669b0': {
      chainId: NETWORK.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    /* USDC */
    [USDC_TOKEN_ADDRESSES[NETWORK.optimism_sepolia]]: {
      chainId: NETWORK.mainnet,
      address: USDC_TOKEN_ADDRESSES[NETWORK.mainnet]
    },
    /* GUSD */
    '0x68f92539f64e486f2853bb2892933a21b54829e5': {
      chainId: NETWORK.mainnet,
      address: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd'
    },
    /* WBTC */
    '0x6c6a62b0861d8f2b946456ba9dcd0f3baec54147': {
      chainId: NETWORK.mainnet,
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
    },
    /* WETH */
    '0x4a61b6f54157840e80e0c47f1a628c0b3744a739': {
      chainId: NETWORK.mainnet,
      address: WRAPPED_NATIVE_ASSETS[NETWORK.mainnet] as Lowercase<Address>
    },
    /* POOL */
    [POOL_TOKEN_ADDRESSES[NETWORK.optimism_sepolia].toLowerCase()]: {
      chainId: NETWORK.mainnet,
      address: lower(POOL_TOKEN_ADDRESSES[NETWORK.mainnet])
    }
  },
  [NETWORK.arbitrum_sepolia]: {
    /* ETH */
    [DOLPHIN_ADDRESS]: {
      chainId: NETWORK.mainnet,
      address: DOLPHIN_ADDRESS
    },
    /* DAI */
    '0xfe045beefda06606fc5f441ccca2fe8c903e9725': {
      chainId: NETWORK.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    /* USDC */
    [USDC_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia]]: {
      chainId: NETWORK.mainnet,
      address: USDC_TOKEN_ADDRESSES[NETWORK.mainnet]
    },
    /* WETH */
    '0x060fad1bca90e5b1efca0d93febec96e638fd8a6': {
      chainId: NETWORK.mainnet,
      address: WRAPPED_NATIVE_ASSETS[NETWORK.mainnet] as Lowercase<Address>
    },
    /* POOL */
    [POOL_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia].toLowerCase()]: {
      chainId: NETWORK.mainnet,
      address: lower(POOL_TOKEN_ADDRESSES[NETWORK.mainnet])
    }
  },
  [NETWORK.base_sepolia]: {
    /* ETH */
    [DOLPHIN_ADDRESS]: {
      chainId: NETWORK.mainnet,
      address: DOLPHIN_ADDRESS
    },
    /* DAI */
    '0xe4b4a71923aecb4b8924bda8c31941a8ab50ff86': {
      chainId: NETWORK.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    /* USDC */
    [USDC_TOKEN_ADDRESSES[NETWORK.base_sepolia]]: {
      chainId: NETWORK.mainnet,
      address: USDC_TOKEN_ADDRESSES[NETWORK.mainnet]
    },
    /* WETH */
    '0x019aa44d02715e4042b1ba3b4d2fa9bcef33c002': {
      chainId: NETWORK.mainnet,
      address: WRAPPED_NATIVE_ASSETS[NETWORK.mainnet] as Lowercase<Address>
    },
    /* POOL */
    [POOL_TOKEN_ADDRESSES[NETWORK.base_sepolia].toLowerCase()]: {
      chainId: NETWORK.mainnet,
      address: lower(POOL_TOKEN_ADDRESSES[NETWORK.mainnet])
    }
  }
}

/**
 * Redirects for offchain token rebrandings
 */
export const TOKEN_DATA_REDIRECTS: {
  [chainId: number]: { [address: Lowercase<Address>]: { name?: string; symbol?: string } }
} = {
  [NETWORK.optimism]: {
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': {
      name: 'USDC (Bridged from Ethereum)',
      symbol: 'USDC.e'
    }
  },
  [NETWORK.arbitrum]: {
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': {
      name: 'USDC (Bridged from Ethereum)',
      symbol: 'USDC.e'
    }
  },
  [NETWORK.polygon]: {
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': {
      name: 'USDC (Bridged from Ethereum)',
      symbol: 'USDC.e'
    }
  },
  [NETWORK.avalanche]: {
    '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664': {
      name: 'USDC (Bridged from Ethereum)',
      symbol: 'USDC.e'
    }
  }
}

/**
 * Domains
 */
export const DOMAINS = {
  app: 'https://app.cabana.fi',
  app_v4: 'https://app.pooltogether.com',
  landingPage: 'https://cabana.fi',
  protocolLandingPage: 'https://pooltogether.com',
  docs: 'https://docs.cabana.fi',
  protocolDocs: 'https://docs.pooltogether.com',
  protocolDevDocs: 'https://dev.pooltogether.com',
  governance: 'https://gov.pooltogether.com',
  poolExplorer: 'https://poolexplorer.win',
  tools_v4: 'https://tools.pooltogether.com',
  notion: 'https://pooltogetherdao.notion.site',
  vaultListCreator: 'https://lists.cabana.fi',
  vaultFactory: 'https://factory.cabana.fi',
  analytics: 'https://analytics.cabana.fi',
  swaps: 'https://swap.cabana.fi',
  rewardsBuilder: 'https://rewards.cabana.fi',
  flashLiquidator: 'https://flash.cabana.fi',
  migrations: 'https://migrate.cabana.fi',
  builders: 'https://builders.cabana.fi'
} as const satisfies { [name: string]: `https://${string}` }

/**
 * Links
 */
export const LINKS = {
  ...DOMAINS,
  termsOfService: `${DOMAINS.landingPage}/terms`,
  privacyPolicy: `${DOMAINS.landingPage}/privacy`,
  ecosystem: `${DOMAINS.protocolLandingPage}/ecosystem`,
  discord: `${DOMAINS.protocolLandingPage}/discord`,
  appDocs: `${DOMAINS.docs}/#the-cabana-app`,
  toolDocs: `${DOMAINS.docs}/#cabana-tools`,
  protocolBasicsDocs: `${DOMAINS.docs}/protocol/the-basics`,
  delegateDocs: `${DOMAINS.docs}/cabana-app/delegation`,
  prizeYieldDocs: `${DOMAINS.docs}/cabana-app/prize-yield`,
  factoryDocs: `${DOMAINS.docs}/cabana-tools/cabana-factory`,
  listDocs: `${DOMAINS.docs}/cabana-tools/cabana-lists`,
  analyticsDocs: `${DOMAINS.docs}/cabana-tools/cabanalytics`,
  swapDocs: `${DOMAINS.docs}/cabana-tools/cabana-swaps`,
  flashDocs: `${DOMAINS.docs}/cabana-tools/cabana-flash`,
  appGuides: `${DOMAINS.docs}/cabana-app/guides`,
  toolGuides: `${DOMAINS.docs}/cabana-tools/guides`,
  protocolFaqs: `${DOMAINS.docs}/protocol/faqs`,
  appFaqs: `${DOMAINS.docs}/cabana-app/faqs`,
  toolFaqs: `${DOMAINS.docs}/cabana-tools/faqs`,
  rewardTokenWhitelist: `${DOMAINS.docs}/cabana-app/bonus-rewards#reward-token-whitelist`,
  risks: `${DOMAINS.protocolDocs}/security/risks`,
  audits: `${DOMAINS.protocolDocs}/security/audits`,
  devDocs_v4: `${DOMAINS.protocolDevDocs}/protocol/V4/introduction`,
  depositDelegator: `${DOMAINS.tools_v4}/delegate`,
  prizeTierController: `${DOMAINS.tools_v4}/prize-tier-controller`,
  communityCalendar: `${DOMAINS.notion}/Community-Calendar-4ce3024241dd464db96215e6729a78e0`,
  brandKit: `https://www.figma.com/community/file/1212805243917604494`,
  twitter: `https://twitter.com/PoolTogether_`,
  github: `https://github.com/pooltogether`,
  medium: `https://medium.com/pooltogether`,
  tally: `https://www.tally.xyz/gov/pooltogether`,
  treasury: `https://info.pooltogether.com/treasury`,
  dune_v4: `https://dune.com/sarfang/PoolTogetherV4`,
  grants: `https://poolgrants.org`,
  hey: `https://hey.xyz/u/pooltogether`,
  mirror: `https://pooltogether.mirror.xyz/`,
  warpcast: `https://warpcast.com/~/channel/pool-together`,
  clientJs: `https://www.npmjs.com/package/@generationsoftware/hyperstructure-client-js`,
  clientJs_v4: `https://www.npmjs.com/package/@pooltogether/v4-client-js`,
  reactHooks: `https://www.npmjs.com/package/@generationsoftware/hyperstructure-react-hooks`
} as const satisfies { [name: string]: `https://${string}` }

/**
 * Block explorer mapping
 */
export const BLOCK_EXPLORERS: Record<NETWORK, { name: string; url: string }> = {
  [NETWORK.mainnet]: { name: 'Etherscan', url: 'https://etherscan.io/' },
  [NETWORK.sepolia]: { name: 'Etherscan', url: 'https://sepolia.etherscan.io/' },
  [NETWORK.bsc]: { name: 'Bscscan', url: 'https://bscscan.com/' },
  [NETWORK.bsc_testnet]: { name: 'Bscscan', url: 'https://testnet.bscscan.com/' },
  [NETWORK.xdai]: { name: 'Gnosisscan', url: 'https://gnosisscan.io/' },
  [NETWORK.polygon]: { name: 'Polygonscan', url: 'https://polygonscan.com/' },
  [NETWORK.mumbai]: { name: 'Polygonscan', url: 'https://mumbai.polygonscan.com/' },
  [NETWORK.optimism]: { name: 'Etherscan', url: 'https://optimistic.etherscan.io/' },
  [NETWORK.optimism_sepolia]: { name: 'Etherscan', url: 'https://sepolia-optimism.etherscan.io/' },
  [NETWORK.avalanche]: { name: 'Snowtrace', url: 'https://snowtrace.io/' },
  [NETWORK.fuji]: { name: 'Snowtrace', url: 'https://testnet.snowtrace.io/' },
  [NETWORK.celo]: { name: 'Celoscan', url: 'https://celoscan.io/' },
  [NETWORK.celo_testnet]: { name: 'Celoscan', url: 'https://alfajores.celoscan.io/' },
  [NETWORK.arbitrum]: { name: 'Arbiscan', url: 'https://arbiscan.io/' },
  [NETWORK.arbitrum_sepolia]: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io/' },
  [NETWORK.base]: { name: 'Basescan', url: 'https://basescan.org/' },
  [NETWORK.base_sepolia]: { name: 'Blockscout', url: 'https://sepolia.basescan.org/' }
}

/**
 * CoinGecko API URL
 */
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

/**
 * CoinGecko platform IDs
 */
export const COINGECKO_PLATFORMS = {
  [NETWORK.mainnet]: 'ethereum',
  [NETWORK.bsc]: 'binance-smart-chain',
  [NETWORK.xdai]: 'xdai',
  [NETWORK.polygon]: 'polygon-pos',
  [NETWORK.optimism]: 'optimistic-ethereum',
  [NETWORK.avalanche]: 'avalanche',
  [NETWORK.celo]: 'celo',
  [NETWORK.arbitrum]: 'arbitrum-one',
  [NETWORK.base]: 'base'
} as const
export type COINGECKO_PLATFORM = keyof typeof COINGECKO_PLATFORMS

/**
 * CoinGecko native token IDs
 */
export const COINGECKO_NATIVE_TOKEN_IDS: Record<NETWORK, string> = {
  [NETWORK.mainnet]: 'ethereum',
  [NETWORK.sepolia]: 'ethereum',
  [NETWORK.bsc]: 'binancecoin',
  [NETWORK.bsc_testnet]: 'binancecoin',
  [NETWORK.xdai]: 'xdai',
  [NETWORK.polygon]: 'matic-network',
  [NETWORK.mumbai]: 'matic-network',
  [NETWORK.optimism]: 'ethereum',
  [NETWORK.optimism_sepolia]: 'ethereum',
  [NETWORK.avalanche]: 'avalanche-2',
  [NETWORK.fuji]: 'avalanche-2',
  [NETWORK.celo]: 'celo',
  [NETWORK.celo_testnet]: 'celo',
  [NETWORK.arbitrum]: 'ethereum',
  [NETWORK.arbitrum_sepolia]: 'ethereum',
  [NETWORK.base]: 'ethereum',
  [NETWORK.base_sepolia]: 'ethereum'
}

/**
 * Second constants
 */
export const SECONDS_PER_MINUTE = 60
export const SECONDS_PER_HOUR = 3_600
export const SECONDS_PER_DAY = 86_400
export const SECONDS_PER_WEEK = 604_800
export const SECONDS_PER_MONTH = 2_628_000
export const SECONDS_PER_YEAR = 31_536_000

/**
 * Minute constants
 */
export const MINUTES_PER_HOUR = 60
export const MINUTES_PER_DAY = 1_440

/**
 * Max uint256 value
 */
export const MAX_UINT_256 = 2n ** 256n - 1n

/**
 * Max uint96 value
 */
export const MAX_UINT_96 = 2n ** 96n - 1n

/**
 * EIP2612 Permit Types
 */
export const EIP2612_PERMIT_TYPES = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
} as const

/**
 * Old DAI Permit Types
 */
export const OLD_DAI_PERMIT_TYPES = {
  Permit: [
    { name: 'holder', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
    { name: 'allowed', type: 'bool' }
  ]
} as const
