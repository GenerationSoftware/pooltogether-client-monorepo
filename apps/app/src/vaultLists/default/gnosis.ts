import { VaultList } from '@shared/types'
import { DOMAINS, NETWORK } from '@shared/utilities'

export const gnosisVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.gnosis,
    address: '0xB75AF20eCadabed9049cc2f50E38bAd2768b35cf',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'przPOOL',
    logoURI: `${DOMAINS.app}/icons/przPOOL.svg`,
    extensions: {
      underlyingAsset: {
        address: '0x216a7d520992eD198593A16e0b17c784c9cdc660',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.gnosis,
    address: '0xBB7E99abCCCE01589Ad464Ff698aD139b0705d90',
    name: 'Prize WXDAI',
    decimals: 18,
    symbol: 'przWXDAI',
    tags: ['dsr'],
    extensions: {
      underlyingAsset: {
        address: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
        symbol: 'WXDAI',
        name: 'Wrapped XDAI'
      },
      yieldSource: {
        name: 'Spark',
        appURI: 'https://app.spark.fi/savings'
      }
    }
  }
]
