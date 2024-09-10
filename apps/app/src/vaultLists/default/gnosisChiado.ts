import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const gnosisChiadoVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.gnosis_chiado,
    address: '0x7c44c6dd009a36ef393dba89d9d1e1528648cb51',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0xA83A315BeD18b36308A518c7F77a2464E9F7286C',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.gnosis_chiado,
    address: '0xf7270b6f75dc1f8b8efa003c0096a39c71f16f9b',
    name: 'Prize WXDAI',
    decimals: 18,
    symbol: 'pWXDAI',
    logoURI: 'https://gnosisscan.io/token/images/wrappedxdai_32.png',
    extensions: {
      underlyingAsset: {
        address: '0xb2D0d7aD1D4b2915390Dc7053b9421F735A723E7',
        symbol: 'WXDAI',
        name: 'Wrapped xDai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.gnosis_chiado,
    address: '0xcb7c7b047f2f43e74ef40953f27e6a905711f2a8',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0xFC535B2407Bb2C8b4f4a4FaabBb9981FF031b7Ca',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.gnosis_chiado,
    address: '0x6e675d67d6472a3b081f5ef22f90662645343843',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x6b629bB304017D3D985D140599d8E6fC9942B9a7',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
