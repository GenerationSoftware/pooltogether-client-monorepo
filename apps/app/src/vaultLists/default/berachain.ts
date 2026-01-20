import { VaultList } from '@shared/types'

export const berachainVaults: VaultList['tokens'] = [
  {
    chainId: 80094,
    address: '0x07882Ae1ecB7429a84f1D53048d35c4bB2056877',
    name: 'Prize HONEY',
    decimals: 18,
    symbol: 'przHONEY',
    extensions: {
      underlyingAsset: {
        address: '0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce',
        symbol: 'HONEY',
        name: 'Honey'
      },
      yieldSource: {
        name: 'Berachain'
      }
    }
  }
]
