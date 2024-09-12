import { VaultList } from '@shared/types'
import { DOMAINS, NETWORK } from '@shared/utilities'

export const scrollVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.scroll,
    address: '0x29499E2EB8FF1d076a35C275AEDDD613Afb1Fa9B',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'przPOOL',
    logoURI: `${DOMAINS.app}/icons/przPOOL.svg`,
    extensions: {
      underlyingAsset: {
        address: '0xF9Af83FC41e0cc2af2fba93644D542Df6eA0F2b7',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.scroll,
    address: '0xFEb0Fe9850ABa3A52E72a8a694d422C2B47a5888',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'przWETH',
    logoURI: `${DOMAINS.app}/icons/przWETH.svg`,
    tags: ['aave'],
    extensions: {
      underlyingAsset: {
        address: '0x5300000000000000000000000000000000000004',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      },
      yieldSource: {
        name: 'Aave',
        appURI:
          'https://app.aave.com/reserve-overview/?underlyingAsset=0x5300000000000000000000000000000000000004&marketName=proto_scroll_v3'
      }
    }
  }
]
