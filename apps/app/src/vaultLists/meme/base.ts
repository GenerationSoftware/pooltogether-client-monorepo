import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const baseVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.base,
    address: '0x813c1fa57ce3f5e8d622925f6062b34fe89e24b5',
    name: 'Prize 747 Airlines',
    decimals: 18,
    symbol: 'przCRASH',
    extensions: {
      underlyingAsset: {
        address: '0x621E87AF48115122Cd96209F820fE0445C2ea90e',
        symbol: 'CRASH',
        name: '747 Airlines'
      }
    }
  },
  {
    chainId: NETWORK.base,
    address: '0xCaDEacAE6976bEE87EC5Ba44B0a5608a2259C517',
    name: 'Prize Degen',
    decimals: 18,
    symbol: 'przDEGEN',
    extensions: {
      underlyingAsset: {
        address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
        symbol: 'DEGEN',
        name: 'Degen'
      }
    }
  },
  {
    chainId: NETWORK.base,
    address: '0x50b2271C06b528223063ca340C496a0ED6C08714',
    name: 'Prize Dude',
    decimals: 18,
    symbol: 'przDUDE',
    extensions: {
      underlyingAsset: {
        address: '0xCb2861a1ec1D0392afb9E342d5AA539e4f75b633',
        symbol: 'DUDE',
        name: 'Dude'
      }
    }
  }
]
