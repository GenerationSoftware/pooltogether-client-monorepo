import { NETWORK } from '@shared/utilities'

/**
 * Token Logo URLs
 */
const tokenLogoUrls = Object.freeze({
  usdc: 'https://etherscan.io/token/images/centre-usdc_28.png',
  dai: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
  gusd: 'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
  weth: 'https://etherscan.io/token/images/weth_28.png',
  wbtc: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
  lusd: 'https://etherscan.io/token/images/liquitylusd_32.png',
  ageur: 'https://etherscan.io/token/images/ageur_32.png?=v982'
})

/**
 * Token Logo Overrides
 *
 * NOTE: All addresses are lowercase
 */
export const TOKEN_LOGO_OVERRIDES: Record<NETWORK, { [address: Lowercase<string>]: string }> = {
  [NETWORK.mainnet]: {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': tokenLogoUrls.usdc,
    '0x6b175474e89094c44da98b954eedeac495271d0f': tokenLogoUrls.dai,
    '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': tokenLogoUrls.gusd,
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': tokenLogoUrls.weth,
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': tokenLogoUrls.wbtc,
    '0x5f98805a4e8be255a32880fdec7f6728c6568ba0': tokenLogoUrls.lusd
  },
  [NETWORK.goerli]: {},
  [NETWORK.sepolia]: {},
  [NETWORK.bsc]: {},
  [NETWORK['bsc-testnet']]: {},
  [NETWORK.xdai]: {},
  [NETWORK.polygon]: {
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': tokenLogoUrls.usdc,
    '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063': tokenLogoUrls.dai,
    '0xc8a94a3d3d2dabc3c1caffffdca6a7543c3e3e65': tokenLogoUrls.gusd,
    '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619': tokenLogoUrls.weth,
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6': tokenLogoUrls.wbtc
  },
  [NETWORK.mumbai]: {},
  [NETWORK.optimism]: {
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607': tokenLogoUrls.usdc,
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1': tokenLogoUrls.dai,
    '0x4200000000000000000000000000000000000006': tokenLogoUrls.weth,
    '0x68f180fcce6836688e9084f035309e29bf0a2095': tokenLogoUrls.wbtc,
    '0xc40f949f8a4e094d1b49a23ea9241d289b7b2819': tokenLogoUrls.lusd,
    '0x9485aca5bbbe1667ad97c7fe7c4531a624c8b1ed': tokenLogoUrls.ageur
  },
  [NETWORK['optimism-goerli']]: {
    '0xb7930c829cc1de1b37a3bb9b477e33251da15a50': tokenLogoUrls.usdc,
    '0x4d07ba104ff254c19b443ade6224f744db84fb8a': tokenLogoUrls.dai,
    '0x041a898bc37129d2d2232163c3374f4077255f74': tokenLogoUrls.gusd,
    '0xb8e70b16b8d99753ce55f0e4c2a7eceeece30b64': tokenLogoUrls.weth,
    '0x331cdb619147a20c32e7b9391a4797ed9656b104': tokenLogoUrls.wbtc
  },
  [NETWORK['optimism-sepolia']]: {},
  [NETWORK.avalanche]: {
    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': tokenLogoUrls.wbtc
  },
  [NETWORK.fuji]: {},
  [NETWORK.celo]: {},
  [NETWORK['celo-testnet']]: {},
  [NETWORK.arbitrum]: {},
  [NETWORK['arbitrum-goerli']]: {},
  [NETWORK['arbitrum-sepolia']]: {
    '0x7a6dbc7ff4f1a2d864291db3aec105a8eee4a3d2': tokenLogoUrls.usdc,
    '0x08c19fe57af150a1af975cb9a38769848c7df98e': tokenLogoUrls.dai,
    '0xb84460d777133a4b86540d557db35952e4adfee7': tokenLogoUrls.gusd,
    '0x779275fc1b987db24463801f3708f42f3c6f6ceb': tokenLogoUrls.weth,
    '0x1bc266e1f397517ece9e384c55c7a5414b683639': tokenLogoUrls.wbtc
  },
  [NETWORK.base]: {},
  [NETWORK['base-goerli']]: {},
  [NETWORK['base-sepolia']]: {}
}

/**
 * TX Gas Amount Estimates
 */
export const TX_GAS_ESTIMATES = Object.freeze({
  approve: 50_000n,
  deposit: 350_000n,
  depositWithPermit: 400_000n,
  withdraw: 300_000n
})
