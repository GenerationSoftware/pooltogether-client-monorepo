import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const scrollSepoliaVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.scroll_sepolia,
    address: '0xff44F114DAA9A7E75C998A2Bb9a1BB55BC25240B',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x7026b77376547Ba7961C16a4A05edaE070aBeC47',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.scroll_sepolia,
    address: '0xcCAaC4Ee88ac1939AEbc8B5C64B25550361ff5DD',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
    extensions: {
      underlyingAsset: {
        address: '0xc024E95Cf6BB2eFC424C9035Db4647A12d8dCAC9',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.scroll_sepolia,
    address: '0xeD7497BB13F527f3a7306c4b5C721993B98E386c',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x6F720053319f89c9670234989A5BD807A37d1792',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.scroll_sepolia,
    address: '0x6F36DB785ae66c6072883015a375d76341e36d11',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x6B0877bcB4720f094bc13187F5e16bdbf730693a',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
