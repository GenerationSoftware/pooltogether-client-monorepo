import { VaultList } from '@shared/types'
import { DOMAINS, NETWORK } from '@shared/utilities'

export const arbitrumVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.arbitrum,
    address: '0x97A9C02CFBBf0332D8172331461aB476dF1E8c95',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'przPOOL',
    logoURI: `${DOMAINS.app}/icons/przPOOL.svg`,
    extensions: {
      underlyingAsset: {
        address: '0xCF934E2402A5e072928a39a956964eb8F2B5B79C',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum,
    address: '0x3c72A2A78C29D1f6454CAA1bcB17a7792a180a2e',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'przUSDC',
    logoURI: `${DOMAINS.app}/icons/przUSDC.svg`,
    tags: ['aave'],
    extensions: {
      underlyingAsset: {
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        symbol: 'USDC',
        name: 'USD Coin'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0xaf88d065e77c8cc2239327c5edb3a432268e5831&marketName=proto_arbitrum_v3'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum,
    address: '0x7b0949204e7Da1B0beD6d4CCb68497F51621b574',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'przWETH',
    logoURI: `${DOMAINS.app}/icons/przWETH.svg`,
    tags: ['aave'],
    extensions: {
      underlyingAsset: {
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0x82af49447d8a07e3bd95bd0d56f35241523fbab1&marketName=proto_arbitrum_v3'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum,
    address: '0xCACBa8Be4bc225FB8d15a9A3b702f84ca3EBa991',
    name: 'Prize USDT',
    decimals: 6,
    symbol: 'przUSDT',
    logoURI: `${DOMAINS.app}/icons/przUSDT.svg`,
    tags: ['aave', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        symbol: 'USDT',
        name: 'Tether USD'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9&marketName=proto_arbitrum_v3'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum,
    address: '0x8653084e01Bd8c9e24B9a8fEb2036251Ee0C16A9',
    name: 'Prize USDA',
    decimals: 18,
    symbol: 'przUSDA',
    logoURI: `${DOMAINS.app}/icons/przUSDA.svg`,
    tags: ['angle', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0x0000206329b97DB379d5E1Bf586BbDB969C63274',
        symbol: 'USDA',
        name: 'USDA'
      },
      yieldSource: {
        name: 'Angle',
        appURI: 'https://angle.money/stusd'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum,
    address: '0x482CC95BC6c92D6254529DC2d45095663Ae726A2',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'przUSDC',
    logoURI: `${DOMAINS.app}/icons/przUSDC.svg`,
    tags: ['yearn', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        symbol: 'USDC.e',
        name: 'Bridged USDC'
      },
      yieldSource: {
        name: 'Yearn',
        appURI: 'https://yearn.fi/vaults/42161/0x482CC95BC6c92D6254529DC2d45095663Ae726A2'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum,
    address: '0x801c26fCfD916719631E0cf7D36ca1e049DF0373',
    name: 'Prize USDT',
    decimals: 6,
    symbol: 'przUSDT',
    logoURI: `${DOMAINS.app}/icons/przUSDT.svg`,
    tags: ['yearn', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        symbol: 'USDT',
        name: 'Tether USD'
      },
      yieldSource: {
        name: 'Yearn',
        appURI: 'https://yearn.fi/vaults/42161/0x801c26fCfD916719631E0cf7D36ca1e049DF0373'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum,
    address: '0x46A979f0F8e24E0e85e6C3A7dEeb4C5Abd355bA2',
    name: 'Prize USND',
    decimals: 18,
    symbol: 'przUSND',
    tags: ['yearn', 'nerite', 'deprecated'],
    extensions: {
      underlyingAsset: {
        address: '0x4ecf61a6c2FaB8A047CEB3B3B263B401763e9D49',
        symbol: 'USND',
        name: 'US Nerite Dollar'
      },
      yieldSource: {
        name: 'Yearn',
        appURI: 'https://yearn.fi/vaults/42161/0x46a979f0f8e24e0e85e6c3a7deeb4c5abd355ba2'
      }
    }
  }
]
