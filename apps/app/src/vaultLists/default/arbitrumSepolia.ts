import { VaultList } from '@shared/types'
import { NETWORK } from '@shared/utilities'

export const arbitrumSepoliaVaults: VaultList['tokens'] = [
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0xB608C0F9d37B14BDFEfc654B1FC8F38b34541a01',
    name: 'Prize POOL',
    decimals: 18,
    symbol: 'pPOOL',
    logoURI: 'https://etherscan.io/token/images/pooltogether_32.png',
    extensions: {
      underlyingAsset: {
        address: '0x02A32F041C16158bcC1CaA90e22B230958eD5c4b',
        symbol: 'POOL',
        name: 'PoolTogether'
      },
      yieldSource: {
        name: 'PoolTogether'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0xca45845b69c441a5d319e36c8aacd99df806e95d',
    name: 'Prize DAI',
    decimals: 18,
    symbol: 'pDAI',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png?1636636734',
    extensions: {
      underlyingAsset: {
        address: '0xFE045BEEfdA06606fc5f441ccCa2fE8C903e9725',
        symbol: 'DAI',
        name: 'Dai Stablecoin'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0xba9926560c2161761f1d438b3eb7884df02436bb',
    name: 'Prize USDC',
    decimals: 6,
    symbol: 'pUSDC',
    logoURI: 'https://etherscan.io/token/images/centre-usdc_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x7B2E0BD66ef04d26db132391b5600aF3887E9f9F',
        symbol: 'USDC',
        name: 'USD Coin'
      }
    }
  },
  {
    chainId: NETWORK.arbitrum_sepolia,
    address: '0x9b47c08d066184e65efb82828e53c0ad1729f992',
    name: 'Prize WETH',
    decimals: 18,
    symbol: 'pWETH',
    logoURI: 'https://etherscan.io/token/images/weth_28.png',
    extensions: {
      underlyingAsset: {
        address: '0x060faD1bCA90E5b1EFca0d93FEBeC96E638fD8A6',
        symbol: 'WETH',
        name: 'Wrapped Ether'
      }
    }
  }
]
