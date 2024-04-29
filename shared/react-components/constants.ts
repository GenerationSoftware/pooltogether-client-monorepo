import { LINKS, NETWORK, POOL_TOKEN_ADDRESSES, USDC_TOKEN_ADDRESSES } from '@shared/utilities'

/**
 * Token Logo URLs
 */
const tokenLogoUrls = {
  pool: 'https://etherscan.io/token/images/pooltogether_32.png',
  usdc: 'https://etherscan.io/token/images/centre-usdc_28.png',
  dai: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
  gusd: 'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
  weth: 'https://etherscan.io/token/images/weth_28.png',
  wbtc: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
  lusd: 'https://etherscan.io/token/images/liquitylusd_32.png',
  ageur: 'https://etherscan.io/token/images/ageur_32.png?=v982',
  op: 'https://optimistic.etherscan.io/token/images/optimism_32.png',
  veloLP: `${LINKS.app}/icons/przVELO.svg`
} as const

/**
 * Token Logo Overrides
 *
 * NOTE: All addresses are lowercase
 */
export const TOKEN_LOGO_OVERRIDES: Record<NETWORK, { [address: Lowercase<string>]: string }> = {
  [NETWORK.mainnet]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.mainnet].toLowerCase()]: tokenLogoUrls.pool,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': tokenLogoUrls.usdc,
    '0x6b175474e89094c44da98b954eedeac495271d0f': tokenLogoUrls.dai,
    '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': tokenLogoUrls.gusd,
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': tokenLogoUrls.weth,
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': tokenLogoUrls.wbtc,
    '0x5f98805a4e8be255a32880fdec7f6728c6568ba0': tokenLogoUrls.lusd
  },
  [NETWORK.sepolia]: {},
  [NETWORK.bsc]: {},
  [NETWORK.bsc_testnet]: {},
  [NETWORK.xdai]: {},
  [NETWORK.polygon]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.polygon].toLowerCase()]: tokenLogoUrls.pool,
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': tokenLogoUrls.usdc,
    '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359': tokenLogoUrls.usdc,
    '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': tokenLogoUrls.dai,
    '0xc8a94a3d3d2dabc3c1caffffdca6a7543c3e3e65': tokenLogoUrls.gusd,
    '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': tokenLogoUrls.weth,
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6': tokenLogoUrls.wbtc
  },
  [NETWORK.mumbai]: {},
  [NETWORK.optimism]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.optimism].toLowerCase()]: tokenLogoUrls.pool,
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': tokenLogoUrls.usdc,
    '0x0b2c639c533813f4aa9d7837caf62653d097ff85': tokenLogoUrls.usdc,
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': tokenLogoUrls.dai,
    '0x4200000000000000000000000000000000000006': tokenLogoUrls.weth,
    '0x68f180fcce6836688e9084f035309e29bf0a2095': tokenLogoUrls.wbtc,
    '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819': tokenLogoUrls.lusd,
    '0x9485aca5bbbe1667ad97c7fe7c4531a624c8b1ed': tokenLogoUrls.ageur,
    '0x4200000000000000000000000000000000000042': tokenLogoUrls.op,
    '0xdb1fe6da83698885104da02a6e0b3b65c0b0de80': tokenLogoUrls.veloLP,
    '0x6da98bde0068d10ddd11b468b197ea97d96f96bc': tokenLogoUrls.veloLP
  },
  [NETWORK.optimism_sepolia]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.optimism_sepolia].toLowerCase()]: tokenLogoUrls.pool,
    [USDC_TOKEN_ADDRESSES[NETWORK.optimism_sepolia]]: tokenLogoUrls.usdc,
    '0xef38f21ec5477f6e3d4b7e9f0dea44a788c669b0': tokenLogoUrls.dai,
    '0x68f92539f64e486f2853bb2892933a21b54829e5': tokenLogoUrls.gusd,
    '0x4a61b6f54157840e80e0c47f1a628c0b3744a739': tokenLogoUrls.weth,
    '0x6c6a62b0861d8f2b946456ba9dcd0f3baec54147': tokenLogoUrls.wbtc
  },
  [NETWORK.avalanche]: {
    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': tokenLogoUrls.wbtc
  },
  [NETWORK.fuji]: {},
  [NETWORK.celo]: {},
  [NETWORK.celo_testnet]: {},
  [NETWORK.arbitrum]: {},
  [NETWORK.arbitrum_sepolia]: {},
  [NETWORK.base]: {},
  [NETWORK.base_sepolia]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.base_sepolia].toLowerCase()]: tokenLogoUrls.pool,
    [USDC_TOKEN_ADDRESSES[NETWORK.base_sepolia]]: tokenLogoUrls.usdc,
    '0x82557c5157fcbeddd80ae09647ec018a0083a638': tokenLogoUrls.dai,
    '0x431bf0fe8acb5c79c4f4fbc63f6de0756e928dd3': tokenLogoUrls.gusd,
    '0x41d7ddf285a08c74a4cb9fdc979c703b10c30ab1': tokenLogoUrls.weth,
    '0x214e35ca60a828cc44fae2f2b97d37c116b02229': tokenLogoUrls.wbtc
  }
}

/**
 * TX Gas Amount Estimates
 */
export const TX_GAS_ESTIMATES = {
  approve: 50_000n,
  deposit: 400_000n,
  depositWithPermit: 450_000n,
  withdraw: 350_000n,
  delegate: 120_000n
} as const
