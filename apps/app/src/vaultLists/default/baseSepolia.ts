import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const baseSepoliaVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.base_sepolia,
    address: '0x8Ec8328d3281F8275d6b44ffAdA9DF002B928AEa',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x50Ac98a0CA373a3935069A8755D895663d2F4A16',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.base_sepolia,
    address: '0x513cd9e4d06e86acfda1c5e7b93c4a3400d240d7',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0xe4B4A71923AecB4b8924bDA8C31941a8Ab50FF86',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.base_sepolia,
    address: '0xb974ba187814913d0415d1d0feda77febd3f2b32',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x034109D90E70B972617e96b33295E724FfF5887a',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.base_sepolia,
    address: '0xb948ad19895b36833c52ba1da5a77320d040ddbd',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x019Aa44D02715e4042b1BA3b4D2FA9bCEF33c002',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
