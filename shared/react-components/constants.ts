import { NETWORK } from '@pooltogether/hyperstructure-client-js'

/**
 * Token Logo URLs
 */
const tokenLogoUrls = Object.freeze({
  usdc: 'https://etherscan.io/token/images/centre-usdc_28.png',
  dai: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
  weth: 'https://etherscan.io/token/images/weth_28.png',
  wbtc: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
  gusd: 'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278'
})

/**
 * Token Logo Overrides
 *
 * NOTE: All addresses are lowercase
 */
export const TOKEN_LOGO_OVERRIDES: Record<NETWORK, { [address: Lowercase<string>]: string }> = {
  [NETWORK.mainnet]: {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': tokenLogoUrls.usdc
  },
  [NETWORK.goerli]: {},
  [NETWORK.sepolia]: {},
  [NETWORK.bsc]: {},
  [NETWORK['bsc-testnet']]: {},
  [NETWORK.xdai]: {},
  [NETWORK.polygon]: {
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': tokenLogoUrls.usdc
  },
  [NETWORK.mumbai]: {},
  [NETWORK.optimism]: {
    '0x4200000000000000000000000000000000000006': tokenLogoUrls.weth
  },
  [NETWORK['optimism-goerli']]: {
    '0xce0b8850408cac7145e11a793f98e22ae39391e2': tokenLogoUrls.dai,
    '0xa29377053623b8852306af711ecf6c7b855512e8': tokenLogoUrls.usdc,
    '0x993da7f244535b1f6f48be745889649a8ba21904': tokenLogoUrls.gusd,
    '0x3c8f76d0a36b8eceac04e7cee1ff62b55f6b1fa6': tokenLogoUrls.wbtc,
    '0x30f00f959897d80ae98fcb5fd513c9668884f231': tokenLogoUrls.weth
  },
  [NETWORK.avalanche]: {
    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': tokenLogoUrls.wbtc
  },
  [NETWORK.fuji]: {},
  [NETWORK.celo]: {},
  [NETWORK['celo-testnet']]: {},
  [NETWORK.arbitrum]: {},
  [NETWORK['arbitrum-goerli']]: {}
}

/**
 * TX Gas Amount Estimates
 */
export const TX_GAS_ESTIMATES = Object.freeze({
  approve: 50_000,
  deposit: 250_000,
  withdraw: 200_000
})
