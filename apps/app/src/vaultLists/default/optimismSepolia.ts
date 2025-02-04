import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const optimismSepoliaVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xc72df1091fBc6904E580B399a45EFa1943532e98',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x858EE6f08f4C501FB6CB8D7c14B599CaeCbdf964',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x15908259161f52dFF2a25f08EE4d32074ED563c8',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
    extensions: {
      underlyingAsset: {
        address: '0xfcB9742207F3f5aEcdA6c19277844Bd6d477d494',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x3A1a6A3FD893f1e302fEb406148A6647b30F92a3',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x50db04090C1FEE4beD694E13637881e4dD2177F3',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xbdC33d890daa931C5656C972765DEa18122be365',
    name: 'Prize GUSD',
    decimals: 2,
    symbol: 'pGUSD',
    logoURI: 'https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png',
    extensions: {
      underlyingAsset: {
        address: '0x449B806EbC00466dd1B4b62Dc7d975C02514374c',
        symbol: 'GUSD',
        name: 'Gemini Dollar'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0xD2B1C965374316a33d1808F4aEDAF7320dD1B4f0',
    name: 'Prize WBTC',
    decimals: 8,
    symbol: 'pWBTC',
    logoURI: 'https://etherscan.io/token/images/wbtc_28.png?v=1',
    extensions: {
      underlyingAsset: {
        address: '0x4595Dc675B99d17Bd8aC0284D2A4e8456310267C',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin'
      }
    }
  },
  {
    chainId: NETWORK.optimism_sepolia,
    address: '0x86D3B87a8B08D8F2747d5F72575D8e7A943370b6',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x9B5A493D7AEb87583b392B599Fb62E4e9E3aa7a9',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
