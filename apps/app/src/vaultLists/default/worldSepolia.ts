import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const worldSepoliaVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.world_sepolia,
    address: '0xFf8719561871fE862A4aF87D3dFEF0c34303Ed0c',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x456665431FD9549360Cb6A4FDB33251ad4B544B4',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.world_sepolia,
    address: '0xaaf954c54fae10877bf0a0ba9f5ca6129e13e450',
    name: 'Prize WLD',
    decimals: 18,
    symbol: 'pWLD',
    logoURI: 'https://assets.coingecko.com/coins/images/31069/standard/worldcoin.jpeg',
    extensions: {
      underlyingAsset: {
        address: '0x8803e47fD253915F9c860837f391Aa71B3e03c5A',
        symbol: 'WLD',
        name: 'Worldcoin'
      }
    }
  },
  {
    chainId: NETWORK.world_sepolia,
    address: '0xd262c57b43b9198e5375dd28fb6bcfe86557b4e6',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x211Db8FbDc34982654e39b1B3a8Ca3EF5c7826EA',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
