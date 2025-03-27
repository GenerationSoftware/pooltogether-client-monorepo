import { VaultList } from '@shared/types'
import { DOMAINS, NETWORK } from '@shared/utilities'

export const worldVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.world,
    address: '0x0045cC66eCf34da9D8D89aD5b36cB82061c0907C',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'przPOOL',
    logoURI: `${DOMAINS.app}/icons/przPOOL.svg`,
    extensions: {
      underlyingAsset: {
        address: '0x7077C71B4AF70737a08287E279B717Dcf64fdC57',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  }
]
