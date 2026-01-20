import { VaultList } from '@shared/types'

export const berachainVaults: VaultList['tokens'] = [
  {
    chainId: 80094,
    address: '0xD5897440f5133d71f0f21D625C5B99bbBf76a9b1',
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

