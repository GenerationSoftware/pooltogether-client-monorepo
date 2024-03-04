import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const testnetVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.sepolia,
    address: '0x7DE52AcB8cEBc9713A804F5fdBd443e95234A31a',
    name: 'Prize DAI - LY',
    decimals: 18,
    symbol: 'PDAI-LY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x50088bF4dba58145c0B873643d285626f87837c3',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.sepolia,
    address: '0x17daE8454c24049E1Ec94a642014Fa3abf17ceDa',
    name: 'Prize DAI - HY',
    decimals: 18,
    symbol: 'PDAI-HY',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0x50088bF4dba58145c0B873643d285626f87837c3',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.sepolia,
    address: '0xa1dD041B4A0f2d01c43F0aCE522f968cCA9F747C',
    name: 'Prize USDC - LY',
    decimals: 6,
    symbol: 'PUSDC-LY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xd09eb8dE85D547cfBF09f972edCc6F871B192B70',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.sepolia,
    address: '0x8d8d5e80DaEC5C917d1b1E7A331dAE2Fa0a789F5',
    name: 'Prize USDC - HY',
    decimals: 6,
    symbol: 'PUSDC-HY',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xd09eb8dE85D547cfBF09f972edCc6F871B192B70',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.sepolia,
    address: '0xcA7042D10a36eB0F795476e529354D18ba204EDC',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'PGUSD',
    logoURI:
      'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png?1536745278',
    extensions: {
      underlyingAsset: {
        address: '0x2B8919310D8E2576E19e22794a6d3EC961cD812a',
        symbol: 'GUSD',
        name: 'Gemini dollar'
      }
    }
  },
  {
    chainId: NETWORK.sepolia,
    address: '0xad132763D325EFDa39E2ccBbc8E0eFA36fC6b4b8',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'PWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x0364994c88F97a18740Ec791A336b2d63407F8d5',
        symbol: 'WBTC',
        name: 'Wrapped BTC'
      }
    }
  },
  {
    chainId: NETWORK.sepolia,
    address: '0xc30151c7F49d2056E7C8197F189EFb5b54c0De0b',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'PWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x00a66C161e4C7A9dAEFd3dF8Cbbb08a3DE5b5F73',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
