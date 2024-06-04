import { LINKS, NETWORK, POOL_TOKEN_ADDRESSES, USDC_TOKEN_ADDRESSES } from '@shared/utilities'

/**
 * Token Logo URLs
 */
const tokenLogoUrls = {
  pool: 'https://assets.coingecko.com/coins/images/14003/standard/PoolTogether.png?1696513732',
  usdc: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694',
  dai: 'https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png?1696509996',
  gusd: 'https://assets.coingecko.com/coins/images/5992/standard/gemini-dollar-gusd.png?1696506408',
  weth: 'https://assets.coingecko.com/coins/images/2518/standard/weth.png?1696503332',
  wbtc: 'https://assets.coingecko.com/coins/images/7598/standard/wrapped_bitcoin_wbtc.png?1696507857',
  lusd: 'https://assets.coingecko.com/coins/images/14666/standard/Group_3.png?1696514341',
  op: 'https://optimistic.etherscan.io/token/images/optimism_32.png',
  przVELO: `${LINKS.app}/icons/przVELO.svg`,
  steth: 'https://assets.coingecko.com/coins/images/13442/standard/steth_logo.png?1696513206',
  usdt: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661',
  usda: 'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/src/assets/tokens/stUSD.svg',
  eura: 'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/src/assets/tokens/stEUR.svg'
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
    '0x5f98805a4e8be255a32880fdec7f6728c6568ba0': tokenLogoUrls.lusd,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0x1a7e4e63778b4f12a199c062f3efdd288afcbce8': tokenLogoUrls.eura
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
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6': tokenLogoUrls.wbtc,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0xe0b52e49357fd4daf2c15e02058dce6bc0057db4': tokenLogoUrls.eura
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
    '0x4200000000000000000000000000000000000042': tokenLogoUrls.op,
    '0x9b53ef6f13077727d22cb4acad1119c79a97be17': tokenLogoUrls.przVELO,
    '0x9b4c0de59628c64b02d7ce86f21db9a579539d5a': tokenLogoUrls.przVELO,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0x9485aca5bbbe1667ad97c7fe7c4531a624c8b1ed': tokenLogoUrls.eura
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
  [NETWORK.arbitrum]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.arbitrum].toLowerCase()]: tokenLogoUrls.pool,
    '0xaf88d065e77c8cc2239327c5edb3a432268e5831': tokenLogoUrls.usdc,
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': tokenLogoUrls.usdc,
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': tokenLogoUrls.weth,
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': tokenLogoUrls.usdt,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0xfa5ed56a203466cbbc2430a43c66b9d8723528e7': tokenLogoUrls.eura
  },
  [NETWORK.arbitrum_sepolia]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia].toLowerCase()]: tokenLogoUrls.pool,
    [USDC_TOKEN_ADDRESSES[NETWORK.arbitrum_sepolia]]: tokenLogoUrls.usdc,
    '0xfe045beefda06606fc5f441ccca2fe8c903e9725': tokenLogoUrls.dai,
    '0x060fad1bca90e5b1efca0d93febec96e638fd8a6': tokenLogoUrls.weth
  },
  [NETWORK.base]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.base].toLowerCase()]: tokenLogoUrls.pool,
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': tokenLogoUrls.usdc,
    '0x50c5725949a6f0c72e6c4a641f24049a917db0cb': tokenLogoUrls.dai,
    '0x4200000000000000000000000000000000000006': tokenLogoUrls.weth,
    '0x368181499736d0c0cc614dbb145e2ec1ac86b8c6': tokenLogoUrls.lusd,
    '0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452': tokenLogoUrls.steth,
    '0x0000206329b97db379d5e1bf586bbdb969c63274': tokenLogoUrls.usda,
    '0xa61beb4a3d02decb01039e378237032b351125b4': tokenLogoUrls.eura
  },
  [NETWORK.base_sepolia]: {
    [POOL_TOKEN_ADDRESSES[NETWORK.base_sepolia].toLowerCase()]: tokenLogoUrls.pool,
    [USDC_TOKEN_ADDRESSES[NETWORK.base_sepolia]]: tokenLogoUrls.usdc,
    '0xe4b4a71923aecb4b8924bda8c31941a8ab50ff86': tokenLogoUrls.dai,
    '0x019aa44d02715e4042b1ba3b4d2fa9bcef33c002': tokenLogoUrls.weth
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
