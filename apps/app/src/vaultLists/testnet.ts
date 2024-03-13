import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const testnetVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x332b1EB2Cc4046954725EbDFB8143fB8354ea9a7',
    name: 'Prize DAI - LY',
    decimals: 18,
    symbol: 'PDAI-LY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x34F166839C655F2DcD56638F2CE779fd9B5987a6',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x13E37b0Ca8b48fc2818C177c24635F90C1495C5c',
    name: 'Prize DAI - HY',
    decimals: 18,
    symbol: 'PDAI-HY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x34F166839C655F2DcD56638F2CE779fd9B5987a6',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x602d77e900eCD48ac9b51151936Dcc5Efe2e7FaE',
    name: 'Prize USDC - LY',
    decimals: 6,
    symbol: 'PUSDC-LY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xE9CB1A8c3C1b5bcE7c6C0FB15F31A3A56209207F',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xA2B0321B671A83a98Ff1F5a680b700864f57c6e7',
    name: 'Prize USDC - HY',
    decimals: 6,
    symbol: 'PUSDC-HY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xE9CB1A8c3C1b5bcE7c6C0FB15F31A3A56209207F',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xd96702995B2bBD78a9A39eF86f4fA5f9704fdC7D',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'PGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0xCe1fe3170d4ACEFBc3d06595EeF3A918F65000c2',
        symbol: 'GUSD',
        name: 'Gemini dollar'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xE77Db9f8b68BC47A82D4F47E68FB57535dF0086e',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'PWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x42fd018A6ac84478f28b3f7e322271C83064d737',
        symbol: 'WBTC',
        name: 'Wrapped BTC'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x98CED5d595e8981756f063db8D3c44a6Be9A8F86',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'PWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x1bcd630e1303cef37F19743fbFE84b1b14e7750c',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
